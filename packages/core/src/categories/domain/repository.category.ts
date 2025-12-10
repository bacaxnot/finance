import { UserId } from "~/users/domain/value-object.user-id";
import { Category } from "./aggregate.category";
import { CategoryId } from "./value-object.category-id";

export interface CategoryRepository {
  save(category: Category): Promise<void>;
  search(id: CategoryId): Promise<Category | null>;
  searchByUserId(userId: UserId): Promise<Category[]>;
  delete(id: CategoryId): Promise<void>;
}
