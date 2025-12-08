# Use Case: List Categories by User

**Version:** 1.0.0
**Date:** 2025-12-08
**Status:** Draft

---

## Overview

Retrieves all categories belonging to a specific user.

## Use Case Details

**Actor**: Authenticated User
**Preconditions**: User must exist in the system
**Postconditions**: None (read-only operation)

## Signature

```typescript
class ListCategoriesByUser {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(params: {
    userId: string;
  }): Promise<Category[]>
}
```

## Input Parameters

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| userId | string | Yes | Valid UUID |

## Business Rules

1. **User Scope**
   - Only returns categories created by the specified user
   - Returns empty array if user has no categories
   - No pagination (returns all categories)

2. **Ordering**
   - Implementation-specific (typically by creation date)

## Success Flow

1. Receive userId as primitive string
2. Convert userId to UserId value object
3. Query repository using `searchByUserId()`
4. Return array of Category aggregates

## Error Scenarios

| Error | When | Exception |
|-------|------|-----------|
| Invalid user ID | userId format invalid | Error from UserId constructor |

## Return Value

Returns an array of `Category` aggregates. Each category contains:
- `id` (CategoryId)
- `userId` (UserId)
- `name` (CategoryName)
- `createdAt` timestamp
- `updatedAt` timestamp

Returns empty array `[]` if user has no categories.

## Repository Requirements

```typescript
interface CategoryRepository {
  searchByUserId(userId: UserId): Promise<Category[]>;
}
```

**Note**: This method needs to be added to the repository interface.

## Example Usage

```typescript
const listCategoriesByUser = new ListCategoriesByUser(categoryRepository);

const categories = await listCategoriesByUser.execute({
  userId: "01234567-89ab-cdef-0123-456789abcdef"
});

// categories => [Category, Category, ...]
// categories.map(c => c.toPrimitives()) => [{ id: "...", name: "Groceries", ... }, ...]
```

## Notes

- No pagination implemented (acceptable for MVP - typical users have < 50 categories)
- Results ordering depends on repository implementation
- Consider adding pagination if category count grows significantly
