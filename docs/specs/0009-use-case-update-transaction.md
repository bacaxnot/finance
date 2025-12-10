# Use Case: Update Transaction

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to update an existing transaction's details and recalculates account balance if amount or direction changes.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**:
- User must exist in the system
- Transaction must exist and belong to the user
- Account must exist

**Postconditions**:
- Transaction is updated and persisted
- Account balance is recalculated if amount or direction changed

## Signature

```typescript
class UpdateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(params: {
    userId: string;
    transactionId: string;
    categoryId?: string | null;
    amount?: number;
    currency?: string;
    direction?: 'inbound' | 'outbound';
    description?: string;
    transactionDate?: string;
    notes?: string | null;
  }): Promise<void>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| transactionId | string | Yes | Valid UUID, transaction must exist |
| categoryId | string \| null | No | Valid UUID if provided, null to remove category |
| amount | number | No | >= 0 if provided |
| currency | string | No | Must match account currency if provided |
| direction | 'inbound' \| 'outbound' | No | Transaction type |
| description | string | No | 1-200 characters if provided |
| transactionDate | string | No | ISO 8601 UTC format if provided |
| notes | string \| null | No | Notes or null to remove |

## Business Rules

1. **Ownership Verification**
   - Transaction must belong to the specified user
   - Throws error if transaction doesn't exist or belongs to another user

2. **Partial Updates**
   - Only provided fields are updated
   - Omitted fields remain unchanged

3. **Balance Recalculation**
   - If amount or direction changes, reverse old transaction effect and apply new one
   - Account balance updated atomically

4. **Currency Validation**
   - If currency provided, must match account currency
   - Cannot change transaction currency to a different one

5. **Category Update**
   - Can update to existing category
   - Can set to null (remove category)
   - If categoryId provided, category must exist

6. **Update Timestamp**
   - `updatedAt` timestamp is refreshed

## Success Flow

1. Receive primitive parameters
2. Fetch transaction from repository using transactionId
3. Verify transaction exists and belongs to user
4. If amount or direction changed:
   - Fetch account
   - Reverse old transaction effect on balance
   - Apply new transaction effect on balance
   - Persist updated account
5. If categoryId provided, verify category exists
6. Update transaction fields
7. Persist updated transaction

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Transaction not found | transactionId doesn't exist | `TransactionNotFoundException` |
| Unauthorized access | Transaction doesn't belong to user | `UnauthorizedTransactionAccessException` |
| Category not found | categoryId provided but doesn't exist | `CategoryNotFoundException` |
| Currency mismatch | New currency != account currency | `CurrencyMismatchException` |
| Negative amount | amount < 0 | `InvalidArgumentException` |
| Invalid description | Description empty/too long | `InvalidArgumentException` |

## Return Value

Returns `void`. Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface TransactionRepository {
  search(id: TransactionId): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}

interface AccountRepository {
  search(id: AccountId): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
```

## Domain Changes Required

**Transaction aggregate** needs update methods:
```typescript
class Transaction {
  update(params: {
    categoryId?: string | null;
    amount?: number;
    currency?: string;
    direction?: TransactionDirectionType;
    description?: string;
    transactionDate?: string;
    notes?: string | null;
  }): void {
    // Update fields and refresh updatedAt
  }
}
```

## Example Usage

```typescript
const updateTransaction = new UpdateTransaction(transactionRepository, accountRepository);

await updateTransaction.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  transactionId: "01936d4e-5678-90ab-cdef-1234567890ab",
  categoryId: "01936c3d-5678-90ab-cdef-1234567890ab",
  amount: 175000,  // Changed amount
  description: "Monthly grocery shopping - updated"
});

// Success - account balance automatically recalculated
```

## Notes

- Only specified fields are updated (partial update)
- Balance recalculation happens automatically if amount/direction changes
- Setting categoryId to null removes the category
- Currency cannot be changed to a different value (must match account)
