# Aggregates Design Guide

## Philosophy

Aggregates are the core of our domain model. We use a **simple, consistent pattern** that prioritizes:
- **Type safety** without boilerplate
- **Clear boundaries** between domain and primitives
- **Minimal API surface** to reduce cognitive load

This design respects **Tell, Don't Ask** and the **Law of Demeter**: aggregates expose behavior (commands), not internal state. Callers tell the aggregate what to do, they don't ask for data to manipulate it themselves.

## The Pattern

### Structure

```typescript
export class Account extends AggregateRoot {
    constructor(
        public readonly id: AccountId,
        public name: AccountName,
        public balance: AccountBalance,
        public userId: UserId,
    ) {
        super();
    }

    static fromPrimitives(primitives: Primitives<Account>): Account {
        return new Account(
            new AccountId(primitives.id),
            new AccountName(primitives.name),
            new AccountBalance(primitives.balance),
            new UserId(primitives.userId),
        );
    }

    static create(id: string, name: string, userId: string): Account {
        const account = Account.fromPrimitives({
            id,
            name,
            balance: 0,
            userId,
        });

        account.record(new AccountCreatedDomainEvent(id, name, userId));

        return account;
    }

    deposit(amount: number): void {
        this.balance = new AccountBalance(this.balance.value + amount);
        this.record(new DepositMadeDomainEvent(this.id.value, amount));
    }

    toPrimitives(): Primitives<Account> {
        return {
            id: this.id.value,
            name: this.name.value,
            balance: this.balance.value,
            userId: this.userId.value,
        };
    }
}
```

### Value Objects

Value objects are **thin semantic wrappers** that provide type safety:

```typescript
export class AccountId extends StringValueObject {}
export class AccountName extends StringValueObject {}
export class AccountBalance extends NumberValueObject {}
```

**Why?** They make impossible states impossible:
```typescript
// ❌ This won't compile:
account.rename(accountId);

// ✅ Type system enforces correctness:
account.rename("New Name");
```

## Rules

### 1. Never Use Constructors Directly

**Why constructor is public:** TypeScript needs it for `Primitives<T>` type inference.

**Convention:** NEVER call `new Account()` outside the class.

```typescript
// ❌ NEVER do this:
const account = new Account(
    new AccountId("123"),
    new AccountName("Savings"),
    new AccountBalance(1000),
    new UserId("user-1")
);

// ✅ Use fromPrimitives (reconstitution):
const account = Account.fromPrimitives({
    id: "123",
    name: "Savings",
    balance: 1000,
    userId: "user-1",
});

// ✅ Or use factory methods (new instances):
const account = Account.create("123", "Savings", "user-1");
```

**When to use each:**
- `fromPrimitives()`: Reconstituting from database/API (no domain events)
- `create()`: Creating new instances (records domain event)

### 2. Never Add Specific Getters

**Why no getters:** Reduces API surface, forces consistency.

```typescript
// ❌ NEVER add these methods:
class Account {
    getId(): string { return this.id.value; }
    getName(): string { return this.name.value; }
    getBalance(): number { return this.balance.value; }
}

// ✅ Use toPrimitives() instead:
const primitives = account.toPrimitives();
console.log(primitives.id);
console.log(primitives.name);
console.log(primitives.balance);
```

### 3. Public APIs Accept Primitives, Not Domain Objects

**Rule:** Public methods (commands) NEVER accept value objects or domain models as arguments. Always use primitives.

**Why:** This keeps the aggregate's public interface clean and decoupled from internal implementation details (Law of Demeter).

```typescript
class Account {
    // ❌ NEVER expose value objects in public API:
    deposit(amount: AccountBalance): void { ... }
    transferTo(target: AccountId): void { ... }

    // ✅ Always use primitives:
    deposit(amount: number): void {
        // Create value objects internally
        this.balance = new AccountBalance(this.balance.value + amount);
        this.record(new DepositMadeDomainEvent(this.id.value, amount));
    }

    transferTo(targetAccountId: string, amount: number): void {
        // Create value objects internally
        const target = new AccountId(targetAccountId);
        // ... business logic
    }
}
```

**Benefits:**
- Callers don't need to know about internal value objects
- Easier to test (no need to construct VOs in tests)
- Cleaner API boundaries

### 4. Domain Methods Only

Only expose methods that **represent business operations**:

```typescript
class Account {
    // ✅ Business operations:
    deposit(amount: number): void { ... }
    withdraw(amount: number): void { ... }
    rename(newName: string): void { ... }
    close(): void { ... }

    // ❌ Not business operations (use toPrimitives):
    getBalance(): number { ... }
    isActive(): boolean { ... }
}
```

### 5. Constructor vs Factory Pattern

```typescript
class Account {
    // For reconstitution (no events)
    constructor(id, name, balance, userId) { }

    // For reconstitution from primitives
    static fromPrimitives(primitives) { }

    // For new instances (with events)
    static create(id, name, userId) {
        // Creates account with initial state
        // Records AccountCreatedDomainEvent
    }
}
```

## The Primitives<T> Pattern

The `Primitives<T>` type automatically converts between domain and primitive types:

```typescript
// Domain object:
class Account {
    id: AccountId;           // StringValueObject
    name: AccountName;       // StringValueObject
    balance: AccountBalance; // NumberValueObject
}

// Primitives<Account> automatically becomes:
{
    id: string;
    name: string;
    balance: number;
}
```

**Benefits:**
1. No manual DTO classes
2. Compile-time safety for serialization
3. Single source of truth for structure

## Complete Example

```typescript
// Use case
async execute(accountId: string, amount: number): Promise<void> {
    // ✅ Reconstitute from repository
    const account = await this.repository.find(accountId);

    // ✅ Business operation (primitives as arguments)
    account.deposit(amount);

    // ✅ Access data via primitives
    const primitives = account.toPrimitives();
    this.logger.info(`New balance: ${primitives.balance}`);

    // Save
    await this.repository.save(account);
}
```

## Common Mistakes

```typescript
// ❌ Using constructor directly
const account = new Account(...);

// ❌ Adding getters
account.getBalance();

// ❌ Exposing properties directly
return account.balance.value;

// ❌ Accepting VOs in public methods
account.deposit(new AccountBalance(100));

// ❌ Using fromPrimitives for new instances
const account = Account.fromPrimitives({ id: uuid(), ... }); // No event!

// ✅ Correct patterns
const account = Account.fromPrimitives(data);  // Reconstitution
const account = Account.create(id, name);      // New instance
const primitives = account.toPrimitives();     // Access data
account.deposit(100);                          // Primitives in public API
console.log(primitives.balance);
```

## Why This Design?

**Tell, Don't Ask:** Aggregates expose commands (behavior), not queries (state). Clients tell aggregates what to do, they don't extract data to manipulate it.

**Law of Demeter:** Public methods accept primitives, hiding internal structure (value objects). Changes to internal implementation don't affect callers.

**Simplicity:** One way to do things = less cognitive load.

**Type Safety:** Compiler prevents category errors (passing ID where name expected).

**Consistency:** `fromPrimitives()` + `toPrimitives()` everywhere.

**Minimal API:** Only business operations exposed.

**Event Sourcing:** Clear separation between reconstitution (constructor) and creation (factory).
