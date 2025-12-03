# Domain Patterns

Conventions and patterns for implementing domain layer components.

## Repository Conventions

### Repository Query Convention: Search Only

Repositories use **`search()`** for all queries, returning nullable values or empty arrays. The "find vs search" distinction is applied at the **use case level**, not the repository level.

**Repository Level:** Always use `search()` - returns `null` or empty array if not found

```typescript
export interface UserRepository {
  // All repository queries use search()
  search(id: string): Promise<User | null>;
  searchByEmail(email: string): Promise<User | null>;
  searchActive(): Promise<User[]>;        // Can be empty
  searchByRole(role: string): Promise<User[]>;  // Can be empty
}
```

**Use Case Level:** Implement "find" logic when entity must exist

```typescript
// When entity MUST exist, throw in use case
async execute(userId: string) {
  const user = await this.userRepo.search(userId);
  if (!user) {
    throw new UserNotFoundError(userId);
  }
  // Continue with confidence that user exists
  user.updateProfile(...);
}

// When entity might not exist, handle null
async execute(email: string) {
  const existingUser = await this.userRepo.searchByEmail(email);
  if (existingUser) {
    throw new EmailAlreadyExistsError(email);
  }
  // Proceed with registration
}
```

### Why This Convention?

**1. Repository Simplicity**
- Repositories only do data retrieval, no business decisions
- No need to decide "should this throw or return null?"
- Consistent interface: all methods use `search()`

**2. Use Case Control**
- Business logic determines what "not found" means
- Some use cases need to throw, others handle null differently
- Explicit error handling at the right layer

**3. Type Safety**
```typescript
// Repository always returns nullable
search(id: string): Promise<User | null>  // Compiler forces null check

// Use case handles based on business rules
const user = await repo.search(id);
if (!user) throw new UserNotFoundError(id);  // Explicit
```

### Array Queries

Collections always use `search()` and return empty arrays when nothing found:

```typescript
export interface UserRepository {
  searchActive(): Promise<User[]>;        // Returns [] if empty
  searchByRole(role: string): Promise<User[]>;  // Returns [] if empty
}
```

Empty arrays are valid - no need for `| null`.

## Start Simple

Only add repository methods as you need them for specific use cases.

```typescript
// ✅ Good: Start with what you need
export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: string): Promise<User | null>;
}

// ❌ Bad: Premature methods
export interface UserRepository {
  save(user: User): Promise<void>;
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
