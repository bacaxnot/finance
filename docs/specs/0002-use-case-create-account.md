# Use Case: Create Account

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to create a new financial account (bank account, credit card, cash, investment, etc.) with an initial balance.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User must exist in the system
**Postconditions**: New account is created and persisted

## Signature

```typescript
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
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| name | string | Yes | 1-100 characters, non-empty after trim |
| initialBalanceAmount | number | Yes | >= 0 |
| currency | string | Yes | ISO 4217 code, currently only "COP" allowed |

## Business Rules

1. **Account Name Validation**
   - Cannot be empty or whitespace only
   - Maximum 100 characters
   - Trimmed before storage

2. **Initial Balance**
   - Must be non-negative (>= 0)
   - Zero balance is allowed for new accounts
   - Currency must be valid and supported

3. **Account Creation**
   - System generates unique AccountId (UUID v7)
   - Current balance equals initial balance at creation
   - Created and updated timestamps set to current time

## Success Flow

1. Receive primitive parameters (userId, name, initialBalanceAmount, currency)
2. Create Account aggregate using `Account.create()` factory method
   - Validates account name
   - Creates Money value objects for balances
   - Generates AccountId
   - Sets timestamps
3. Persist account via repository
4. Return created Account aggregate

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid account name | Name empty/too long | `InvalidArgumentException` |
| Negative balance | initialBalanceAmount < 0 | `InvalidArgumentException` |
| Invalid currency | Currency not in allowed list | `InvalidArgumentException` |
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns the created `Account` aggregate with:
- Generated `id` (AccountId)
- Provided `userId`, `name`
- `initialBalance` and `currentBalance` (both equal at creation)
- `createdAt` and `updatedAt` timestamps

## Repository Requirements

```typescript
interface AccountRepository {
  save(account: Account): Promise<void>;
}
```

## Example Usage

```typescript
const createAccount = CreateAccount(accountRepository);

const account = await createAccount.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  name: "Main Checking Account",
  initialBalanceAmount: 50000,
  currency: "COP"
});

// account.id.value => "01936a2b-..." (generated)
// account.toPrimitives() => { id: "...", userId: "...", name: "Main Checking Account", ... }
```

## Notes

- No duplicate name validation required (users can have multiple accounts with same name)
- Account type is intentionally not included (flexible categorization)
- Currency is enforced at account level (all transactions must use account's currency)
