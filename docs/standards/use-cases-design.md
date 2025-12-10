# Use Case Design Guide

## Philosophy

Use cases coordinate domain operations without duplicating business logic. They orchestrate workflow: fetch aggregates, call their methods, save results, publish events.

**Tell, Don't Ask: Call aggregate methods, don't extract state to make domain decisions**

Use cases coordinate workflow (fetch, call methods, save, publish). Domain invariants and data integrity checks live in aggregate methods. Use cases may enforce application policies (authorization, existence) but don't duplicate aggregate-level validation.

## Tell, Don't Ask

### ❌ Ask (extract data, make decisions in use case)

```typescript
export class WithdrawFromAccountUseCase {
    async execute(params: { accountId: string, amount: number }): Promise<void> {
        const account = await this.finder.execute({ id: params.accountId });

        // Asking for data and making domain decisions
        const primitives = account.toPrimitives();
        const balance = primitives.currentBalance.amount;

        if (balance < params.amount) {
            throw new InsufficientFundsError();
        }

        if (params.amount <= 0) {
            throw new InvalidAmountError();
        }

        // Direct manipulation instead of telling aggregate what to do
        const newBalance = balance - params.amount;
        const updated = Account.fromPrimitives({
            ...primitives,
            currentBalance: {
                amount: newBalance,
                currency: primitives.currentBalance.currency
            },
        });

        await this.repository.save(updated);
    }
}
```

**Problems:**
- Business rules duplicated outside aggregate
- Use case knows too much about account internals
- Validation logic scattered across codebase
- Hard to maintain - rules in multiple places

### ✅ Tell (delegate to aggregate behavior)

```typescript
export class WithdrawFromAccountUseCase {
    async execute(params: { accountId: string, amount: number }): Promise<void> {
        const account = await this.finder.execute({ id: params.accountId });

        // Tell aggregate what to do - it handles validation and business rules
        account.withdraw(params.amount);

        await this.repository.save(account);
    }
}
```

**Benefits:**
- Aggregate encapsulates business rules
- Single source of truth for validation
- Use case is thin orchestration layer
- Easy to test - aggregate tests cover business logic

## The Pattern

### Structure

```typescript
export class UpdateAccountUseCase {
    constructor(
        private readonly finder: FindAccount,
        private readonly repository: AccountRepository,
    ) {}

    async execute(params: {
        accountId: string;
        name: string;
    }): Promise<void> {
        // 1. Fetch aggregate
        const account = await this.finder.execute({ id: params.accountId });

        // 2. Tell aggregate what to do
        account.rename(params.name);

        // 3. Persist changes
        await this.repository.save(account);
    }
}
```

**Key characteristics:**
- Class with dependencies via constructor
- Single `execute()` method as public API
- Accepts primitives, not domain objects
- Delegates to aggregate methods
- Orchestrates workflow

## Three Use Case Patterns

### 1. Create Pattern

**Uses:** Repository only (no finder needed)

```typescript
export class CreateAccountUseCase {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: {
        id: string;
        userId: string;
        name: string;
        initialBalanceAmount: number;
        currency: string;
    }): Promise<void> {
        // 1. Create aggregate using factory method
        const account = Account.create({
            id: params.id,
            userId: params.userId,
            name: params.name,
            initialBalance: {
                amount: params.initialBalanceAmount,
                currency: params.currency,
            },
        });

        // 2. Persist
        await this.repository.save(account);
    }
}
```

**Why no Finder?** New aggregates don't exist yet. Use repository for conditional checks if needed:

```typescript
// Check existence before creating
const existing = await this.repository.search(new AccountId(params.id));
if (existing) {
    throw new AccountAlreadyExistsError(params.id);
}
```

### 2. Update Pattern

**Uses:** Finder + Repository (guaranteed existence)

```typescript
export class UpdateAccountUseCase {
    constructor(
        private readonly finder: FindAccount,
        private readonly repository: AccountRepository,
    ) {}

    async execute(params: {
        accountId: string;
        name: string;
    }): Promise<void> {
        // 1. Find (throws if not found)
        const account = await this.finder.execute({ id: params.accountId });

        // 2. Tell aggregate what to do
        account.rename(params.name);

        // 3. Persist
        await this.repository.save(account);
    }
}
```

**Why Finder?** Updates require existence. Finder throws if not found, simplifying use case logic.

### 3. Query Pattern

**Uses:** Repository + toPrimitives (read-only)

```typescript
export class ListAccountsByUserUseCase {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: {
        userId: string;
    }): Promise<Array<Primitives<Account>>> {
        // 1. Fetch aggregates
        const accounts = await this.repository.searchByUserId(
            new UserId(params.userId)
        );

        // 2. Convert to primitives for client
        return accounts.map(account => account.toPrimitives());
    }
}
```

**Why toPrimitives()?** Clients consume primitives, not domain objects. Query use cases return serialized data.

## Rules

### 1. When to Use Finder vs Repository

| Use Case Type | Dependency | Reasoning |
|---------------|------------|-----------|
| Create | Repository | Aggregate doesn't exist yet |
| Update/Delete | Finder | Existence required, throw if not found |
| Conditional Create | Repository | Need to check existence (null is valid) |
| Query (single) | Finder or Repository | Finder if not found = error, Repository if null OK |
| Query (list) | Repository | Multiple results, empty array is valid |

**Example - Conditional Create:**
```typescript
// Need to check if account exists before creating
const existing = await this.repository.search(accountId);
if (existing) {
    throw new AccountAlreadyExistsError(accountId.value);
}
```

**Example - Query Single with Finder:**
```typescript
// Not finding account is an error for the client
const account = await this.finder.execute({ id: params.accountId });
return account.toPrimitives();
```

### 2. Event Publishing Happens in Use Case

Domain events are published **after** persistence, in the application layer.

```typescript
export class UpdateAccountUseCase {
    constructor(
        private readonly finder: FindAccount,
        private readonly repository: AccountRepository,
        private readonly eventBus: EventBus,  // Event publishing dependency
    ) {}

    async execute(params: { accountId: string, name: string }): Promise<void> {
        const account = await this.finder.execute({ id: params.accountId });

        account.rename(params.name);  // Generates domain event

        await this.repository.save(account);

        // Publish events after successful persistence
        await this.eventBus.publish(account.pullDomainEvents());
    }
}
```

**Why in use case?**
- Application orchestration concern
- Only publish if persistence succeeds
- Transaction boundary control

### 3. Public API Accepts Primitives Only

The `execute()` method accepts primitives, creates value objects internally.

```typescript
// ✅ Primitives in public API
async execute(params: {
    accountId: string;    // Not AccountId
    userId: string;       // Not UserId
    amount: number;       // Not Money
}): Promise<void> {
    // Create value objects inside
    const account = await this.finder.execute({ id: params.accountId });
    account.deposit(params.amount);
    await this.repository.save(account);
}

// ❌ Never expose value objects in public API
async execute(params: {
    accountId: AccountId;
    userId: UserId;
    amount: Money;
}): Promise<void> { }
```

**Why primitives?**
- Consistent with aggregate public methods (also use primitives)
- Easier to call from controllers/infrastructure
- Clean serialization boundaries

### 4. Business Logic Lives in Aggregates

Use cases delegate decisions to aggregates.

```typescript
// ✅ Aggregate handles business logic
export class WithdrawFromAccountUseCase {
    async execute(params: { accountId: string, amount: number }): Promise<void> {
        const account = await this.finder.execute({ id: params.accountId });

        // Aggregate validates and enforces rules
        account.withdraw(params.amount);

        await this.repository.save(account);
    }
}

// Inside Account aggregate:
withdraw(amount: number): void {
    if (amount <= 0) {
        throw new InvalidAmountError("Withdrawal amount must be positive");
    }

    const newBalance = this.currentBalance.subtract(amount);

    if (newBalance.isNegative()) {
        throw new InsufficientFundsError(
            this.currentBalance.amount,
            amount
        );
    }

    this.currentBalance = newBalance;
    this.record(new MoneyWithdrawnDomainEvent(this.id.value, amount));
}
```

**Distinction between domain invariants and application policies:**

- **Domain invariants** (in aggregate): Data integrity, business rules that must always be true
  - Example: withdrawal amount must be positive, balance can't go negative
  - These live in aggregate methods

- **Application policies** (can be in use case): Application-level concerns, not core domain rules
  - Example: rate limiting, feature flags, external service checks
  - These can live in use cases when needed

### 5. Use Case Orchestrates: Fetch → Call → Save → Publish

Standard workflow pattern:

```typescript
async execute(params: Parameters): Promise<ReturnType> {
    // 1. FETCH - Get aggregates (via finder/repository)
    const aggregate = await this.finder.execute({ id: params.id });

    // 2. CALL - Tell aggregate what to do
    aggregate.doSomething(params.value);

    // 3. SAVE - Persist changes
    await this.repository.save(aggregate);

    // 4. PUBLISH - Emit domain events
    await this.eventBus.publish(aggregate.pullDomainEvents());

    // Optional: return primitives for queries
    return aggregate.toPrimitives();
}
```

**For queries, skip save and publish:**
```typescript
async execute(params: Parameters): Promise<Primitives<Aggregate>> {
    const aggregate = await this.repository.search(...);
    return aggregate.toPrimitives();
}
```

## Organization

### Example File Structure

```
src/
├── accounts/
│   ├── application/
│   │   ├── use-case.create-account.ts
│   │   ├── use-case.update-account.ts
│   │   ├── use-case.delete-account.ts
│   │   ├── use-case.find-account.ts
│   │   └── use-case.list-accounts-by-user.ts
│   └── domain/
│       ├── Account.ts
│       ├── repository.account.ts
│       └── finder.account.ts
```

### Naming Convention

**Pattern:** `use-case.{action}-{aggregate}.ts`

```typescript
use-case.create-account.ts        // CreateAccountUseCase
use-case.update-account.ts        // UpdateAccountUseCase
use-case.delete-account.ts        // DeleteAccountUseCase
use-case.find-account.ts          // FindAccountUseCase
use-case.list-accounts-by-user.ts // ListAccountsByUserUseCase
```

## Complete Examples

### Create Use Case

```typescript
// accounts/application/use-case.create-account.ts
export class CreateAccountUseCase {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: {
        id: string;
        userId: string;
        name: string;
        initialBalanceAmount: number;
        currency: string;
    }): Promise<void> {
        const account = Account.create({
            id: params.id,
            userId: params.userId,
            name: params.name,
            initialBalance: {
                amount: params.initialBalanceAmount,
                currency: params.currency,
            },
        });

        await this.repository.save(account);
    }
}
```

### Update Use Case

```typescript
// accounts/application/use-case.update-account.ts
export class UpdateAccountUseCase {
    constructor(
        private readonly finder: FindAccount,
        private readonly repository: AccountRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(params: {
        accountId: string;
        name: string;
    }): Promise<void> {
        const account = await this.finder.execute({ id: params.accountId });

        account.rename(params.name);

        await this.repository.save(account);
        await this.eventBus.publish(account.pullDomainEvents());
    }
}
```

### Query Use Case

```typescript
// accounts/application/use-case.list-accounts-by-user.ts
export class ListAccountsByUserUseCase {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: {
        userId: string;
    }): Promise<Array<Primitives<Account>>> {
        const accounts = await this.repository.searchByUserId(
            new UserId(params.userId)
        );

        return accounts.map(account => account.toPrimitives());
    }
}
```

## Why This Design?

**Tell, Don't Ask:** Aggregates encapsulate business logic, use cases just coordinate.

**Thin Layer:** Use cases have minimal logic - just workflow orchestration.

**Type Safety:** Primitives in public API, value objects internally.

**Clear Responsibilities:**
- Use Case: Coordinate workflow
- Aggregate: Enforce business rules
- Repository: Abstract data access
- Finder: Guarantee existence

**Testability:** Business logic in aggregates, easy to test in isolation.

## Summary

Use cases coordinate domain operations:
- Tell aggregate methods, don't extract state
- Create pattern: Repository only
- Update pattern: Finder + Repository
- Query pattern: Repository + toPrimitives
- Public API uses primitives only
- Events published after persistence
- Orchestrate: fetch → call → save → publish
