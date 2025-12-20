import type { UserId } from "../../users/domain/user-id";
import type { Category } from "./category";
import type { CategoryId } from "./category-id";

export abstract class CategoryRepository {
  abstract save(category: Category): Promise<void>;
  abstract search(id: CategoryId): Promise<Category | null>;
  abstract searchByUserId(userId: UserId): Promise<Category[]>;
  abstract delete(id: CategoryId): Promise<void>;
}
