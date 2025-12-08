# Use Case: Delete Category

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Allows a user to delete an existing category. Transactions associated with the deleted category will have their category reference set to null.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**:
- User must exist in the system
- Category must exist and belong to the user

**Postconditions**:
- Category is deleted from the system
- All transactions referencing this category have their category set to null (database CASCADE SET NULL)

## Signature

```typescript
type DeleteCategory = (
  categoryRepository: CategoryRepository
) => {
  execute(params: {
    userId: string;
    categoryId: string;
  }): Promise<void>;
};
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID, user must exist |
| categoryId | string | Yes | Valid UUID, category must exist |

## Business Rules

1. **Ownership Verification**
   - Category must belong to the specified user
   - Throws error if category doesn't exist or belongs to another user

2. **Deletion Behavior**
   - Category is permanently deleted
   - No soft-delete mechanism
   - Database handles cascade behavior for related transactions

3. **Transaction Impact**
   - Transactions using this category will have `categoryId` set to NULL
   - Handled automatically by database foreign key constraint (ON DELETE SET NULL)
   - No validation needed at application level

## Success Flow

1. Receive primitive parameters (userId, categoryId)
2. Convert categoryId to CategoryId value object
3. Fetch category from repository using `search(categoryId)`
4. Verify category exists (throw error if null)
5. Verify category belongs to user (compare userId)
6. Delete category via repository `delete(categoryId)`
7. Return void (no return value)

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Category not found | categoryId doesn't exist | `CategoryNotFoundException` |
| Unauthorized access | Category doesn't belong to user | `UnauthorizedCategoryAccessException` |
| Invalid IDs | userId/categoryId format invalid | Error from value object constructors |

## Return Value

Returns `void` (no value). Success is indicated by no exception being thrown.

## Repository Requirements

```typescript
interface CategoryRepository {
  search(id: CategoryId): Promise<Category | null>;
  delete(id: CategoryId): Promise<void>;
}
```

**Note**: The `delete` method needs to be added to the repository interface.

## Example Usage

```typescript
const deleteCategory = DeleteCategory(categoryRepository);

await deleteCategory.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef",
  categoryId: "01936a2b-1234-7890-abcd-ef1234567890"
});

// Category is deleted
// All transactions with this categoryId now have categoryId = null
```

## Notes

- Hard delete (not soft delete)
- Database foreign key constraint handles transaction updates (CASCADE SET NULL)
- Users cannot delete categories belonging to other users
- Consider adding a confirmation step in the UI before deletion
- Once deleted, the category cannot be recovered
