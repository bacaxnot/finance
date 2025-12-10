import { UserId } from "~/users/domain/value-object.user-id";
import { Category } from "../domain/aggregate.category";
import { CategoryRepository } from "../domain/repository.category";

export class ListCategoriesByUser {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: { userId: string }): Promise<Category[]> {
    const userId = new UserId(params.userId);
    return await this.repository.searchByUserId(userId);
  }
}
