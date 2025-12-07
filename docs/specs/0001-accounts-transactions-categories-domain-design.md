# Domain Entities Design Specification

**Version:** 9.2.0
**Date:** 2025-12-06
**Status:** Approved

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Accounts Domain](#accounts-domain)
4. [Categories Domain](#categories-domain)
5. [Transactions Domain](#transactions-domain)
6. [Design Decisions](#design-decisions)

---

## Overview

This document specifies the domain entities for a personal finance application following Domain-Driven Design (DDD) principles. The application consists of three core domains:

- **Accounts**: Managing financial accounts with initialBalance and currentBalance (Money objects)
- **Categories**: Organizing transactions into flat categories
- **Transactions**: Recording all financial movements (inbound/outbound)

### Pattern Reference

All entities follow the established pattern from the `users` domain:

- **Value Objects**: Immutable objects with validation
- **Aggregates**: Business entities with identity
- **Repositories**: Interfaces for persistence
- **Primitives Types**: Plain objects for serialization

---

## Design Principles

### 1. Value Objects

- Immutable
- Self-validating
- No identity (equality by value)
- ID value objects: `public readonly value` property, `equals()` method
- Other value objects: `toString()`, `equals()`, and other domain-specific methods

### 2. Aggregates

- Private constructor
- Static factory methods: `create()`, `fromPrimitives()`
- Instance method: `toPrimitives()`
- Encapsulate business logic
- Maintain invariants

### 3. Repositories

- Interface only (implementation in infrastructure)
- Return promises
- Basic CRUD operations + domain-specific queries

---

## Accounts Domain

**Purpose**: Manage financial accounts (bank accounts, credit cards, cash, investments) and their balances.

### Value Objects

**Note**: UserId value object is reused from the existing `/packages/core/src/users/domain/` module.

#### AccountId

```typescript
class AccountId extends Id {
  constructor(value?: string); // Generates UUID v7 if no value provided
}
```

**Note**: Extends base `Id` class from `packages/core/src/_shared/domain/value-object.id.ts`. Inherits `public readonly value: string` and `equals()` method.

#### Currency

```typescript
class Currency {
  constructor(public readonly value: string); // ISO 4217 (e.g., "USD", "COP")
  equals(other: Currency): boolean;
}
```

**Validation Rules:**

- `ensureIsValidCode(value: string)` - Validates against allowed currency codes (COP for MVP)

#### Money

```typescript
class Money {
  private amount: number;
  private currency: Currency;

  constructor(amount: number, currency: string);

  add(other: Money): Money; // Requires same currency
  subtract(other: Money): Money; // Requires same currency
  isZero(): boolean;
  toPrimitives(): { amount: number; currency: string };
}
```

**Validation Rules:**

- `ensureAmountIsNotNegative(amount: number)` - Amount must be >= 0 (no negative amounts)
- `ensureSameCurrency(other: Money)` - Currency must match for arithmetic operations (add/subtract)

**Note on Usage:**

- Money value object is used consistently for ALL monetary values (transaction amounts, account balances)
- Ensures uniform treatment of money throughout the domain
- Currency is always paired with amount (no separation)
- Provides conceptual integrity and consistency across all aggregates

#### AccountName

```typescript
class AccountName {
  constructor(public readonly value: string);
  equals(other: AccountName): boolean;
}
```

**Validation Rules:**

- `ensureIsNotEmpty(value: string)` - Name cannot be empty or whitespace-only
- `ensureHasValidLength(value: string)` - Maximum 100 characters

**Behavior:**

- Trims leading and trailing whitespace
- Case-insensitive equality comparison (`equals()` method)

### Aggregates

#### Account

```typescript
type AccountPrimitives = {
  id: string;
  userId: string;
  name: string;
  initialBalance: { amount: number; currency: string };
  currentBalance: { amount: number; currency: string };
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
};

class Account {
  private id: AccountId;
  private userId: UserId;
  private name: AccountName;
  private initialBalance: Money;
  private currentBalance: Money;
  private createdAt: Date;
  private updatedAt: Date;

  static create(
    userId: string,
    name: string,
    initialBalanceAmount: number,
    currency: string
  ): Account;

  static fromPrimitives(primitives: AccountPrimitives): Account;

  toPrimitives(): AccountPrimitives;
}
```

**Business Rules:**

- userId is required and immutable (account belongs to a user)
- Name validation handled by AccountName value object
- Balance amount validation handled by Money value object
- Initial balance is immutable (set once at creation)
- Current balance updated by transactions

**Balance Formula:**

```
currentBalance = initialBalance + ∑(Inbound Transactions) - ∑(Outbound Transactions)
```

### Repositories

#### AccountRepository

```typescript
interface AccountRepository {
  save(account: Account): Promise<void>;
  search(id: string): Promise<Account | null>;
}
```

---

## Categories Domain

**Purpose**: Organize transactions into categories for budgeting and reporting.

### Value Objects

#### CategoryId

```typescript
class CategoryId extends Id {
  constructor(value?: string); // Generates UUID v7 if no value provided
}
```

**Note**: Extends base `Id` class from `packages/core/src/_shared/domain/value-object.id.ts`. Inherits `public readonly value: string` and `equals()` method.

#### CategoryName

```typescript
class CategoryName {
  constructor(public readonly value: string);
  equals(other: CategoryName): boolean;
}
```

**Validation Rules:**

- `ensureIsNotEmpty(value: string)` - Name cannot be empty or whitespace-only
- `ensureHasValidLength(value: string)` - Maximum 50 characters

**Behavior:**

- Trims leading and trailing whitespace
- Case-insensitive equality comparison (`equals()` method)

### Aggregates

#### Category

```typescript
type CategoryPrimitives = {
  id: string;
  userId: string;
  name: string;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
};

class Category {
  private id: CategoryId;
  private userId: UserId;
  private name: CategoryName;
  private createdAt: Date;
  private updatedAt: Date;

  static create(userId: string, name: string): Category;

  static fromPrimitives(primitives: CategoryPrimitives): Category;

  toPrimitives(): CategoryPrimitives;
}
```

**Business Rules:**

- userId is required and immutable (category belongs to a user)
- Name validation handled by CategoryName value object

### Repositories

#### CategoryRepository

```typescript
interface CategoryRepository {
  save(category: Category): Promise<void>;
  search(id: string): Promise<Category | null>;
}
```

---

## Transactions Domain

**Purpose**: Record all financial movements (inbound and outbound transactions) between accounts and categories.

### Value Objects

#### TransactionId

```typescript
class TransactionId extends Id {
  constructor(value?: string); // Generates UUID v7 if no value provided
}
```

**Note**: Extends base `Id` class from `packages/core/src/_shared/domain/value-object.id.ts`. Inherits `public readonly value: string` and `equals()` method.

#### TransactionDirection

```typescript
type TransactionDirectionType = "inbound" | "outbound";

class TransactionDirection {
  constructor(public readonly value: TransactionDirectionType);
  equals(other: TransactionDirection): boolean;
}
```

**Validation Rules:**

- `ensureIsValidDirection(value: string)` - Must be either "inbound" or "outbound"

#### TransactionDescription

```typescript
class TransactionDescription {
  constructor(public readonly value: string);
  equals(other: TransactionDescription): boolean;
}
```

**Validation Rules:**

- `ensureIsNotEmpty(value: string)` - Description cannot be empty or whitespace-only
- `ensureHasValidLength(value: string)` - Maximum 200 characters

#### TransactionDate

```typescript
class TransactionDate {
  constructor(public readonly value: Date);
  equals(other: TransactionDate): boolean;
}
```

**Validation Rules:**

- `ensureDateIsNotInFuture(date: Date)` - Transaction date cannot be in the future

### Aggregates

#### Transaction

```typescript
type TransactionPrimitives = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: { amount: number; currency: string };
  direction: TransactionDirectionType;
  description: string;
  transactionDate: string; // ISO 8601 UTC
  notes?: string;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
};

class Transaction {
  private id: TransactionId;
  private userId: UserId;
  private accountId: AccountId;
  private categoryId: CategoryId;
  private amount: Money;
  private direction: TransactionDirection;
  private description: TransactionDescription;
  private date: TransactionDate;
  private notes?: string;
  private createdAt: Date;
  private updatedAt: Date;

  static create(
    userId: string,
    accountId: string,
    categoryId: string,
    amount: number,
    currency: string,
    direction: TransactionDirectionType,
    description: string,
    transactionDate: string, // ISO 8601 UTC
    notes?: string
  ): Transaction;

  static fromPrimitives(primitives: TransactionPrimitives): Transaction;

  toPrimitives(): TransactionPrimitives;
}
```

**Business Rules:**

- userId is required and immutable (enables direct querying of all user transactions)
- All transactions require categoryId and accountId
- Amount validation handled by Money value object
- Description validation handled by TransactionDescription value object
- Transaction date validation handled by TransactionDate value object
- Direction validation handled by TransactionDirection value object

### Repositories

#### TransactionRepository

```typescript
interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  search(id: string): Promise<Transaction | null>;
}
```

---

## Design Decisions

### 1. Money Value Object - Positive Amounts Only

**Decision**: Money value object only accepts amounts >= 0 (no negative amounts)

**Rationale**:

- Money represents an amount, not a balance or debt
- Direction/context determines if it's incoming or outgoing
- All account balances stored as positive values (even for debt accounts)
- Cleaner validation and semantics
- Application layer interprets context for display ("You owe $500" vs "You have $500")

---

### 2. No Account Types

**Decision**: Accounts do not have a "type" field (no checking, savings, credit, etc.)

**Rationale**:

- Keep the domain model simple and flexible
- Account classification can be handled at the application layer if needed
- All accounts work the same way at the domain level
- Easy to extend with different categorization approaches later

---

### 3. Transaction Direction - Inbound/Outbound

**Decision**: Use "inbound" and "outbound" for transaction direction, not income/expense

**Rationale**:

- More neutral terminology (money moving in or out of account)
- Decouples from tax/accounting concepts
- Simple binary choice
- Categories provide the semantic meaning (salary, groceries, etc.)

**No Transfers**: Transfer functionality deferred for now (MVP scope reduction)

---

### 4. Balance as Money Objects (Consistent Modeling)

**Decision**: Store `initialBalance` and `currentBalance` as Money value objects in Account aggregate

**Rationale**:

- Consistency: Money is modeled the same way everywhere (Transaction and Account)
- Conceptual integrity: "Money" is always amount + currency together
- No special cases: All monetary values use Money value object
- Easier to reason about: "All money is Money"
- Pure DDD: Value objects should be used uniformly across the domain
- Self-contained: Each balance carries its own currency context

**Trade-off**: Currency is duplicated in primitives (initialBalance and currentBalance both have currency), but this enforces that both must be in the same currency and provides clearer domain semantics. Duplication is acceptable for conceptual clarity.

---

### 5. Initial Balance + Current Balance

**Decision**: Store both `initialBalance` and `currentBalance` as Money objects in Account aggregate

**Rationale**:

- Essential accounting formula: `currentBalance = initialBalance + ∑(Inbound) - ∑(Outbound)`
- Without initial balance, all accounts would start at $0 (incorrect)
- Users need to track existing accounts with existing balances
- Both are Money objects with amount + currency
- Initial balance is immutable (set once at creation)
- Current balance updated by transactions at application layer
- Enables "net change" calculations: `currentBalance - initialBalance`
- Both balances must be in the same currency (aggregate invariant)

**Alternative Considered**: Single balance field only (rejected: loses the starting point reference)

---

### 6. Currency Enforcement

**Decision**: Each account has a fixed currency, transactions inherit account currency

**Rationale**:

- Simplifies handling (initially only COP supported)
- Prevents currency mismatch exceptions
- Currency stored with Money value object for future multi-currency support

**Future Enhancement**: Add exchange rate and multi-currency transfer support

---

### 7. Basic Repositories

**Decision**: Repositories only have save() and search() methods initially

**Rationale**:

- Start with minimum viable interface
- Additional query methods can be added as needed
- Keep domain layer focused on core operations
- Application layer can handle more complex queries

---

## Next Steps

1. **Review and approve this specification**
2. **Implement in this order:**
   - Value Objects (no dependencies):
     - Currency
     - Money (depends on Currency)
     - AccountId, CategoryId, TransactionId (extend from Id base class)
     - AccountName
     - CategoryName
     - TransactionDirection
     - TransactionDescription
     - TransactionDate
   - Aggregates (depend on value objects):
     - Account
     - Category
     - Transaction
   - Repository Interfaces:
     - AccountRepository
     - CategoryRepository
     - TransactionRepository
3. **Write unit tests for each entity** (using existing test patterns)
4. **Keep it simple** - resist adding features not in this spec

---

## References

- Existing pattern: `/packages/core/src/users/domain/`
- DDD principles: Aggregates, Value Objects, Repositories
- ISO 4217: Currency codes standard
