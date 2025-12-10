# Domain Errors Design Guide

## Philosophy

Domain errors are **first-class domain citizens**, not just exceptions. They represent business rule violations with the same rigor as aggregates and value objects.

Like aggregates, errors:
- Have **identity** (type)
- Carry **state** (contextual data)
- Are **serializable** (via `toPrimitives()`)
- Follow **consistent patterns** across the codebase

This consistency makes errors predictable, observable, and easy to handle across all layers.

## The Pattern

### Structure

```typescript
export abstract class DomainError extends Error {
    abstract readonly type: string;
    abstract readonly message: string;

    toPrimitives(): {
        type: string;
        description: string;
        data: Record<string, unknown>;
    } {
        const props = Object.entries(this).filter(
            ([key, _]) => key !== "type" && key !== "message",
        );

        return {
            type: this.type,
            description: this.message,
            data: props.reduce((acc, [key, value]) => {
                return {
                    ...acc,
                    [key]: value,
                };
            }, {}),
        };
    }
}
```

### Concrete Implementation

```typescript
export class AccountDoesNotExistError extends DomainError {
    readonly type = "AccountDoesNotExistError";
    readonly message: string;

    constructor(public readonly accountId: string) {
        super();
        this.message = `The account ${this.accountId} does not exist`;
    }
}
```

```typescript
export class CurrencyMismatchError extends DomainError {
    readonly type = "CurrencyMismatchError";
    readonly message: string;

    constructor(
        public readonly expected: string,
        public readonly actual: string,
    ) {
        super();
        this.message = `Currency mismatch: expected ${this.expected}, got ${this.actual}`;
    }
}
```

## Rules

### 1. Errors Have Structured Data

Every error accepts **constructor parameters** that provide context.

```typescript
// ✅ Always include contextual data:
export class AccountDoesNotExistError extends DomainError {
    constructor(public readonly accountId: string) {
        super();
    }
}

// ✅ Multiple pieces of context:
export class CurrencyMismatchError extends DomainError {
    constructor(
        public readonly expected: string,
        public readonly actual: string,
    ) {
        super();
    }
}

// Usage
throw new AccountDoesNotExistError(accountId);
throw new CurrencyMismatchError(account.currency, transaction.currency);
```

**Why:** Provides complete context for debugging, logging, and client-side handling.

### 2. Message as Computed Template

The `message` property **computes** from constructor data using template literals.

```typescript
export class AccountDoesNotExistError extends DomainError {
    readonly type = "AccountDoesNotExistError";
    readonly message: string;

    constructor(public readonly accountId: string) {
        super();
        this.message = `Account ${this.accountId} does not exist`;
    }
}

// Usage - pass only data, not message:
throw new AccountDoesNotExistError("acc-123");
// message: "Account acc-123 does not exist"
```

**Why:** Single source of truth. Message always reflects the data. No message inconsistencies.

### 3. Explicit Type Property

The `type` property is a **machine-readable identifier**.

```typescript
export class AccountDoesNotExistError extends DomainError {
    readonly type = "AccountDoesNotExistError";  // Explicit, stable identifier
    // ...
}
```

**Why:** Decouples error handling from class names. Clients can pattern match on `type` for specific handling.

### 4. Serialization via toPrimitives()

Errors serialize like aggregates:

```typescript
const error = new CurrencyMismatchError("USD", "EUR");

error.toPrimitives();
// Returns:
// {
//   type: "CurrencyMismatchError",
//   description: "Currency mismatch: expected USD, got EUR",
//   data: {
//     expected: "USD",
//     actual: "EUR"
//   }
// }
```

**Why:** Consistent serialization pattern across all domain objects. API-ready format. Clean observability integration.

### 5. Throw at Domain Layer

Throw errors where business rules are enforced:

```typescript
export class FindAccountUseCase {
    async execute(params: { accountId: string }): Promise<Account> {
        const account = await this.repository.search(new AccountId(params.accountId));

        if (!account) {
            throw new AccountDoesNotExistError(params.accountId);
        }

        return account;
    }
}
```

**Let them bubble:** Application layer doesn't catch or wrap. Errors flow naturally to the infrastructure layer.

## The toPrimitives() Pattern

The `toPrimitives()` method automatically extracts all constructor properties:

```typescript
export class CurrencyMismatchError extends DomainError {
    readonly type = "CurrencyMismatchError";
    readonly message: string;

    constructor(
        public readonly expected: string,
        public readonly actual: string,
    ) {
        super();
        this.message = `Currency mismatch: expected ${this.expected}, got ${this.actual}`;
    }
}

// Serialization
const error = new CurrencyMismatchError("USD", "EUR");
error.toPrimitives();
// {
//   type: "CurrencyMismatchError",
//   description: "Currency mismatch: expected USD, got EUR",
//   data: {
//     expected: "USD",
//     actual: "EUR"
//   }
// }
```

**Benefits:**
1. Consistent with aggregate serialization
2. All context automatically captured in `data`
3. Type-safe error responses for APIs
4. Clean integration with observability tools

## Organization

Errors live in their module's domain layer:

```
src/
├── _shared/domain/
│   └── DomainError.ts              # Base class
├── accounts/domain/
│   ├── Account.ts
│   └── AccountDoesNotExistError.ts
├── categories/domain/
│   ├── Category.ts
│   └── CategoryDoesNotExistError.ts
└── transactions/domain/
    ├── Transaction.ts
    ├── CurrencyMismatchError.ts
    └── TransactionDoesNotExistError.ts
```

**One file per error:** Each error class lives in its own file, named exactly like the class.

## Complete Example

```typescript
// accounts/domain/error.account-does-not-exist.ts
export class AccountDoesNotExistError extends DomainError {
    readonly type = "AccountDoesNotExistError";
    readonly message: string;

    constructor(public readonly accountId: string) {
        super();
        this.message = `Account ${this.accountId} does not exist`;
    }
}

// accounts/application/use-case.update-account.ts
export class UpdateAccountUseCase {
    async execute(params: {
        accountId: string;
        name: string;
    }): Promise<void> {
        const account = await this.repository.search(
            new AccountId(params.accountId)
        );

        if (!account) {
            throw new AccountDoesNotExistError(params.accountId);
        }

        account.rename(params.name);
        await this.repository.save(account);
    }
}

// API layer handles serialization (generic example)
app.post("/accounts/:id", async (req, res) => {
    try {
        await updateAccountUseCase.execute({
            accountId: req.params.id,
            name: req.body.name,
        });
        res.json({ success: true });
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).json(error.toPrimitives());
        }
        throw error;
    }
});

// Client receives:
// {
//   type: "AccountDoesNotExistError",
//   description: "Account acc-123 does not exist",
//   data: { accountId: "acc-123" }
// }
```

## Naming Convention

**Pattern:** `{Concept}{ErrorCondition}Error`

```typescript
// ✅ Clear and specific:
AccountDoesNotExistError
CurrencyMismatchError

// ✅ Generic validation (shared):
InvalidArgumentError
```

**Use "Error" suffix**, not "Exception". Domain errors are exceptional states, not Java-style checked exceptions.

## When to Create New Errors

Create a new error class when:

1. **Represents a distinct business rule violation**
   ```typescript
   // ✅ Distinct rule
   export class CurrencyMismatchError extends DomainError { }
   ```

2. **Needs different handling** on the client or infrastructure
   ```typescript
   // ✅ Client handles different HTTP status codes
   export class AccountDoesNotExistError extends DomainError { }  // 404
   export class CurrencyMismatchError extends DomainError { }     // 400
   ```

3. **Requires specific contextual data**
   ```typescript
   // ✅ Needs both currencies for meaningful error
   export class CurrencyMismatchError extends DomainError {
       constructor(
           public readonly expected: string,
           public readonly actual: string,
       ) { }
   }
   ```

**Reuse generic errors for simple validation:**

```typescript
// ✅ Use shared InvalidArgumentError:
if (!name.trim()) {
    throw new InvalidArgumentError("Account name cannot be empty");
}

// ✅ Create specific error for business rule:
if (!account.hasCurrency(currency)) {
    throw new CurrencyMismatchError(account.currency, currency);
}
```

## Why This Design?

**Consistency:** Errors follow the same pattern as aggregates (`toPrimitives()`).

**Observability:** Structured `data` object contains all context for logging and monitoring.

**Type Safety:** Machine-readable `type` enables pattern matching and client-side handling.

**API-Ready:** Direct serialization to clean JSON responses.

**Single Source of Truth:** Message computed from data, never out of sync.

**Domain Language:** Errors speak the ubiquitous language of the domain.

## Summary

Domain errors are domain objects:
- Structured data via constructor parameters
- Computed message templates
- Explicit `type` identifiers
- Serialization via `toPrimitives()`
- Thrown at domain layer, bubble naturally
- One file per error, named exactly like the class
