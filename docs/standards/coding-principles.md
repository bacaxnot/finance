# Coding Principles

Core principles and practices for writing clean, maintainable code in this project.

## YAGNI (You Aren't Gonna Need It)

**Don't build features, abstractions, or infrastructure until you actually need them.**

```typescript
// ❌ Bad: Premature optimization
class User {
  private cachedFullName?: string;

  getFullName(): string {
    if (!this.cachedFullName) {
      this.cachedFullName = `${this.firstName} ${this.lastName}`;
    }
    return this.cachedFullName;
  }
}

// ✅ Good: Simple until proven slow
class User {
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

**Examples of YAGNI violations:**

- Adding configuration options "for future flexibility"
- Creating interfaces for classes with only one implementation
- Building generic solutions for specific problems
- Adding error handling for scenarios that can't happen

**When to add complexity:**

- When you have a concrete, current need
- When performance profiling shows it's necessary
- When a feature is explicitly requested

## The Rule of Three

**Only abstract code when 3 or more places need it. Before that, duplicate.**

```typescript
// 1st use - Keep it in the module
// users/domain/validate-email.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 2nd use - Duplicate it
// accounts/domain/validate-email.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 3rd use - Now abstract to _shared/
// _shared/utils/validation.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Why duplication is better than premature abstraction:**

- Easier to change isolated code than shared abstractions
- Each module can evolve independently
- Wrong abstractions are harder to remove than duplication
- Duplication is visible; bad abstractions hide complexity

**When to abstract:**

- After the 3rd usage in different modules
- When the duplication causes real maintenance problems
- When the abstraction is obvious and stable

## Comments

**Comments should explain WHY, not WHAT. The code itself should explain what it does.**

### ❌ Bad Comments (Noise)

```typescript
/**
 * Creates a new User aggregate
 */
static create(firstName: string, lastName: string): User {
  return new User(UserId.generate(), ...);
}

/**
 * Returns the user's full name
 */
getFullName(): string {
  return `${this.firstName} ${this.lastName}`;
}

// Set the user's first name
this.firstName = firstName;
```

These comments just repeat what the code already says clearly.

### ✅ Good Comments (Insight)

```typescript
// Allow letters (including accented), spaces, hyphens, and apostrophes
// Handles international names: "María", "O'Brien", "Jean-Claude", etc.
const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

// HACK: API returns inconsistent date formats, normalize to ISO
const normalizedDate = parseFlexibleDate(apiResponse.date);

// TODO: Replace with proper event sourcing when we add audit logs
user.updatedAt = new Date();
```

**When to write comments:**

- Explaining complex regex, algorithms, or business rules
- Warning about gotchas or edge cases
- Explaining WHY a decision was made (especially non-obvious ones)
- TODOs with context for future work
- Marking hacks/workarounds that should be fixed

**When NOT to write comments:**

- Describing what a function does (use a clear function name instead)
- Repeating parameter names or return types
- Explaining obvious code
- Writing JSDoc for every public method "because it's public"

### Clear Code Over Comments

Instead of commenting bad code, refactor it:

```typescript
// ❌ Bad: Comment explaining unclear code
// Check if the user is an admin or owner of the account
if (u.r === "admin" || u.id === a.ownerId) {
  // ...
}

// ✅ Good: Code explains itself
const canAccessAccount = user.isAdmin() || account.belongsTo(user);
if (canAccessAccount) {
  // ...
}
```

## Keep It Simple

**Choose simplicity over cleverness.**

```typescript
// ❌ Bad: Clever but hard to understand
const activeUsers = users.reduce(
  (acc, u) => (u.isActive ? [...acc, u] : acc),
  []
);

// ✅ Good: Simple and clear
const activeUsers = users.filter((u) => u.isActive);
```

**Prefer:**

- Explicit over implicit
- Boring over clever
- Readable over concise
- Standard patterns over custom solutions

**Avoid:**

- Deep nesting (max 2)
- Long functions (keep under 20-30 lines)
- Cryptic variable names (`u`, `tmp`, `data`)
- Clever one-liners that need comments to explain

## No Premature Optimization

**Make it work, make it right, then make it fast (if needed).**

```typescript
// ❌ Bad: Optimizing before measuring
class UserRepository {
  private cache = new Map<string, User>();

  async findById(id: string): Promise<User> {
    if (this.cache.has(id)) return this.cache.get(id)!;
    const user = await this.db.query(...);
    this.cache.set(id, user);
    return user;
  }
}

// ✅ Good: Simple until proven slow
class UserRepository {
  async findById(id: string): Promise<User> {
    return this.db.query(...);
  }
}
```

**Only optimize when:**

1. You've measured and found actual performance problems
2. The optimization solves a real user pain point
3. You can measure the improvement

**Don't optimize:**

- Based on assumptions
- For hypothetical future scale
- Before the code even works

## Boy Scout Rule

**Leave the code cleaner than you found it.**

When touching existing code:

- Fix obvious issues you see
- Improve naming if unclear
- Extract magic numbers to constants
- Add missing error handling (if actually needed)

But don't:

- Refactor unrelated code in the same PR
- "Clean up" working code that doesn't need it
- Change style just for consistency if it works

## Error Messages

**Write error messages for humans, not machines.**

```typescript
// ❌ Bad: Vague, unhelpful
throw new Error("Invalid input");
throw new Error("Error");

// ✅ Good: Specific, actionable
throw new Error("User ID cannot be empty");
throw new Error(
  "Name contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed."
);
```

**Good error messages:**

- Say what went wrong
- Say what was expected
- Suggest how to fix it (if applicable)

## Summary

1. **YAGNI** - Build only what you need now
2. **Rule of Three** - Duplicate before abstracting
3. **Comments** - Explain WHY, not WHAT
4. **Simplicity** - Boring is better than clever
5. **No premature optimization** - Measure before optimizing
6. **Boy Scout Rule** - Leave it better than you found it
7. **Clear errors** - Write for humans

When in doubt, choose the simpler option.
