import { UserId } from "~/users/domain/user-id";
import type { Category } from "../domain/category";
import type { CategoryRepository } from "../domain/category-repository";

export class SearchCategoriesByUser {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: { userId: string }): Promise<Category[]> {
    const userId = new UserId(params.userId);
    return await this.repository.searchByUserId(userId);
  }
}
