# Repository Design Guide

## Philosophy

Repositories abstract data access and provide a collection-like interface for aggregates. They bridge the domain and infrastructure layers, allowing domain code to remain ignorant of persistence details.

Like aggregates and errors, repositories follow the **Primitives pattern**:
- Domain works with aggregates
- Repositories convert: `toPrimitives()` → Database → `fromPrimitives()`
- Single source of truth for serialization

## The Pattern

### Repository in Domain Layer

```typescript
// accounts/domain/repository.account.ts
export abstract class AccountRepository {
    abstract save(account: Account): Promise<void>;
    abstract search(id: AccountId): Promise<Account | null>;
    abstract searchByUserId(userId: UserId): Promise<Account[]>;
    abstract delete(id: AccountId): Promise<void>;
}
```

**Key characteristics:**
- Abstract class in domain (not interface) - required for dependency injection
- Methods accept **domain value objects** (AccountId, not string)
- Returns **aggregates** (Account) or null
- Never returns primitives directly

### Implementation in Infrastructure

```typescript
// accounts/infrastructure/repository.account.postgres.ts
export class AccountRepositoryPostgres
    extends DrizzlePostgresRepository<Account>
    implements AccountRepository {

    async save(account: Account): Promise<void> {
        const primitives = account.toPrimitives();

        await this.db
            .insert(accounts)
            .values({
                id: primitives.id,
                userId: primitives.userId,
                name: primitives.name,
                currency: primitives.initialBalance.currency,
                initialBalance: primitives.initialBalance.amount,
                currentBalance: primitives.currentBalance.amount,
                createdAt: primitives.createdAt,
                updatedAt: primitives.updatedAt,
            })
            .onConflictDoUpdate({
                target: accounts.id,
                set: {
                    name: primitives.name,
                    currentBalance: primitives.currentBalance.amount,
                    updatedAt: primitives.updatedAt,
                },
            });
    }

    async search(id: AccountId): Promise<Account | null> {
        const result = await this.db
            .select()
            .from(accounts)
            .where(eq(accounts.id, id.value))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        return this.toAggregate(result[0]);
    }

    async searchByUserId(userId: UserId): Promise<Account[]> {
        const results = await this.db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, userId.value));

        return results.map(row => this.toAggregate(row));
    }

    protected toAggregate(row: typeof accounts.$inferSelect): Account {
        return Account.fromPrimitives({
            id: row.id,
            userId: row.userId,
            name: row.name,
            initialBalance: {
                amount: parseFloat(row.initialBalance),
                currency: row.currency,
            },
            currentBalance: {
                amount: parseFloat(row.currentBalance),
                currency: row.currency,
            },
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
}
```

## Repository vs Finder Pattern

**PRINCIPLE:** Separate "data may not exist" from "data must exist" concerns.

### Repository: Nullable Results

Repository returns `T | null` - data may not exist.

```typescript
export abstract class AccountRepository {
    abstract search(id: AccountId): Promise<Account | null>;
}
```

**Use when:**
- Existence is conditional
- Null is a valid outcome
- Caller decides what to do if not found

```typescript
// Example: Check if account exists before creating
const existing = await this.repository.search(accountId);
if (existing) {
    throw new AccountAlreadyExistsError(accountId.value);
}
```

### Finder: Guaranteed Results

Finder returns `T` - data must exist, throws if not found.

```typescript
// accounts/domain/finder.account.ts
export class FindAccount {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: { id: string }): Promise<Account> {
        const account = await this.repository.search(new AccountId(params.id));

        if (!account) {
            throw new AccountDoesNotExistError(params.id);
        }

        return account;
    }
}
```

**Use when:**
- Existence is required for business operation
- Not finding it is an error
- Simplifies use case logic

```typescript
// Example: Update requires existence
async execute(params: { id: string, name: string }) {
    const account = await this.finder.execute({ id: params.id });  // Throws if not found
    account.rename(params.name);
    await this.repository.save(account);
}
```

### When to Use Each

| Scenario | Use Repository | Use Finder |
|----------|----------------|------------|
| Update operation | | ✓ |
| Delete operation | | ✓ |
| Conditional creation | ✓ | |
| Query that may return nothing | ✓ | |
| Business logic requires existence | | ✓ |

## Rules

### 1. Methods Accept Value Objects

Repository methods use domain types, not primitives.

```typescript
// ✅ Value objects as parameters
abstract search(id: AccountId): Promise<Account | null>;
abstract searchByUserId(userId: UserId): Promise<Account[]>;

// ❌ Never primitives as parameters
abstract search(id: string): Promise<Account | null>;
abstract searchByUserId(userId: string): Promise<Account[]>;
```

**Why:** Type safety. Impossible to pass wrong ID type (CategoryId instead of AccountId).

### 2. Returns Aggregates, Never Primitives

Repository always returns domain objects.

```typescript
// ✅ Returns aggregates
async search(id: AccountId): Promise<Account | null> {
    const row = await this.db.select()...;
    return row ? this.toAggregate(row) : null;
}

// ❌ Never returns primitives directly
async search(id: AccountId): Promise<{ id: string, name: string } | null> {
    return await this.db.select()...;  // Raw database row
}
```

**Why:** Aggregates encapsulate behavior. Primitives are data bags without invariants.

### 3. Save is Always Idempotent (UPSERT)

Use `onConflictDoUpdate` - same method for create and update.

```typescript
async save(account: Account): Promise<void> {
    const primitives = account.toPrimitives();

    await this.db
        .insert(accounts)
        .values({ ...primitives })
        .onConflictDoUpdate({
            target: accounts.id,
            set: {
                name: primitives.name,
                currentBalance: primitives.currentBalance.amount,
                updatedAt: primitives.updatedAt,
            },
        });
}
```

**Why:** Aggregates don't know if they're new or existing. Repository handles persistence strategy.

### 4. Search Returns Null When Not Found

Don't throw errors in repository methods.

```typescript
// ✅ Return null
async search(id: AccountId): Promise<Account | null> {
    const result = await this.db.select()...;
    return result.length === 0 ? null : this.toAggregate(result[0]);
}

// ❌ Don't throw in repository
async search(id: AccountId): Promise<Account> {
    const result = await this.db.select()...;
    if (result.length === 0) {
        throw new AccountDoesNotExistError(id.value);  // Wrong layer!
    }
    return this.toAggregate(result[0]);
}
```

**Why:** Repositories are data access, not business logic. Throwing errors is a domain concern (use Finder for that).

### 5. Primitives Flow

```typescript
// Aggregate → Database (save)
const primitives = account.toPrimitives();
await this.db.insert(accounts).values({
    id: primitives.id,
    name: primitives.name,
    // ...
});

// Database → Aggregate (search)
protected toAggregate(row: DatabaseRow): Account {
    return Account.fromPrimitives({
        id: row.id,
        name: row.name,
        // ...
    });
}
```

**Why:** Consistent serialization pattern. Database doesn't know about domain objects.

## Base Repository Pattern

### DrizzlePostgresRepository

Create a base class to encapsulate database access:

```typescript
// _shared/infrastructure/DrizzlePostgresRepository.ts
import { AggregateRoot } from "../domain/AggregateRoot";

export abstract class DrizzlePostgresRepository<T extends AggregateRoot> {
    protected readonly db: Database;

    constructor(database: Database) {
        this.db = database;
    }

    protected abstract toAggregate(row: unknown): T;
}
```

**Key points:**
- Generic over aggregate type
- Encapsulates `this.db` instance
- Forces concrete repositories to implement `toAggregate()`
- Keep simple - don't abstract too early

**Usage:**
```typescript
export class AccountRepositoryPostgres
    extends DrizzlePostgresRepository<Account>
    implements AccountRepository {

    // Inherits this.db

    async save(account: Account): Promise<void> {
        const primitives = account.toPrimitives();
        await this.db.insert(accounts).values(...);
    }

    protected toAggregate(row: typeof accounts.$inferSelect): Account {
        return Account.fromPrimitives({...});
    }
}
```

## Organization

### Example File Structure

```
src/
├── _shared/
│   ├── domain/
│   │   └── AggregateRoot.ts
│   └── infrastructure/
│       └── DrizzlePostgresRepository.ts
├── accounts/
│   ├── domain/
│   │   ├── account.ts
│   │   ├── account-repository.ts          # Abstract class
│   │   └── find-account.ts                # Finder (optional)
│   └── infrastructure/
│       └── account-repository.postgres.ts  # Implementation
└── categories/
    ├── domain/
    │   ├── category.ts
    │   ├── category-repository.ts
    │   └── find-category.ts
    └── infrastructure/
        └── category-repository.postgres.ts
```

### Naming Convention

**Pattern:** `{aggregate}-repository.ts` for abstract, `{aggregate}-repository.{storage}.ts` for implementation

```typescript
// Domain
account-repository.ts         // AccountRepository abstract class
find-account.ts               // FindAccount finder class

// Infrastructure
account-repository.postgres.ts   // AccountRepositoryPostgres implementation
account-repository.memory.ts     // AccountRepositoryMemory (for tests)
```

File names use kebab-case and place the type suffix (`-repository`) at the end.

## Complete Example

### Domain Repository

```typescript
// accounts/domain/account-repository.ts
export abstract class AccountRepository {
    abstract save(account: Account): Promise<void>;
    abstract search(id: AccountId): Promise<Account | null>;
    abstract searchByUserId(userId: UserId): Promise<Account[]>;
    abstract delete(id: AccountId): Promise<void>;
}
```

### Domain Finder

```typescript
// accounts/domain/find-account.ts
export class FindAccount {
    constructor(private readonly repository: AccountRepository) {}

    async execute(params: { id: string }): Promise<Account> {
        const account = await this.repository.search(new AccountId(params.id));

        if (!account) {
            throw new AccountDoesNotExistError(params.id);
        }

        return account;
    }
}
```

### Infrastructure Implementation

```typescript
// accounts/infrastructure/account-repository.postgres.ts
export class AccountRepositoryPostgres
    extends DrizzlePostgresRepository<Account>
    implements AccountRepository {

    async save(account: Account): Promise<void> {
        const primitives = account.toPrimitives();

        await this.db
            .insert(accounts)
            .values({
                id: primitives.id,
                userId: primitives.userId,
                name: primitives.name,
                currency: primitives.initialBalance.currency,
                initialBalance: primitives.initialBalance.amount,
                currentBalance: primitives.currentBalance.amount,
                createdAt: primitives.createdAt,
                updatedAt: primitives.updatedAt,
            })
            .onConflictDoUpdate({
                target: accounts.id,
                set: {
                    name: primitives.name,
                    currentBalance: primitives.currentBalance.amount,
                    updatedAt: primitives.updatedAt,
                },
            });
    }

    async search(id: AccountId): Promise<Account | null> {
        const result = await this.db
            .select()
            .from(accounts)
            .where(eq(accounts.id, id.value))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        return this.toAggregate(result[0]);
    }

    async searchByUserId(userId: UserId): Promise<Account[]> {
        const results = await this.db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, userId.value));

        return results.map(row => this.toAggregate(row));
    }

    async delete(id: AccountId): Promise<void> {
        await this.db
            .delete(accounts)
            .where(eq(accounts.id, id.value));
    }

    protected toAggregate(row: typeof accounts.$inferSelect): Account {
        return Account.fromPrimitives({
            id: row.id,
            userId: row.userId,
            name: row.name,
            initialBalance: {
                amount: parseFloat(row.initialBalance),
                currency: row.currency,
            },
            currentBalance: {
                amount: parseFloat(row.currentBalance),
                currency: row.currency,
            },
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
}
```

## Why This Design?

**Abstraction:** Domain doesn't know about databases, ORMs, or SQL.

**Type Safety:** Value objects prevent ID confusion across aggregates.

**Repository vs Finder:** Clear separation between "data may not exist" and "data must exist" scenarios.

**Idempotent Saves:** Aggregates don't track persistence state.

**Consistent Serialization:** `toPrimitives()` and `fromPrimitives()` everywhere.

**Testability:** Easy to create in-memory implementations for testing.

## Summary

Repositories provide a collection-like interface:
- Abstract class in domain with value object parameters
- Returns aggregates or null
- Implementation in infrastructure
- Use Repository when null is valid, Finder when existence is required
- Save is always idempotent (UPSERT)
- Primitives flow: `toPrimitives()` → DB → `fromPrimitives()`
