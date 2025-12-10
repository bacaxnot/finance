# Code Conventions

Language conventions specific to our codebase.

## Validation Method Naming: `ensure*`

All validation methods that throw exceptions on invalid input must use the `ensure` prefix followed by a descriptive assertion.

**Pattern**: `ensure<WhatIsBeingValidated>()`

**Examples:**

- `ensureIsNotEmpty(value: string)`
- `ensureIsValidUuid(value: string)`
- `ensureHasValidCharacters(value: string)`
- `ensureHasValidLength(value: string)`
- `ensureUserExists(userId: string)`
- `ensureAccountBelongsToUser(account: Account, userId: UserId)`

### Implementation Pattern

**Value Object Example:**

```typescript
export class PersonName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidCharacters(value);
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureIsNotEmpty(value: string): void {
    if (value && value.trim() !== "") return;
    throw new InvalidArgumentException("Name cannot be empty");
  }

  private ensureHasValidCharacters(value: string): void {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (nameRegex.test(value)) return;
    throw new InvalidArgumentException("Name contains invalid characters");
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_NAME_LENGTH) return;
    throw new InvalidArgumentException(
      `Name is too long (max ${MAX_NAME_LENGTH} characters)`
    );
  }
}
```

**Aggregate Example:**

```typescript
export class Account {
  updateBalance(amount: Money): void {
    this.ensureAmountIsPositive(amount);
    this.ensureSameCurrency(amount);
    // ... update logic
  }

  private ensureAmountIsPositive(amount: Money): void {
    if (amount.isPositive()) return;
    throw new InvalidArgumentException("Amount must be positive");
  }

  private ensureSameCurrency(amount: Money): void {
    if (this.currency.equals(amount.currency)) return;
    throw new InvalidArgumentException("Currency mismatch");
  }
}
```

**Use Case Example:**

```typescript
export class CreateTransactionUseCase {
  async execute(input: CreateTransactionInput): Promise<void> {
    const account = await this.accountRepo.search(input.accountId);

    this.ensureAccountExists(account, input.accountId);
    this.ensureAccountBelongsToUser(account, input.userId);
    // ... continue with transaction creation
  }

  private ensureAccountExists(
    account: Account | null,
    accountId: string
  ): asserts account is Account {
    if (account) return;
    throw new AccountNotFoundException(accountId);
  }

  private ensureAccountBelongsToUser(account: Account, userId: UserId): void {
    if (account.belongsTo(userId)) return;
    throw new UnauthorizedException("Account does not belong to user");
  }
}
```

### Key Principles

1. **Early Return Pattern**: Check valid condition first, return early, then throw

   ```typescript
   // ✅ Good: Happy path first
   if (isValid) return;
   throw new InvalidArgumentException("Invalid");

   // ❌ Bad: Nested condition
   if (!isValid) {
     throw new InvalidArgumentException("Invalid");
   }
   ```

2. **Single Responsibility**: Each `ensure*` method validates one specific aspect

3. **Domain Exceptions**: Always throw domain-specific exceptions (`InvalidArgumentException`, `NotFoundException`, etc.)

4. **Private by Default**: Validation methods should be private unless needed externally

5. **Descriptive Names**: Method name should clearly describe what condition is being ensured

### Why This Convention?

**1. Clear Intent**

- `ensure` prefix immediately signals the method throws on validation failure
- Distinguishes validation from other methods (getters, calculations, etc.)
- Self-documenting code

**2. Single Responsibility**

- Each validation is isolated and testable
- Easy to add, remove, or modify specific validations
- Clear what each validation checks

**3. Readability**

```typescript
// Clear sequence of validations
constructor(value: string) {
  this.ensureIsNotEmpty(value);
  this.ensureHasValidCharacters(value);
  this.ensureHasValidLength(value);
  this.value = value.trim();
}
```

**4. Consistency Across Codebase**

- Same pattern in value objects, aggregates, and use cases
- Easy for developers to recognize validation logic
- Reduces cognitive load when reading code
