import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { CategoryPrimitives } from "../domain/category";
import { CategoryRepository } from "../domain/category-repository";

@InferDependencies()
export class SearchCategoriesByUser {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: { userId: string }): Promise<CategoryPrimitives[]> {
    const userId = new UserId(params.userId);
    const categories = await this.repository.searchByUserId(userId);
    return categories.map((category) => category.toPrimitives());
  }
}
