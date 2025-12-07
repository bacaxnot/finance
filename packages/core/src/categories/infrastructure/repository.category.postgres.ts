import { db } from "@repo/db";
import { categories } from "@repo/db/schema";
import { Category } from "../domain/aggregate.category";
import { eq } from "@repo/db/orm";
import { CategoryRepository } from "../domain/repository.category";

export class CategoryRepositoryPostgres implements CategoryRepository {
  async save(category: Category): Promise<void> {
    const primitives = category.toPrimitives();

    await db
      .insert(categories)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        name: primitives.name,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          name: primitives.name,
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async search(id: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    return Category.fromPrimitives({
      id: row.id,
      userId: row.userId,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
