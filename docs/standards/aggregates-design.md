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
export type AccountPrimitives = {
    id: string;
    name: string;
    balance: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export class Account extends AggregateRoot {
    private constructor(
        private readonly id: AccountId,
        private name: AccountName,
        private balance: AccountBalance,
        private userId: UserId,
        private readonly createdAt: Date,
        private updatedAt: Date,
    ) {
        super();
    }

    static fromPrimitives(primitives: AccountPrimitives): Account {
        return new Account(
            new AccountId(primitives.id),
            new AccountName(primitives.name),
            new AccountBalance(primitives.balance),
            new UserId(primitives.userId),
            dateFromPrimitive(primitives.createdAt),
            dateFromPrimitive(primitives.updatedAt),
        );
    }

    static create(params: {
        id: string;
        name: string;
        userId: string;
    }): Account {
        const now = dateToPrimitive(new Date());
        const account = Account.fromPrimitives({
            id: params.id,
            name: params.name,
            balance: 0,
            userId: params.userId,
            createdAt: now,
            updatedAt: now,
        });

        account.record(new AccountCreatedDomainEvent(params.id, params.name, params.userId));

        return account;
    }

    deposit(amount: number): void {
        this.balance = new AccountBalance(this.balance.value + amount);
        this.updatedAt = new Date();
        this.record(new DepositMadeDomainEvent(this.id.value, amount));
    }

    toPrimitives(): AccountPrimitives {
        return {
            id: this.id.value,
            name: this.name.value,
            balance: this.balance.value,
            userId: this.userId.value,
            createdAt: dateToPrimitive(this.createdAt),
            updatedAt: dateToPrimitive(this.updatedAt),
        };
    }
}
```

> **Note:** Domain events (like `AccountCreatedDomainEvent`, `DepositMadeDomainEvent`) are not currently supported in our codebase. The examples above are for reference and illustrate the complete pattern. You can omit `record()` calls in your implementations for now.

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

**Why constructor is private:** Enforces true encapsulation—only factory methods can create instances, and properties are never exposed directly.

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
    // Constructor (only used internally by fromPrimitives)
    constructor(id, name, balance, userId, createdAt, updatedAt) { }

    // For reconstitution from database/API
    static fromPrimitives(primitives: AccountPrimitives): Account {
        // Converts primitives to domain objects
        // No domain events
    }

    // For new instances - independent signature
    static create(params: { id: string; name: string; userId: string }): Account {
        // Prepares primitives with defaults (balance: 0, timestamps)
        // Delegates to fromPrimitives for construction
        // Records AccountCreatedDomainEvent
    }
}
```

**Key Points:**
- `create()` signature is independent from `*Primitives` type
- `create()` sets defaults and delegates to `fromPrimitives()`
- This decouples factory API from serialization contract

## The Explicit Primitives Pattern

Each aggregate defines and exports its own explicit `*Primitives` type that represents the serializable contract. This type must be:

1. **Exported** alongside the aggregate class
2. **Simple types only**: string, number, boolean, null, or nested plain objects
3. **Self-contained**: Include all data needed for reconstitution

Example:

```typescript
// Each aggregate exports its primitives type
export type AccountPrimitives = {
    id: string;
    name: string;
    balance: number;
    userId: string;
    createdAt: string;  // ISO 8601 date string
    updatedAt: string;  // ISO 8601 date string
};

// Domain object with value objects:
export class Account extends AggregateRoot {
    id: AccountId;           // StringValueObject
    name: AccountName;       // StringValueObject
    balance: AccountBalance; // NumberValueObject
    userId: UserId;          // StringValueObject
    createdAt: Date;
    updatedAt: Date;
}
```

**Benefits:**
1. Each aggregate owns its serialization contract
2. Simple types for API/RPC type inference
3. Explicit boundaries between domain and primitives
4. Easy to validate and document

**Date Handling:**
Use helper functions for date serialization:

```typescript
import { dateFromPrimitive, dateToPrimitive } from "~/_shared/domain/primitives";

// Converting to primitives
toPrimitives(): AccountPrimitives {
    return {
        // ... other fields
        createdAt: dateToPrimitive(this.createdAt),  // Date → ISO string
        updatedAt: dateToPrimitive(this.updatedAt),
    };
}

// Converting from primitives
static fromPrimitives(primitives: AccountPrimitives): Account {
    return new Account(
        // ... other fields
        dateFromPrimitive(primitives.createdAt),  // ISO string → Date
        dateFromPrimitive(primitives.updatedAt),
    );
}
```

**Complex Value Objects:**
For value objects like `Money`, use nested objects in primitives:

```typescript
export type AccountPrimitives = {
    id: string;
    initialBalance: { amount: number; currency: string };  // Money as nested object
    currentBalance: { amount: number; currency: string };
    // ... other fields
};

export class Account extends AggregateRoot {
    initialBalance: Money;  // Value object
    currentBalance: Money;

    toPrimitives(): AccountPrimitives {
        return {
            // ... other fields
            initialBalance: this.initialBalance.toPrimitives(),
            currentBalance: this.currentBalance.toPrimitives(),
        };
    }

    static fromPrimitives(primitives: AccountPrimitives): Account {
        return new Account(
            // ... other fields
            new Money(primitives.initialBalance.amount, primitives.initialBalance.currency),
            new Money(primitives.currentBalance.amount, primitives.currentBalance.currency),
        );
    }
}
```

## Complete Example

Here's a complete aggregate following all the patterns:

```typescript
import { AggregateRoot } from "~/_shared/domain/aggregate-root";
import { dateFromPrimitive, dateToPrimitive } from "~/_shared/domain/primitives";

// 1. Define and export the primitives type
export type CategoryPrimitives = {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

// 2. Define the aggregate
export class Category extends AggregateRoot {
    constructor(
        public readonly id: CategoryId,
        public readonly userId: UserId,
        public name: CategoryName,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) {
        super();
    }

    // 3. Reconstitution from primitives
    static fromPrimitives(primitives: CategoryPrimitives): Category {
        return new Category(
            new CategoryId(primitives.id),
            new UserId(primitives.userId),
            new CategoryName(primitives.name),
            dateFromPrimitive(primitives.createdAt),
            dateFromPrimitive(primitives.updatedAt),
        );
    }

    // 4. Factory method for new instances
    static create(params: {
        id: string;
        userId: string;
        name: string;
    }): Category {
        const now = dateToPrimitive(new Date());
        return Category.fromPrimitives({
            id: params.id,
            userId: params.userId,
            name: params.name,
            createdAt: now,
            updatedAt: now,
        });
    }

    // 5. Business methods accept primitives
    update(name: string): void {
        this.name = new CategoryName(name);
        this.updatedAt = new Date();
    }

    belongsTo(userId: string): boolean {
        return this.userId.value === userId;
    }

    // 6. Serialization to primitives
    toPrimitives(): CategoryPrimitives {
        return {
            id: this.id.value,
            userId: this.userId.value,
            name: this.name.value,
            createdAt: dateToPrimitive(this.createdAt),
            updatedAt: dateToPrimitive(this.updatedAt),
        };
    }
}
```

**Using in application layer:**

```typescript
// Use case
async execute(categoryId: string, newName: string): Promise<CategoryPrimitives> {
    // ✅ Reconstitute from repository
    const category = await this.repository.find(new CategoryId(categoryId));

    // ✅ Business operation (primitives as arguments)
    category.update(newName);

    // Save
    await this.repository.save(category);

    // ✅ Return primitives (API boundary)
    return category.toPrimitives();
}
```

## Common Mistakes

```typescript
// ❌ Forgetting to export primitives type
type CategoryPrimitives = { ... };  // Not exported!

// ❌ Using complex types in primitives
export type CategoryPrimitives = {
    createdAt: ISODateTime;  // ❌ Template literal type
    metadata: Map<string, any>;  // ❌ Not JSON-serializable
};

// ❌ Coupling create() to Primitives type
static create(params: Omit<CategoryPrimitives, "createdAt" | "updatedAt">): Category {
    // This ties factory API to serialization contract
}

// ✅ Independent create() signature
static create(params: { id: string; name: string; userId: string }): Category {
    // Factory API is independent from serialization
}

// ❌ Using constructor directly
const account = new Account(...);

// ❌ Adding specific getters
account.getBalance();

// ❌ Exposing value objects in public methods
account.deposit(new AccountBalance(100));

// ❌ Not updating updatedAt
update(name: string): void {
    this.name = new CategoryName(name);
    // Missing: this.updatedAt = new Date();
}

// ✅ Correct patterns
const category = Category.fromPrimitives(data);               // Reconstitution
const category = Category.create({ id, userId, name });       // New entry
const primitives = category.toPrimitives();                   // Access data
category.update("New Name");                                  // Primitives in API
console.log(primitives.name);
```

## Why This Design?

**Tell, Don't Ask:** Aggregates expose commands (behavior), not queries (state). Clients tell aggregates what to do, they don't extract data to manipulate it.

**Law of Demeter:** Public methods accept primitives, hiding internal structure (value objects). Changes to internal implementation don't affect callers.

**Explicit Contracts:** Each aggregate owns its serialization contract through explicit primitives types. The aggregate is accountable for defining and maintaining the shape of its serialized form.

**Simplicity:**
- Simple types (string, number, boolean) for API boundaries
- No complex generics or template literals that break type inference
- One way to serialize = less cognitive load

**Type Safety:**
- Compiler prevents category errors (passing ID where name expected)
- RPC clients get full type inference with simple primitives
- Value objects provide domain-level type safety

**Consistency:**
- Every aggregate: `*Primitives` type + `fromPrimitives()` + `toPrimitives()`
- Dates: Always use `dateFromPrimitive()` / `dateToPrimitive()` helpers
- Complex VOs: Nest their primitives in the aggregate's primitives type

**Minimal API:** Only business operations exposed as public methods.

**Clear Boundaries:** Domain layer (value objects) ↔ Primitives (plain JSON) ↔ API layer

**Event Sourcing Ready:** Clear separation between reconstitution (`fromPrimitives`) and creation (`create` factory).
