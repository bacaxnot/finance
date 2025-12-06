# Domain Patterns

Conventions and patterns for implementing domain layer components.

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

## Query/Retrieval Method Naming: `find*` vs `search*`

Use **`find`** and **`search`** to communicate the behavior of query/retrieval methods:

- **`find*`**: Must return a result or throw an exception (non-nullable)
- **`search*`**: Can return `null` or empty results (nullable)

**Pattern Examples:**

- `findById(id: string): User` - Always returns or throws
- `searchById(id: string): User | null` - May return null
- `findActiveUsers(): User[]` - Always returns array (may be empty)
- `searchByEmail(email: string): User | null` - May return null

### General Implementation

**Find - Must Exist:**

```typescript
export class UserService {
  // Must return a user or throw
  findById(id: string): User {
    const user = this.getUser(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  // Must return a user or throw
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.search({ email });
    if (!user) {
      throw new UserNotFoundException(`No user with email: ${email}`);
    }
    return user;
  }
}
```

**Search - May Not Exist:**

```typescript
export class UserService {
  // May return null
  searchByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) ?? null;
  }

  // May return empty array
  searchByRole(role: string): User[] {
    return this.users.filter((u) => u.role === role);
  }
}
```

**Use Case Example:**

```typescript
export class UpdateUserProfileUseCase {
  async execute(userId: string, data: ProfileData): Promise<void> {
    // find* throws if not found - safe to use directly
    const user = await this.userService.findById(userId);
    user.updateProfile(data);
    await this.userRepo.save(user);
  }
}

export class RegisterUserUseCase {
  async execute(email: string, data: RegistrationData): Promise<void> {
    // search* returns null - need to handle explicitly
    const existingUser = await this.userService.searchByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(email);
    }
    // Proceed with registration
  }
}
```

### Why This Convention?

**1. Clear Intent**

- Method name communicates whether result is guaranteed
- No need to check documentation or implementation
- Self-documenting code

**2. Type Safety**

```typescript
const user = findById(id); // Type: User (non-nullable)
user.updateProfile(); // Safe - no null check needed

const user = searchById(id); // Type: User | null
if (user) {
  // Compiler forces null check
  user.updateProfile();
}
```

**3. Explicit Exception Handling**

- `find*` methods centralize "not found" exception logic
- `search*` methods let callers decide how to handle absence
- Clear separation of concerns

### Repository Application

Repositories use **`search()`** exclusively. The `find` vs `search` distinction is applied at higher layers (services, use cases).

**Repository Level:** Always use `search()` - returns `null` or empty array

```typescript
export interface UserRepository {
  // All repository methods use search*
  search(id: string): Promise<User | null>;
  searchByEmail(email: string): Promise<User | null>;
  searchActive(): Promise<User[]>; // Returns [] if empty
  searchByRole(role: string): Promise<User[]>; // Returns [] if empty
}
```

**Why Repositories Only Use `search()`:**

1. **Single Responsibility** - Repositories handle data access, not business rules
2. **Flexibility** - Callers decide if absence is an exception
3. **Consistent Interface** - No ambiguity about repository behavior
4. **Testability** - Easier to test nullable return types

**Service/Use Case Level:** Implement `find*` when result must exist

```typescript
export class UserService {
  constructor(private userRepo: UserRepository) {}

  // Service provides find* wrapper when needed
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.search(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  // Or expose search* when null is acceptable
  async searchByEmail(email: string): Promise<User | null> {
    return this.userRepo.searchByEmail(email);
  }
}
```

### Array Queries

For collections, both `find*` and `search*` return arrays, but semantically differ:

```typescript
// find* - Implies result is expected (though array may be empty)
findActiveUsers(): User[]           // Returns [] if none active (expected case)
findUsersByRole(role: string): User[]

// search* - Implies result might not exist (more tentative)
searchUsersByKeyword(keyword: string): User[]  // May return [] (no matches)
searchRecentUsers(since: Date): User[]
```

**Note:** Empty arrays are always valid - no need for `| null` on array returns.
