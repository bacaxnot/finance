import { Category } from "../domain/category";
import { CategoryRepository } from "../domain/category-repository";

export class CreateCategory {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(params: {
    id: string;
    userId: string;
    name: string;
  }): Promise<void> {
    const category = Category.create({
      id: params.id,
      userId: params.userId,
      name: params.name,
    });

    await this.repository.save(category);
  }
}
