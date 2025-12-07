import { Category } from "./aggregate.category";
import { CategoryId } from "./value-object.category-id";

export interface CategoryRepository {
  save(category: Category): Promise<void>;
  search(id: CategoryId): Promise<Category | null>;
}
