# Module Structure Guide

This guide defines how to structure modules in `packages/core/`.

## Architecture Pattern

We use **Vertical Slice Architecture** (organize by feature) with **Clean Architecture layers** (domain/application/infrastructure) within each slice.

## Core Package Layout

```
packages/core/
├── src/
│   ├── _shared/           # Shared utilities (see Shared Code section)
│   │   ├── domain/
│   │   ├── application/
│   │   └── utils/
│   ├── users/             # Feature modules (vertical slices)
│   ├── accounts/
│   └── transactions/
```

## Standard Module Structure

```
packages/core/src/<module-name>/
├── domain/
│   ├── <name>.ts                    # Aggregate root
│   ├── <name>-id.ts                 # Value objects
│   └── <name>-repository.ts         # Repository interface
│
├── application/
│   ├── <action>-<name>.ts           # Use cases
│   ├── dto.<name>.ts
│   └── dto.<name>.ts
│
└── infrastructure/
    └── <name>-repository.postgres.ts # Repository implementation
```

### Example: Users Module

```
packages/core/src/users/
├── domain/
│   ├── user.ts
│   ├── user-id.ts
│   └── user-repository.ts
│
├── application/
│   ├── create-user.ts
│   ├── update-user-profile.ts
│   ├── get-user.ts
│   ├── dto.create-user.ts
│   └── dto.user-response.ts
│
└── infrastructure/
    └── user-repository.postgres.ts
```

## Layer Responsibilities

### Domain Layer (Pure business logic)

**What goes here:**

- Aggregates (business objects with identity and lifecycle)
- Value objects (strongly-typed primitives)
- Repository interfaces (ports)
- Domain events
- Business rules and invariants

**Rules:**

- No external dependencies
- No database, HTTP, or framework code
- Pure TypeScript/JavaScript
- Can be imported by any other module

**Example files:**

- `user.ts` - User aggregate root with business methods
- `user-id.ts` - Strongly-typed user ID
- `user-repository.ts` - Repository interface (port)

### Application Layer (Orchestration)

**What goes here:**

- Use cases (application workflows)
- DTOs (input/output data transfer objects)
- Application services (if needed)

**Rules:**

- Coordinates domain objects
- No business rules (delegates to domain)
- No database implementation details
- Depends on domain interfaces

**Example files:**

- `create-user.ts` - Orchestrates user creation
- `dto.create-user.ts` - Input data structure
- `dto.user-response.ts` - Output data structure

### Infrastructure Layer (Technical details)

**What goes here:**

- Repository implementations
- External service adapters
- Framework-specific code

**Rules:**

- Implements domain interfaces
- Handles technical concerns (DB, APIs, etc.)
- Can import from domain and application layers

**Example files:**

- `user-repository.postgres.ts` - Concrete PostgreSQL repository

## Database Schemas

**Database schemas live in `packages/db`, NOT in `packages/core`.**

### Rationale:

- Single source of truth for all tables
- Migration management is a database concern
- Multiple packages can import schemas
- Clean separation of concerns

### Usage in Infrastructure:

```typescript
// packages/core/users/infrastructure/user-repository.postgres.ts
import { users } from "@repo/db/schema";

export class UserRepositoryPostgres implements UserRepository {
  // ... uses schema from db package
}
```

## File Naming Conventions

**Use kebab-case with descriptive names matching the exported class:**

- Aggregates: `<name>.ts` (e.g., `user.ts` exports `User`)
- Value Objects: `<name>.ts` or `<name>-<property>.ts` (e.g., `user-id.ts` exports `UserId`)
- Repository Interfaces: `<name>-repository.ts` (e.g., `user-repository.ts` exports `UserRepository`)
- Repository Implementations: `<name>-repository.postgres.ts` (e.g., `user-repository.postgres.ts` exports `UserRepositoryPostgres`)
- Use Cases: `<action>-<name>.ts` (e.g., `create-user.ts` exports `CreateUser`)
- Errors: `<name>-error.ts` (e.g., `user-not-found-error.ts` exports `UserNotFoundError`)
- DTOs: `dto.<name>.ts` (e.g., `dto.create-user.ts`)

**Benefits:**

- File names directly match exported class names (in kebab-case)
- Clean, simple naming without prefixes
- Type suffixes (`-repository`, `-error`) provide context where needed
- More intuitive for developers familiar with modern conventions

## What We Don't Use

- ❌ No `index.ts` barrel files
- ❌ No nested `use-cases/` or `dtos/` folders in application layer
- ❌ No `persistence/` folder in infrastructure layer
- ❌ No `.impl.ts` or generic suffix (use `.postgres.ts` or specific implementation name)

## Shared Code (`_shared/`)

The `_shared/` folder contains code used by **3 or more modules**. The underscore prefix makes it visually distinct from domain modules.

### Structure:

```
packages/core/src/_shared/
├── domain/
│   ├── id.ts                    # Base for UUID IDs
│   ├── string-value-object.ts   # Base for string value objects
│   ├── aggregate-root.ts        # Base aggregate with domain events
│   ├── domain-event.ts          # Base DomainEvent
│   └── money.ts                 # Money VO (if 3+ modules need it)
├── application/
│   └── result.ts                # Result<T, E> for exception handling
└── utils/
    └── (add as needed when 3+ modules need it)
```

### What Goes in `_shared/`:

**`_shared/domain/`** - Domain-level abstractions

- Value object bases (`id.ts`, `string-value-object.ts`)
- Aggregate root base class (`aggregate-root.ts`)
- Domain event infrastructure (`domain-event.ts`)
- Shared value objects (`money.ts`) if used across 3+ modules

**`_shared/application/`** - Application-level abstractions

- Result types (`Result<T, E>`) for exception handling
- Application-level contracts (add as needed)

**`_shared/utils/`** - Technical utilities

- Pure utility functions
- Validation helpers
- Type guards
- Formatters/parsers (nothing domain-specific)

### The Rule of Three:

**Only move code to `_shared/` when 3+ modules need it.**

- 1 module needs it → Keep it in that module
- 2 modules need it → **Duplicate the code** in both modules
- 3+ modules need it → Abstract to `_shared/`

**Duplication is better than premature abstraction.**

### What NOT to Put in `_shared/`:

- ❌ Business logic (belongs in domain modules)
- ❌ "Maybe we'll need this later" code (YAGNI principle)
- ❌ Code used by only 1-2 modules
- ❌ Infrastructure implementations (those are tech-specific)

### Example Usage:

```typescript
// src/_shared/domain/id.ts
import { v7 as uuidv7, validate as uuidValidate } from "uuid";
import { InvalidArgumentException } from "./invalid-argument-exception";

export class Id {
  public readonly value: string;

  constructor(value?: string) {
    if (value == undefined) {
      this.value = this.generate();
    } else {
      this.ensureIsValidUuid(value);
      this.value = value;
    }
  }

  private generate(): string {
    return uuidv7();
  }

  private ensureIsValidUuid(value: string): void {
    if (uuidValidate(value)) return;
    throw new InvalidArgumentException("Invalid UUID format");
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }
}

// src/users/domain/user-id.ts
import { Id } from "~/_shared/domain/id";

export class UserId extends Id {
  constructor(value?: string) {
    super(value);
  }
}

// Usage examples:
const newId = new UserId();           // Generates new UUID v7
const existingId = new UserId("...");  // Uses existing UUID
console.log(newId.value);              // Access UUID string via .value
```

## Cross-Module Dependencies

### Domain Types Only

Modules can import from other modules' **domain layers only**:

```typescript
// ✅ Good: Importing domain types
import { UserId } from "users/domain/user-id";

// ❌ Bad: Importing infrastructure
import { UserRepositoryPostgres } from "users/infrastructure/user-repository.postgres";
```

### No Cross-Module Helpers

**Never import helpers, utilities, or application code between feature modules.**

If two modules need similar helper functions:

```typescript
// ❌ Bad: Importing helper from another module
import { validateEmail } from "users/application/validate-email";

// ✅ Good: Duplicate the code
// accounts/application/validate-email.ts
export function validateEmail(email: string): boolean {
  // ... same implementation
}
```

Once a third module needs it, move to `_shared/`:

```typescript
// ✅ Good: After 3+ modules need it
import { validateEmail } from "_shared/utils/validation";
```

**This maintains bounded context isolation** - each module stays self-contained.

### Dependency Flow:

```
_shared/        ← Can be imported by any module
  ↓
domain          ← Can be imported by other modules (domain types only)
  ↑
  └── application  ← Uses domain
        ↑
        └── infrastructure  ← Implements domain interfaces
```

## When to Create a New Module

Create a new module when you have a distinct **bounded context** in your domain:

- ✅ `users/` - User identity and profile
- ✅ `accounts/` - Financial accounts
- ✅ `transactions/` - Financial transactions
- ✅ `categories/` - Transaction categorization
- ❌ Don't create a module for every database table
- ❌ Don't create modules for technical concerns (use `_shared/` instead)

## Keep It Simple

This structure is a guideline, not a rigid rule:

- Start with domain aggregates
- Add use cases as needed
- Don't create infrastructure until you need it
- If a layer feels unnecessary for your module, skip it
- Flatten structure when it makes sense
