import { Category } from "./aggregate.category";

export interface CategoryRepository {
  save(category: Category): Promise<void>;
  search(id: string): Promise<Category | null>;
}
