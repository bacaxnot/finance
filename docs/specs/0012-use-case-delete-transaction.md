# Use Case: Delete Transaction

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to delete an existing transaction and reverses its effect on the account balance.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**:
- User must exist in the system
- Transaction must exist and belong to the user

**Postconditions**:
- Transaction is deleted from the system
- Account's current balance is updated (transaction effect reversed)

## Signature

```typescript
type DeleteTransaction = (
  transactionRepository: TransactionRepository,
  accountRepository: AccountRepository
) => {
  execute(params: {
    userId: string;
    transactionId: string;
  }): Promise<void>;
};
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| transactionId | string | Yes | Valid UUID, transaction must exist |

## Business Rules

1. **Ownership Verification**
   - Transaction must belong to the specified user
   - Throws error if transaction doesn't exist or belongs to another user

2. **Balance Reversal**
   - Account balance is updated to reverse the transaction effect
   - Inbound transaction deleted: subtract amount from balance
   - Outbound transaction deleted: add amount to balance

3. **Deletion Behavior**
   - Hard delete (not soft delete)
   - Transaction is permanently removed
   - No recovery mechanism

## Success Flow

1. Receive primitive parameters (userId, transactionId)
2. Convert transactionId to TransactionId value object
3. Fetch transaction from repository using `search(transactionId)`
4. Verify transaction exists (throw error if null)
5. Verify transaction belongs to user (compare userId)
6. Fetch account associated with transaction
7. Reverse transaction effect on account balance
8. Persist updated account
9. Delete transaction via repository `delete(transactionId)`
10. Return void (no return value)

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Transaction not found | transactionId doesn't exist | `TransactionNotFoundException` |
| Unauthorized access | Transaction doesn't belong to user | `UnauthorizedTransactionAccessException` |
| Invalid IDs | userId/transactionId format invalid | Error from value object constructors |

## Return Value

Returns `void` (no value). Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface TransactionRepository {
  search(id: TransactionId): Promise<Transaction | null>;
  delete(id: TransactionId): Promise<void>;
}

interface AccountRepository {
  search(id: AccountId): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
```

**Note**: The `delete` method needs to be added to the repository interface.

## Domain Changes Required

**Account aggregate** needs method:
```typescript
class Account {
  reverseTransaction(amount: Money, direction: TransactionDirection): void {
    // Reverse the transaction effect on balance
    // If direction was 'inbound', subtract from balance
    // If direction was 'outbound', add to balance
  }
}
```

## Example Usage

```typescript
const deleteTransaction = DeleteTransaction(transactionRepository, accountRepository);

await deleteTransaction.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  transactionId: "01936d4e-5678-90ab-cdef-1234567890ab"
});

// Transaction is deleted
// Account balance is automatically adjusted
```

## Notes

- Hard delete (not soft delete)
- Account balance updated atomically with deletion
- Once deleted, transaction cannot be recovered
- Consider adding a confirmation step in the UI before deletion
- Users cannot delete transactions belonging to other users
