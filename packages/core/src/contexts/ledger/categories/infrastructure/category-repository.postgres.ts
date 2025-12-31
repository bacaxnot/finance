import { eq } from "@repo/db/orm";
import { categories } from "@repo/db/schema";
import { dateToPrimitive } from "../../../shared/domain/primitives";
import { DrizzlePostgresRepository } from "../../../shared/infrastructure/drizzle-postgres-repository";
import type { UserId } from "../../users/domain/user-id";
import { Category } from "../domain/category";
import type { CategoryId } from "../domain/category-id";
import type { CategoryRepository } from "../domain/category-repository";

export class CategoryRepositoryPostgres
  extends DrizzlePostgresRepository<Category>
  implements CategoryRepository
{
  async save(category: Category): Promise<void> {
    const primitives = category.toPrimitives();

    await this.db
      .insert(categories)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        name: primitives.name,
        createdAt: new Date(primitives.createdAt),
        updatedAt: new Date(primitives.updatedAt),
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          name: primitives.name,
          updatedAt: new Date(primitives.updatedAt),
        },
      });
  }

  async search(id: CategoryId): Promise<Category | null> {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toAggregate(result[0]);
  }

  async searchByUserId(userId: UserId): Promise<Category[]> {
    const results = await this.db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId.value));

    return results.map((row) => this.toAggregate(row));
  }

  async delete(id: CategoryId): Promise<void> {
    await this.db.delete(categories).where(eq(categories.id, id.value));
  }

  protected toAggregate(row: typeof categories.$inferSelect): Category {
    return Category.fromPrimitives({
      id: row.id,
      userId: row.userId,
      name: row.name,
      createdAt: dateToPrimitive(row.createdAt),
      updatedAt: dateToPrimitive(row.updatedAt),
    });
  }
}
