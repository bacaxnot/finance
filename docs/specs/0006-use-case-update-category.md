# Use Case: Update Category

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to update the name of an existing category.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**:
- User must exist in the system
- Category must exist and belong to the user

**Postconditions**: Category name is updated and persisted

## Signature

```typescript
type UpdateCategory = (
  categoryRepository: CategoryRepository
) => {
  execute(params: {
    userId: string;
    categoryId: string;
    name: string;
  }): Promise<Category>;
};
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| categoryId | string | Yes | Valid UUID, category must exist |
| name | string | Yes | 1-50 characters, non-empty after trim |

## Business Rules

1. **Ownership Verification**
   - Category must belong to the specified user
   - Throws error if category doesn't exist or belongs to another user

2. **Name Validation**
   - Same rules as creation: non-empty, max 50 characters, trimmed
   - Can update to the same name (idempotent)

3. **Update Behavior**
   - Only the name field is updated
   - `updatedAt` timestamp is refreshed
   - All other fields remain unchanged

## Success Flow

1. Receive primitive parameters (userId, categoryId, name)
2. Convert categoryId to CategoryId value object
3. Fetch category from repository using `search(categoryId)`
4. Verify category exists (throw error if null)
5. Verify category belongs to user (compare userId)
6. Update category name using `updateName(name)` method
7. Persist updated category via repository
8. Return updated Category aggregate

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Category not found | categoryId doesn't exist | `CategoryNotFoundException` |
| Unauthorized access | Category doesn't belong to user | `UnauthorizedCategoryAccessException` |
| Invalid category name | Name empty/too long | `InvalidArgumentException` |
| Invalid IDs | userId/categoryId format invalid | Error from value object constructors |

## Return Value

Returns the updated `Category` aggregate with:
- Same `id` (CategoryId)
- Same `userId`
- Updated `name` (CategoryName)
- Same `createdAt` timestamp
- Updated `updatedAt` timestamp

## Repository Requirements

```typescript
interface CategoryRepository {
  search(id: CategoryId): Promise<Category | null>;
  save(category: Category): Promise<void>;
}
```

## Domain Changes Required

The `Category` aggregate needs an update method:

```typescript
class Category {
  updateName(name: string): void {
    this.name = new CategoryName(name);
    this.updatedAt = new Date();
  }
}
```

## Example Usage

```typescript
const updateCategory = UpdateCategory(categoryRepository);

const updatedCategory = await updateCategory.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  categoryId: "01936a2b-1234-7890-abcd-ef1234567890",
  name: "Supermarket Shopping"
});

// updatedCategory.toPrimitives() => { id: "...", name: "Supermarket Shopping", updatedAt: <new time>, ... }
```

## Notes

- Only the name can be updated (other fields are immutable)
- Ownership check prevents users from updating other users' categories
- No cascade effects on transactions (they keep their existing category reference)
