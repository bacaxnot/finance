import { describe, test, expect, afterEach } from "bun:test";
import { eq } from "@repo/db/orm";
import { db } from "@repo/db";
import { categories, users } from "@repo/db/schema";
import { Category } from "../domain/aggregate.category";
import { CategoryRepositoryPostgres } from "./repository.category.postgres";

const skipIntegration = !process.env.RUN_INTEGRATION_TESTS;

describe.skipIf(skipIntegration)(
  "CategoryRepositoryPostgres - Integration",
  () => {
    const repository = new CategoryRepositoryPostgres();
    const createdCategoryIds: string[] = [];
    const testUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";

    afterEach(async () => {
      for (const id of createdCategoryIds) {
        await db.delete(categories).where(eq(categories.id, id));
      }
      createdCategoryIds.length = 0;
    });

    test("save creates a new category in the database", async () => {
      // Ensure test user exists
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const category = Category.create(testUserId, "Groceries");
      const primitives = category.toPrimitives();
      createdCategoryIds.push(primitives.id);

      await repository.save(category);

      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(primitives.id);
      expect(result[0].userId).toBe(testUserId);
      expect(result[0].name).toBe("Groceries");
    });

    test("save updates an existing category in the database", async () => {
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const category = Category.create(testUserId, "Entertainment");
      const primitives = category.toPrimitives();
      createdCategoryIds.push(primitives.id);

      await repository.save(category);

      const updatedCategory = Category.fromPrimitives({
        ...primitives,
        name: "Entertainment & Fun",
        updatedAt: new Date(),
      });

      await repository.save(updatedCategory);

      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Entertainment & Fun");
    });

    test("search returns a category by id", async () => {
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const category = Category.create(testUserId, "Transportation");
      const primitives = category.toPrimitives();
      createdCategoryIds.push(primitives.id);

      await repository.save(category);

      const foundCategory = await repository.search(primitives.id);

      expect(foundCategory).not.toBeNull();
      const foundPrimitives = foundCategory!.toPrimitives();

      expect(foundPrimitives.id).toBe(primitives.id);
      expect(foundPrimitives.userId).toBe(testUserId);
      expect(foundPrimitives.name).toBe("Transportation");
    });

    test("search returns null when category is not found", async () => {
      const nonExistentId = "00000000-0000-7000-8000-000000000000";

      const result = await repository.search(nonExistentId);

      expect(result).toBeNull();
    });
  }
);
