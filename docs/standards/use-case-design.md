# Use Case Design

Guidelines for designing and implementing use cases in the application layer.

## Core Principles

**Each use case has a single entry point and single responsibility.**

Use cases orchestrate domain logic and infrastructure. They accept primitives as input, return domain objects or void, and receive dependencies via constructor injection.

## Structure

Use cases are implemented as classes with:
- **Constructor**: Receives collaborators (repositories, other use cases)
- **Execute method**: Receives business parameters as primitives

```typescript
class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;           // Client-generated UUID v7
    userId: string;
    name: string;
    initialBalanceAmount: number;
    currency: string;
  }): Promise<void> {
    // 1. Create aggregate with provided ID
    const account = Account.create(id, userId, name, initialBalanceAmount, currency);

    // 2. Persist
    await this.accountRepository.save(account);

    // Mutations return void
  }
}

// Usage
const createAccount = new CreateAccount(accountRepository);
await createAccount.execute({
  id: "01936a2b-1234-7890-abcd-ef1234567890",
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  name: "Main Checking",
  initialBalanceAmount: 50000,
  currency: "COP"
});
```

## Naming Convention

Use cases follow this pattern:
- **File**: `use-case.{verb}-{entity}.ts`
- **Class**: `{Verb}{Entity}`

```
use-case.create-account.ts       → CreateAccount
use-case.list-accounts-by-user.ts → ListAccountsByUser
use-case.update-transaction.ts    → UpdateTransaction
```

## Dependency Injection

Use cases receive their collaborators through **constructor injection** and accept business data through a **parameter object** in the execute method.

```typescript
class CreateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(params: {
    id: string;
    userId: string;
    accountId: string;
    amount: number;
    currency: string;
    direction: 'inbound' | 'outbound';
    description: string;
  }): Promise<void> {
    // Implementation
  }
}

// Usage
const createTransaction = new CreateTransaction(
  transactionRepository,
  accountRepository
);

await createTransaction.execute({
  id: "01936d4e-...",
  userId: "01234567-...",
  accountId: "01936a2b-...",
  amount: 150000,
  currency: "COP",
  direction: "outbound",
  description: "Grocery shopping"
});
```

**Why this pattern?**

- **Dependency Inversion Principle**: Dependencies are declared in the constructor. When one use case depends on another, it only needs to know the interface (methods like `execute()`), not the internal dependencies.
- **Clear separation**: Constructor = what the use case needs to work. Execute = what the business operation needs.
- **Composability**: Easy to compose use cases together without coupling to their dependencies.

**Example of use case composition**:
```typescript
class CreateTransactionWithCategory {
  constructor(
    private readonly createCategory: CreateCategory,      // Use case dependency
    private readonly createTransaction: CreateTransaction  // Use case dependency
  ) {}

  async execute(params: { /* ... */ }): Promise<void> {
    // Use other use cases without knowing their dependencies
    if (params.categoryName) {
      await this.createCategory.execute({ id: params.categoryId, userId: params.userId, name: params.categoryName });
    }

    await this.createTransaction.execute({ /* ... */ });
  }
}
```

## Input/Output Contract

**Input**: Accept primitives (string, number, boolean)
**Output**: Queries return domain objects, mutations return void

```typescript
// ✅ Good: Query returns aggregates
async execute(params: { userId: string }): Promise<Account[]>

// ✅ Good: Mutation returns void
async execute(params: { id: string; name: string }): Promise<void>

// ❌ Bad: Value objects as input
async execute(params: { userId: UserId; amount: Money }): Promise<Account>

// ❌ Bad: Primitives as output
async execute(params: { userId: string }): Promise<{ id: string; name: string }>
```

**Why primitives as input?**
- Use cases are the application boundary
- External systems send primitives (HTTP, CLI, events)
- Value object creation and validation happens inside the use case

## Mutation Pattern

**All mutations (create, update, delete) return `Promise<void>`.**

For creation use cases, the client generates and provides the entity ID (UUID v7).

```typescript
// Creation: Client generates ID
class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;        // Client-generated UUID v7
    userId: string;
    name: string;
    initialBalanceAmount: number;
    currency: string;
  }): Promise<void> {
    const account = Account.create(params.id, params.userId, params.name, params.initialBalanceAmount, params.currency);
    await this.accountRepository.save(account);
  }
}

// Update: ID identifies entity
class UpdateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;
    name: string;
    // ...
  }): Promise<void> {
    const account = await this.accountRepository.search(new AccountId(params.id));
    if (!account) throw new AccountNotFoundException(params.id);

    account.updateName(params.name);
    await this.accountRepository.save(account);
  }
}

// Delete: ID identifies entity
class DeleteAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;
    userId: string;
  }): Promise<void> {
    const accountId = new AccountId(params.id);
    const account = await this.accountRepository.search(accountId);

    if (!account) throw new AccountNotFoundException(params.id);
    if (account.userId.value !== params.userId) {
      throw new UnauthorizedAccessException();
    }

    await this.accountRepository.delete(accountId);
  }
}
```

**Benefits:**
- Client always knows the entity ID (no round-trip needed)
- Bulk operations don't need to track generated IDs
- No need to return created/updated data (client can fetch if needed)
- Success indicated by no exception thrown

## Repository Requirements

Before implementing a use case, verify the repository has the necessary methods.

**Example**: `ListAccountsByUser` needs:
```typescript
interface AccountRepository {
  searchByUserId(userId: UserId): Promise<Account[]>; // ✅ Required
  search(id: AccountId): Promise<Account | null>;     // Not needed
}
```

If a method is missing, add it to the repository interface first.

## Error Handling

Let domain exceptions bubble up. Don't catch and wrap them.

```typescript
// ✅ Good: Let domain errors propagate
class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { id: string; userId: string; name: string /* ... */ }): Promise<void> {
    const accountName = new AccountName(params.name); // May throw InvalidArgumentException
    // ... rest of implementation
  }
}

// ❌ Bad: Catching and wrapping
class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { id: string; userId: string; name: string /* ... */ }): Promise<void> {
    try {
      const accountName = new AccountName(params.name);
    } catch (error) {
      throw new UseCaseError("Invalid name", error); // Don't do this
    }
  }
}
```

## Checklist

Before implementing a use case:

1. ✓ File name follows convention: `use-case.{verb}-{entity}.ts`
2. ✓ Class name follows convention: `{Verb}{Entity}`
3. ✓ Single execute method
4. ✓ Dependencies injected via constructor
5. ✓ Execute accepts parameter object with primitives only
6. ✓ Queries return domain objects, mutations return void
7. ✓ Repository has required methods
8. ✓ No error wrapping

## Examples

**Simple query**:
```typescript
class ListAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<Account[]> {
    const userId = new UserId(params.userId);
    return this.accountRepository.searchByUserId(userId);
  }
}

// Usage
const listAccountsByUser = new ListAccountsByUser(accountRepository);
const accounts = await listAccountsByUser.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef"
});
```

**Complex mutation**:
```typescript
class CreateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(params: {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: number;
    currency: string;
    direction: 'inbound' | 'outbound';
    description: string;
    transactionDate: string;
    notes: string | null;
  }): Promise<void> {
    // 1. Fetch and verify account
    const account = await this.accountRepository.search(new AccountId(params.accountId));
    if (!account) throw new AccountNotFoundException(params.accountId);
    if (account.userId.value !== params.userId) {
      throw new UnauthorizedAccessException();
    }

    // 2. Create transaction
    const transaction = Transaction.create(
      params.id,
      params.userId,
      params.accountId,
      params.categoryId,
      params.amount,
      params.currency,
      params.direction,
      params.description,
      params.transactionDate,
      params.notes
    );

    // 3. Update account balance
    account.applyTransaction(transaction.amount, transaction.direction);

    // 4. Persist both
    await this.transactionRepository.save(transaction);
    await this.accountRepository.save(account);
  }
}

// Usage
const createTransaction = new CreateTransaction(
  transactionRepository,
  accountRepository
);

await createTransaction.execute({
  id: "01936d4e-5678-90ab-cdef-1234567890ab",
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  accountId: "01936a2b-1234-7890-abcd-ef1234567890",
  categoryId: "01936c3d-5678-90ab-cdef-1234567890ab",
  amount: 150000,
  currency: "COP",
  direction: "outbound",
  description: "Monthly grocery shopping",
  transactionDate: "2025-12-08T10:30:00.000Z",
  notes: "Supermarket trip"
});
```
