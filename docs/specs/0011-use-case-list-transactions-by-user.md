# Use Case: List Transactions by User

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Retrieves all transactions for a user across all their accounts.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User must exist in the system
**Postconditions**: None (read-only operation)

## Signature

```typescript
class ListTransactionsByUser {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: {
    userId: string;
  }): Promise<Transaction[]>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID |

## Business Rules

1. **Scope**
   - Returns transactions from all accounts belonging to the user
   - Returns empty array if user has no transactions
   - No pagination (returns all transactions)

2. **Ordering**
   - Implementation-specific (typically by transaction date descending)

## Success Flow

1. Receive userId as primitive string
2. Convert to UserId value object
3. Query repository using `searchByUserId()`
4. Return array of Transaction aggregates

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns an array of `Transaction` aggregates. Each transaction contains:
- `id`, `userId`, `accountId`, `categoryId`
- `amount`, `currency`, `direction`
- `description`, `transactionDate`, `notes`
- `createdAt`, `updatedAt` timestamps

Returns empty array `[]` if user has no transactions.

## Repository Requirements

```typescript
interface TransactionRepository {
  searchByUserId(userId: UserId): Promise<Transaction[]>;
}
```

**Note**: This method needs to be added to the repository interface.

## Example Usage

```typescript
const listTransactionsByUser = new ListTransactionsByUser(transactionRepository);

const transactions = await listTransactionsByUser.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef"
});

// transactions => [Transaction, Transaction, ...] (from all user's accounts)
// Useful for consolidated views and reports
```

## Notes

- No pagination for MVP (acceptable for personal finance)
- Consider adding pagination and date range filters for production
- Results ordering depends on repository implementation
- Useful for dashboard, reports, and consolidated transaction views
