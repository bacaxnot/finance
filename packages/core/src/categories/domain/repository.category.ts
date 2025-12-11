import type { UserId } from "~/users/domain/value-object.user-id";
import type { Category } from "./aggregate.category";
import type { CategoryId } from "./value-object.category-id";

export abstract class CategoryRepository {
	abstract save(category: Category): Promise<void>;
	abstract search(id: CategoryId): Promise<Category | null>;
	abstract searchByUserId(userId: UserId): Promise<Category[]>;
	abstract delete(id: CategoryId): Promise<void>;
}
