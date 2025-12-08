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
class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;
    userId: string;
    name: string;
    initialBalanceAmount: number;
    currency: string;
  }): Promise<void>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| id | string | Yes | Valid UUID v7 (client-generated) |
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
   - Client provides unique AccountId (UUID v7)
   - Current balance equals initial balance at creation
   - Created and updated timestamps set to current time

## Success Flow

1. Receive primitive parameters (id, userId, name, initialBalanceAmount, currency)
2. Create Account aggregate using `Account.create()` factory method
   - Uses provided id
   - Validates account name
   - Creates Money value objects for balances
   - Sets timestamps
3. Persist account via repository

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid account name | Name empty/too long | `InvalidArgumentException` |
| Negative balance | initialBalanceAmount < 0 | `InvalidArgumentException` |
| Invalid currency | Currency not in allowed list | `InvalidArgumentException` |
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns `void`. Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface AccountRepository {
  save(account: Account): Promise<void>;
}
```

## Example Usage

```typescript
const createAccount = new CreateAccount(accountRepository);

await createAccount.execute({
  id: "01936a2b-1234-7890-abcd-ef1234567890",
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  name: "Main Checking Account",
  initialBalanceAmount: 50000,
  currency: "COP"
});
```

## Notes

- No duplicate name validation required (users can have multiple accounts with same name)
- Account type is intentionally not included (flexible categorization)
- Currency is enforced at account level (all transactions must use account's currency)
