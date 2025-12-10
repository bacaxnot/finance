# Use Case: List Accounts by User

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Retrieves all accounts belonging to a specific user.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User must exist in the system
**Postconditions**: None (read-only operation)

## Signature

```typescript
class ListAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    userId: string;
  }): Promise<Account[]>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID format |

## Business Rules

1. **Query Scope**
   - Returns all accounts for the specified user
   - No pagination (assumed reasonable number of accounts per user)
   - No filtering or sorting applied

2. **Empty Results**
   - Returns empty array if user has no accounts
   - Does not throw error for users without accounts

## Success Flow

1. Receive userId as primitive string
2. Convert to UserId value object
3. Query repository for all accounts with matching userId
4. Return array of Account aggregates

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid user ID format | userId not valid UUID | Error from UserId constructor |

## Return Value

Returns an array of `Account` aggregates:
- Empty array `[]` if user has no accounts
- Array of Account objects if accounts exist

Each Account contains:
- `id` (AccountId)
- `userId` (UserId)
- `name` (AccountName)
- `initialBalance` (Money)
- `currentBalance` (Money)
- `createdAt`, `updatedAt` (Date)

## Repository Requirements

```typescript
interface AccountRepository {
  searchByUserId(userId: UserId): Promise<Account[]>;
}
```

**Note**: This method needs to be added to the AccountRepository interface. Current interface only has `save()` and `search(id)`.

## Example Usage

```typescript
const listAccountsByUser = new ListAccountsByUser(accountRepository);

const accounts = await listAccountsByUser.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef"
});

// accounts => [Account, Account, Account] or []
```

## Notes

- No authorization check in use case (should be handled at application/API layer)
- Results order determined by database (consider adding ordering in future)
- No account type filtering (returns all account types)
