# Use Case Design

Guidelines for designing and implementing use cases in the application layer.

## Core Principles

**Each use case has a single entry point and single responsibility.**

Use cases orchestrate domain logic and infrastructure. They accept primitives, return domain objects, and receive dependencies via composition.

## Structure

```typescript
// Use case signature
type CreateAccount = (
  accountRepository: AccountRepository
) => {
  execute(params: {
    userId: string;
    name: string;
    initialBalanceAmount: number;
    currency: string;
  }): Promise<Account>;
};

// Implementation
export const createAccount: CreateAccount = (
  accountRepository
) => ({
  async execute({ userId, name, initialBalanceAmount, currency }) {
    // 1. Create aggregate (handles value object creation internally)
    const account = Account.create(userId, name, initialBalanceAmount, currency);

    // 2. Persist
    await accountRepository.save(account);

    // 3. Return domain object
    return account;
  },
});
```

## Naming Convention

Use cases follow this pattern:
- **File**: `use-case.{verb}-{entity}.ts`
- **Type**: `{Verb}{Entity}`

```
use-case.create-account.ts       → CreateAccount
use-case.list-accounts-by-user.ts → ListAccountsByUser
use-case.update-transaction.ts    → UpdateTransaction
```

## Dependency Injection

Use cases receive their collaborators through **positional arguments** and accept business data through a **parameter object** in the execute method.

**Why this pattern?**
- Positional arguments for dependencies: Clear at the use case construction level
- Parameter object for execute: Easier to call and extend business parameters

```typescript
// ✅ Good: Two-level separation
type CreateAccount = (
  accountRepository: AccountRepository,  // ← Dependencies: positional
  eventBus: EventBus
) => {
  execute(params: {                      // ← Business params: object
    userId: string;
    name: string;
    amount: number;
    currency: string;
  }): Promise<Account>;
};

// Usage
const createAccount = CreateAccount(accountRepo, eventBus);
await createAccount.execute({ userId: "123", name: "Savings", amount: 1000, currency: "COP" });
```

```typescript
// ❌ Bad: Everything as nested objects (hard to read)
type CreateAccount = (params: {
  accountRepository: AccountRepository;
  eventBus: EventBus;
}) => {
  execute(params: { /* ... */ }): Promise<Account>;
};
```

## Input/Output Contract

**Input**: Accept primitives (string, number, boolean)
**Output**: Return domain aggregates or value objects

```typescript
// ✅ Good: Primitives in, aggregates out
execute(userId: string, amount: number): Promise<Account>

// ❌ Bad: Value objects in
execute(userId: UserId, amount: Money): Promise<Account>

// ❌ Bad: Primitives out
execute(userId: string): Promise<{ id: string; name: string }>
```

**Why primitives as input?**
- Use cases are the application boundary
- External systems send primitives (HTTP, CLI, etc.)
- Validation happens inside the use case

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
async execute(name: string) {
  const accountName = new AccountName(name); // May throw InvalidArgumentException
  // ...
}

// ❌ Bad: Catching and wrapping
async execute(name: string) {
  try {
    const accountName = new AccountName(name);
  } catch (error) {
    throw new UseCaseError("Invalid name", error); // Don't do this
  }
}
```

## Checklist

Before implementing a use case:

1. ✓ Name follows convention: `use-case.{verb}-{entity}.ts`
2. ✓ Single execute method
3. ✓ Dependencies via positional parameters
4. ✓ Execute accepts primitives only
5. ✓ Returns domain objects
6. ✓ Repository has required methods
7. ✓ No error wrapping

## Examples

**Simple query**:
```typescript
export const listAccountsByUser: ListAccountsByUser = (
  accountRepository
) => ({
  async execute({ userId }) {
    const userIdVO = new UserId(userId);
    return accountRepository.searchByUserId(userIdVO);
  },
});
```

**Complex command**:
```typescript
export const createTransaction: CreateTransaction = (
  transactionRepository,
  accountRepository
) => ({
  async execute({ accountId, amount, currency, direction, description }) {
    // Get aggregate
    const account = await accountRepository.search(new AccountId(accountId));
    if (!account) throw new AccountNotFoundError(accountId);

    // Create transaction (using static factory method)
    const transaction = Transaction.create(
      account.id,
      amount,
      currency,
      direction,
      description
    );

    // Update aggregate
    account.applyTransaction(transaction);

    // Persist both
    await transactionRepository.save(transaction);
    await accountRepository.save(account);

    return transaction;
  },
});
```
