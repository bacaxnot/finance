# Domain Patterns

Conventions and patterns for implementing domain layer components.

## Repository Conventions

### Find vs Search

We use explicit naming to communicate whether a query is guaranteed to return a result.

**`find()`** - Guaranteed to return, throws if not found
**`search()`** - Optional return, can be null/empty

```typescript
export interface UserRepository {
  // Guaranteed: Use when you know the entity exists
  find(id: string): Promise<User>;

  // Optional: Use when entity might not exist
  search(id: string): Promise<User | null>;
  searchByEmail(email: string): Promise<User | null>;
}
```

### When to use `find()`

Use `find()` when the entity **must exist** for the operation to be valid:

```typescript
// Use case expects user to exist
async execute(userId: string) {
  const user = await this.userRepo.find(userId); // Throws if not found
  // Continue with confidence that user exists
  user.updateProfile(...);
}
```

**Throws:** Repository implementation should throw a domain-specific error:
```typescript
throw new UserNotFoundError(id);
```

### When to use `search()`

Use `search()` when the entity **might not exist** and that's a valid scenario:

```typescript
// Check if email is already taken
async execute(email: string) {
  const existingUser = await this.userRepo.searchByEmail(email);
  if (existingUser) {
    throw new EmailAlreadyExistsError(email);
  }
  // Proceed with registration
}
```

**Returns:** `null` or empty array if nothing found.

### Array queries

For queries returning collections, use `search` prefix:

```typescript
export interface UserRepository {
  searchActive(): Promise<User[]>;        // Can be empty
  searchByRole(role: string): Promise<User[]>;  // Can be empty
}
```

Empty arrays are valid - no need for `| null`.

## Benefits

**1. Clear intent at call site**
```typescript
// Reader knows: this will throw if user doesn't exist
const user = await repo.find(userId);

// Reader knows: need to handle null case
const user = await repo.search(userId);
if (!user) return;
```

**2. Reduces boilerplate**
```typescript
// ❌ Before: Manual null check everywhere
const user = await repo.find(userId);
if (!user) throw new NotFoundError();

// ✅ After: find() guarantees existence
const user = await repo.find(userId);
```

**3. Type safety**
```typescript
find(id: string): Promise<User>        // No null handling needed
search(id: string): Promise<User | null>  // Compiler forces null check
```

## Start Simple

Only add methods as you need them. Don't create `search()` until you have a use case for optional lookups.

```typescript
// ✅ Good: Start with what you need
export interface UserRepository {
  save(user: User): Promise<void>;
  find(id: string): Promise<User>;
}

// ❌ Bad: Premature methods
export interface UserRepository {
  save(user: User): Promise<void>;
  find(id: string): Promise<User>;
  search(id: string): Promise<User | null>;
  searchByEmail(email: string): Promise<User | null>;
  searchByRole(role: string): Promise<User[]>;
  searchActive(): Promise<User[]>;
  // ... methods you don't need yet
}
```

Add methods when you write a use case that needs them. Not before.

### Complex Queries

If you need queries with multiple optional parameters, use the **Criteria/Specification pattern** instead of method explosion:

```typescript
// ❌ Bad: Method explosion
searchByRole(role: string): Promise<User[]>;
searchByRoleAndStatus(role: string, status: string): Promise<User[]>;
searchByRoleAndStatusAndCreatedAfter(role: string, status: string, date: Date): Promise<User[]>;

// ✅ Good: Criteria pattern
search(criteria: UserSearchCriteria): Promise<User[]>;
```

**Note:** Criteria pattern implementation guide coming soon. Use simple methods until you have 3+ search combinations.
