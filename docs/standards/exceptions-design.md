# Exception Design

Guidelines for designing and organizing exceptions in the domain layer.

## Core Principles

**Exceptions belong to the module that defines the concept being validated.**

Exceptions are domain concepts that communicate business rule violations. They live in the domain layer alongside aggregates and value objects, organized by module boundaries.

## Organization

Exceptions are organized by module:

```
src/
├── _shared/domain/
│   └── exceptions.ts              # BaseException, InvalidArgumentException
├── accounts/domain/
│   └── exceptions.ts              # Account-specific exceptions
├── categories/domain/
│   └── exceptions.ts              # Category-specific exceptions
└── transactions/domain/
    └── exceptions.ts              # Transaction-specific exceptions
```

### Shared vs Module-Specific

**Shared exceptions** (`_shared/domain/exceptions.ts`):
Create shared exceptions when they represent **generic, cross-cutting concepts** used by multiple modules.

```typescript
// _shared/domain/exceptions.ts
export abstract class BaseException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidArgumentException extends BaseException {}
```

**Examples of shared exceptions:**
- `BaseException` - Base class for all exceptions
- `InvalidArgumentException` - Generic validation errors used across all value objects

**Module-specific exceptions** live in their respective modules:
Create module exceptions when they represent **domain-specific business rules** tied to that module's concepts.

```typescript
// accounts/domain/exceptions.ts
import { BaseException } from "~/_shared/domain/exceptions";

export class AccountNotFoundException extends BaseException {}
export class UnauthorizedAccountAccessException extends BaseException {}
```

```typescript
// categories/domain/exceptions.ts
import { BaseException } from "~/_shared/domain/exceptions";

export class CategoryNotFoundException extends BaseException {}
export class UnauthorizedCategoryAccessException extends BaseException {}
```

```typescript
// transactions/domain/exceptions.ts
import { BaseException } from "~/_shared/domain/exceptions";

export class TransactionNotFoundException extends BaseException {}
export class UnauthorizedTransactionAccessException extends BaseException {}
export class CurrencyMismatchException extends BaseException {}
```

**Guidelines:**
- Most exceptions should be module-specific (tied to domain concepts)
- Only create shared exceptions for truly generic, reusable validation failures
- When in doubt, create a module-specific exception

## Naming Convention

Exception names should clearly describe the error condition:

**Pattern**: `{Concept}{ErrorCondition}Exception`

```typescript
// ✅ Good: Clear what failed and why
AccountNotFoundException
UnauthorizedAccountAccessException
CurrencyMismatchException
InvalidArgumentException

// ❌ Bad: Vague or generic
AccountError
BadRequest
ValidationError
Exception
```

**Common patterns**:
- `{Entity}NotFoundException` - Entity doesn't exist
- `Unauthorized{Entity}AccessException` - User lacks permission
- `{Concept}MismatchException` - Values don't match expected criteria
- `Invalid{Concept}Exception` - Value fails validation

## When to Create Exceptions

Create a new exception class when:
1. **Represents a distinct business rule violation**
2. **Needs different handling** than existing exceptions
3. **Communicates specific domain meaning**

**Use existing exceptions when possible:**

```typescript
// ✅ Good: Reuse InvalidArgumentException for generic validation
class AccountName {
  constructor(value: string) {
    if (!value.trim()) {
      throw new InvalidArgumentException("Account name cannot be empty");
    }
    this.value = value;
  }
}

// ❌ Bad: Don't create exceptions for every validation
class EmptyAccountNameException extends BaseException {}
class TooLongAccountNameException extends BaseException {}
class InvalidCharactersInAccountNameException extends BaseException {}
```

**Create specific exceptions for business rules:**

```typescript
// ✅ Good: Distinct business concept
export class CurrencyMismatchException extends BaseException {}

// Use case
if (!account.hasCurrency(transactionCurrency)) {
  throw new CurrencyMismatchException(
    "Transaction currency must match account currency"
  );
}
```

## Exception Messages

Write clear, actionable error messages:

```typescript
// ✅ Good: Specific and actionable
throw new AccountNotFoundException(`Account with ID ${accountId} not found`);
throw new CurrencyMismatchException("Transaction currency must match account currency");
throw new InvalidArgumentException("Account name cannot be empty");

// ❌ Bad: Vague or unhelpful
throw new AccountNotFoundException("Not found");
throw new CurrencyMismatchException("Invalid");
throw new InvalidArgumentException("Error");
```

**Guidelines:**
- State what went wrong
- Include relevant identifiers (IDs, names)
- Suggest what was expected (when helpful)
- Keep it concise (1-2 sentences)

## Implementation Pattern

All exceptions extend `BaseException` directly. Start simple, add structure when needed.

### Simple Exceptions

For exceptions where the message alone provides sufficient context:

```typescript
export class UnauthorizedCategoryAccessException extends BaseException {}

// Usage
throw new UnauthorizedCategoryAccessException("Category does not belong to user");
```

### Structured Exceptions

For exceptions that benefit from structured data (observability, error handling), include domain-relevant context:

```typescript
export class AccountNotFoundException extends BaseException {
  constructor(
    public readonly accountId: string
  ) {
    super(`Account not found: ${accountId}`);
  }
}

// Usage
throw new AccountNotFoundException(params.accountId);
```

```typescript
export class CurrencyMismatchException extends BaseException {
  constructor(
    public readonly expected: string, 
    public readonly actual: string
  ) {
    super(`Currency mismatch: expected ${this.expected}, got ${this.actual}`);
  }
}

// Usage
throw new CurrencyMismatchException(account.currency, transaction.currency);
```

**When to add structured properties:**
- When integrating observability tools (structured logging, error tracking)
- For frequently-thrown exceptions that need better traceability
- When domain context (IDs, values) helps debugging

**What NOT to include:**
- ❌ Timestamps (infrastructure adds these)
- ❌ Request context (user agent, IP, session)
- ❌ Stack traces (automatically included)
- ❌ Generic metadata unrelated to domain

**Start simple, add structure when needed.** Don't prematurely optimize for observability tools you haven't integrated yet.

## Import Pattern

Import exceptions from their module:

```typescript
// ✅ Good: Import from module
import { AccountNotFoundException } from "~/accounts/domain/exceptions";
import { CategoryNotFoundException } from "~/categories/domain/exceptions";
import { InvalidArgumentException } from "~/_shared/domain/exceptions";

// ❌ Bad: Don't centralize imports
import {
  AccountNotFoundException,
  CategoryNotFoundException,
} from "~/_shared/domain/exceptions";
```

## Usage in Use Cases

Use exceptions to communicate business rule violations. Let them bubble up - don't catch and wrap.

```typescript
// ✅ Good: Direct, clear exceptions
class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(params: { userId: string; categoryId: string; name: string }): Promise<void> {
    const category = await this.categoryRepository.search(new CategoryId(params.categoryId));

    if (!category) {
      throw new CategoryNotFoundException(`Category with ID ${params.categoryId} not found`);
    }

    if (!category.belongsTo(new UserId(params.userId))) {
      throw new UnauthorizedCategoryAccessException("Category does not belong to user");
    }

    category.update(new CategoryName(params.name));
    await this.categoryRepository.save(category);
  }
}
```

```typescript
// ❌ Bad: Don't catch and wrap
class UpdateCategory {
  async execute(params: { userId: string; categoryId: string; name: string }): Promise<void> {
    try {
      const category = await this.categoryRepository.search(new CategoryId(params.categoryId));
      // ...
    } catch (error) {
      throw new UseCaseException("Failed to update category", error); // Don't do this
    }
  }
}
```

## Checklist

When creating exceptions:

1. ✓ Does it represent a distinct business rule violation?
2. ✓ Is it in the correct module's `domain/exceptions.ts` file?
3. ✓ Does it extend `BaseException`?
4. ✓ Does the name clearly describe the error condition?
5. ✓ Are error messages specific and actionable?
6. ✓ Is it being imported from its module (not shared)?

## Examples

**Value Object Validation**:
```typescript
import { InvalidArgumentException } from "~/_shared/domain/exceptions";

export class AccountName {
  constructor(value: string) {
    if (!value.trim()) {
      throw new InvalidArgumentException("Account name cannot be empty");
    }
    if (value.length > 100) {
      throw new InvalidArgumentException("Account name cannot exceed 100 characters");
    }
    this.value = value.trim();
  }
}
```

**Use Case Validation**:
```typescript
import { AccountNotFoundException } from "~/accounts/domain/exceptions";
import { CategoryNotFoundException } from "~/categories/domain/exceptions";
import { CurrencyMismatchException } from "~/transactions/domain/exceptions";

export class CreateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(params: { /* ... */ }): Promise<void> {
    const account = await this.accountRepository.search(new AccountId(params.accountId));
    if (!account) {
      throw new AccountNotFoundException(`Account with ID ${params.accountId} not found`);
    }

    if (!account.hasCurrency(new Currency(params.currency))) {
      throw new CurrencyMismatchException("Transaction currency must match account currency");
    }

    if (params.categoryId) {
      const category = await this.categoryRepository.search(new CategoryId(params.categoryId));
      if (!category) {
        throw new CategoryNotFoundException(`Category with ID ${params.categoryId} not found`);
      }
    }

    // Create and save transaction...
  }
}
```
