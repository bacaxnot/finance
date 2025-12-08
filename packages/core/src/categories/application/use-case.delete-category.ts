import { Category } from "../domain/aggregate.category";
import { CategoryRepository } from "../domain/repository.category";
import { CategoryId } from "../domain/value-object.category-id";
import {
  CategoryNotFoundException,
  UnauthorizedCategoryAccessException,
} from "../domain/exceptions";

export class DeleteCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    userId: string;
    categoryId: string;
  }): Promise<void> {
    const categoryId = new CategoryId(params.categoryId);
    const category = await this.repository.search(categoryId);

    this.ensureCategoryExists(category, params.categoryId);
    this.ensureCategoryBelongsToUser(category, params.userId);

    await this.repository.delete(categoryId);
  }

  private ensureCategoryExists(
    category: Category | null,
    categoryId: string
  ): asserts category is Category {
    if (category) return;
    throw new CategoryNotFoundException(
      `Category with ID ${categoryId} not found`
    );
  }

  private ensureCategoryBelongsToUser(
    category: Category,
    userId: string
  ): void {
    if (category.belongsTo(userId)) return;
    throw new UnauthorizedCategoryAccessException(
      "Category does not belong to user"
    );
  }
}
