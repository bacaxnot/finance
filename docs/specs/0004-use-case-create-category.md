# Use Case: Create Category

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to create a new transaction category for organizing their financial transactions.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User must exist in the system
**Postconditions**: New category is created and persisted

## Signature

```typescript
class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(params: {
    id: string;
    userId: string;
    name: string;
  }): Promise<void>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| id | string | Yes | Valid UUID v7 (client-generated) |
| userId | string | Yes | Valid UUID, user must exist |
| name | string | Yes | 1-50 characters, non-empty after trim |

## Business Rules

1. **Category Name Validation**
   - Cannot be empty or whitespace only
   - Maximum 50 characters
   - Trimmed before storage

2. **Category Creation**
   - Client provides unique CategoryId (UUID v7)
   - Created and updated timestamps set to current time
   - No duplicate name validation (users can have multiple categories with same name)

## Success Flow

1. Receive primitive parameters (id, userId, name)
2. Create Category aggregate using `Category.create()` factory method
   - Uses provided id
   - Validates category name
   - Sets timestamps
3. Persist category via repository

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid category name | Name empty/too long | `InvalidArgumentException` |
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns `void`. Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface CategoryRepository {
  save(category: Category): Promise<void>;
}
```

## Example Usage

```typescript
const createCategory = new CreateCategory(categoryRepository);

await createCategory.execute({
  id: "01936c3d-5678-90ab-cdef-1234567890ab",
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  name: "Groceries"
});
```

## Notes

- Users can create multiple categories with the same name
- Categories are user-scoped (each user has their own set of categories)
- No hierarchical structure (flat list of categories)
