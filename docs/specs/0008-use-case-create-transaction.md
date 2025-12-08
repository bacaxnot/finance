# Use Case: Create Transaction

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to create a new financial transaction (income or expense) for a specific account.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**:
- User must exist in the system
- Account must exist and belong to the user
- Category must exist if categoryId is provided

**Postconditions**:
- New transaction is created and persisted
- Account's current balance is updated

## Signature

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
  }): Promise<void>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| id | string | Yes | Valid UUID v7 (client-generated) |
| userId | string | Yes | Valid UUID, user must exist |
| accountId | string | Yes | Valid UUID, account must exist and belong to user |
| categoryId | string \| null | Yes | Valid UUID if provided, null if no category |
| amount | number | Yes | >= 0 |
| currency | string | Yes | ISO 4217 code, must match account currency |
| direction | 'inbound' \| 'outbound' | Yes | Transaction type |
| description | string | Yes | 1-200 characters |
| transactionDate | string | Yes | ISO 8601 UTC format |
| notes | string \| null | Yes | Optional notes, null if none |

## Business Rules

1. **Account Ownership**
   - Account must belong to the specified user
   - Throws error if account doesn't exist or belongs to another user

2. **Category Validation**
   - If categoryId is not null, category must exist
   - Category ownership verification is optional (discuss with team)
   - Null categoryId is allowed (uncategorized transaction)

3. **Currency Validation**
   - Transaction currency must match account currency
   - Prevents currency mismatch errors

4. **Amount and Direction**
   - Amount must be non-negative
   - Direction determines if amount is added (inbound) or subtracted (outbound)

5. **Balance Update**
   - Account's currentBalance is updated based on direction
   - Inbound: adds to balance
   - Outbound: subtracts from balance

6. **Transaction Creation**
   - Client provides unique TransactionId (UUID v7)
   - Created and updated timestamps set to current time

## Success Flow

1. Receive primitive parameters (including client-generated id)
2. Fetch account from repository using accountId
3. Verify account exists and belongs to user
4. Verify transaction currency matches account currency
5. If categoryId provided, verify category exists (optional: verify ownership)
6. Create Transaction aggregate using `Transaction.create()` with provided id
7. Update account balance based on transaction direction
8. Persist transaction via repository
9. Persist updated account via repository

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Account not found | accountId doesn't exist | `AccountNotFoundException` |
| Unauthorized access | Account doesn't belong to user | `UnauthorizedAccountAccessException` |
| Category not found | categoryId provided but doesn't exist | `CategoryNotFoundException` |
| Currency mismatch | Transaction currency != account currency | `CurrencyMismatchException` |
| Negative amount | amount < 0 | `InvalidArgumentException` |
| Invalid description | Description empty/too long | `InvalidArgumentException` |
| Invalid date | transactionDate not valid ISO 8601 | `InvalidArgumentException` |

## Return Value

Returns `void`. Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
}

interface AccountRepository {
  search(id: AccountId): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
```

## Domain Changes Required

1. **Transaction.create()** signature update:
```typescript
static create(
  id: string,                     // Client-generated UUID v7
  userId: string,
  accountId: string,
  categoryId: string | null,      // Explicit null, not optional
  amount: number,
  currency: string,
  direction: TransactionDirectionType,
  description: string,
  transactionDate: string,
  notes: string | null            // Explicit null, not optional
): Transaction
```

2. **Account aggregate** needs methods:
```typescript
class Account {
  applyTransaction(amount: Money, direction: TransactionDirection): void {
    // Update currentBalance based on direction
  }
}
```

## Example Usage

```typescript
const createTransaction = new CreateTransaction(transactionRepository, accountRepository);

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

## Notes

- Controller layer orchestrates category creation if needed
- Currency must match account currency (enforced at aggregate level on the applyTransaction)
- Account balance updated atomically with transaction creation
- categoryId and notes explicitly use `null` (not `undefined`)
