import { Category } from "../domain/aggregate.category";
import { CategoryRepository } from "../domain/repository.category";
import { CategoryId } from "../domain/value-object.category-id";
import { CategoryDoesNotExistError } from "../domain/error.category-does-not-exist";

export class DeleteCategoryUseCase {
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
    throw new CategoryDoesNotExistError(categoryId);
  }

  private ensureCategoryBelongsToUser(
    category: Category,
    userId: string
  ): void {
    if (category.belongsTo(userId)) return;
    // TODO: Authorization pattern to be defined
    throw new Error("Category does not belong to user");
  }
}
