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
type CreateCategory = (
  categoryRepository: CategoryRepository
) => {
  execute(params: {
    userId: string;
    name: string;
  }): Promise<Category>;
};
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| name | string | Yes | 1-50 characters, non-empty after trim |

## Business Rules

1. **Category Name Validation**
   - Cannot be empty or whitespace only
   - Maximum 50 characters
   - Trimmed before storage

2. **Category Creation**
   - System generates unique CategoryId (UUID v7)
   - Created and updated timestamps set to current time
   - No duplicate name validation (users can have multiple categories with same name)

## Success Flow

1. Receive primitive parameters (userId, name)
2. Create Category aggregate using `Category.create()` factory method
   - Validates category name
   - Generates CategoryId
   - Sets timestamps
3. Persist category via repository
4. Return created Category aggregate

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid category name | Name empty/too long | `InvalidArgumentException` |
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns the created `Category` aggregate with:
- Generated `id` (CategoryId)
- Provided `userId`, `name`
- `createdAt` and `updatedAt` timestamps

## Repository Requirements

```typescript
interface CategoryRepository {
  save(category: Category): Promise<void>;
}
```

## Example Usage

```typescript
const createCategory = CreateCategory(categoryRepository);

const category = await createCategory.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  name: "Groceries"
});

// category.id.value => "01936a2b-..." (generated)
// category.toPrimitives() => { id: "...", userId: "...", name: "Groceries", ... }
```

## Notes

- Users can create multiple categories with the same name
- Categories are user-scoped (each user has their own set of categories)
- No hierarchical structure (flat list of categories)
