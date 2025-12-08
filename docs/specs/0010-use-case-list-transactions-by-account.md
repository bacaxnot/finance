# Use Case: List Transactions by Account

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Retrieves all transactions for a specific account belonging to a user.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User and account must exist in the system
**Postconditions**: None (read-only operation)

## Signature

```typescript
class ListTransactionsByAccount {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: {
    userId: string;
    accountId: string;
  }): Promise<Transaction[]>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID |
| accountId | string | Yes | Valid UUID |

## Business Rules

1. **Scope**
   - Returns only transactions for the specified account
   - Account ownership verification via userId
   - Returns empty array if account has no transactions

2. **Ordering**
   - Implementation-specific (typically by transaction date descending)

3. **No Pagination**
   - Returns all transactions (acceptable for MVP)

## Success Flow

1. Receive userId and accountId as primitive strings
2. Convert to value objects (UserId, AccountId)
3. Query repository using `searchByAccountId()`
4. Filter by userId for security (or verify account ownership first)
5. Return array of Transaction aggregates

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid IDs | userId/accountId format invalid | Error from value object constructors |

## Return Value

Returns an array of `Transaction` aggregates. Each transaction contains:
- `id`, `userId`, `accountId`, `categoryId`
- `amount`, `currency`, `direction`
- `description`, `transactionDate`, `notes`
- `createdAt`, `updatedAt` timestamps

Returns empty array `[]` if account has no transactions.

## Repository Requirements

```typescript
interface TransactionRepository {
  searchByAccountId(accountId: AccountId): Promise<Transaction[]>;
}
```

**Note**: This method needs to be added to the repository interface.

## Example Usage

```typescript
const listTransactionsByAccount = new ListTransactionsByAccount(transactionRepository);

const transactions = await listTransactionsByAccount.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  accountId: "01936a2b-1234-7890-abcd-ef1234567890"
});

// transactions => [Transaction, Transaction, ...]
// transactions.map(t => t.toPrimitives()) => [{ id: "...", amount: {...}, ... }, ...]
```

## Notes

- No pagination for MVP (typical accounts have < 1000 transactions)
- Consider adding pagination if transaction count grows
- Results ordering depends on repository implementation
- Account ownership verification prevents unauthorized access
