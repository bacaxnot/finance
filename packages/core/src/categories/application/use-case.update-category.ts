import { Category } from "../domain/aggregate.category";
import { CategoryRepository } from "../domain/repository.category";
import { CategoryId } from "../domain/value-object.category-id";
import { CategoryDoesNotExistError } from "../domain/error.category-does-not-exist";

export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    userId: string;
    categoryId: string;
    name: string;
  }): Promise<void> {
    const categoryId = new CategoryId(params.categoryId);
    const category = await this.repository.search(categoryId);

    this.ensureCategoryExists(category, params.categoryId);
    this.ensureCategoryBelongsToUser(category, params.userId);

    category.update(params.name);

    await this.repository.save(category);
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
