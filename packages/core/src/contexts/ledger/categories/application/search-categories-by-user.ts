import { UserId } from "../../users/domain/user-id";
import type { CategoryPrimitives } from "../domain/category";
import type { CategoryRepository } from "../domain/category-repository";

export class SearchCategoriesByUser {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: { userId: string }): Promise<CategoryPrimitives[]> {
    const userId = new UserId(params.userId);
    const categories = await this.repository.searchByUserId(userId);
    return categories.map((category) => category.toPrimitives());
  }
}
