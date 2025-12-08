import { describe, test, expect } from "bun:test";
import { Category } from "~/categories/domain/aggregate.category";
import { v7 as uuidv7 } from "uuid";

describe("Category", () => {
  const validUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";

  describe("create", () => {
    test("creates category with valid parameters", () => {
      const categoryId = uuidv7();
      const category = Category.create({
        id: categoryId,
        userId: validUserId,
        name: "Groceries",
      });
      const primitives = category.toPrimitives();

      expect(primitives.id).toBe(categoryId);
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.name).toBe("Groceries");
    });

    test("generates unique category ID", () => {
      const id1 = uuidv7();
      const id2 = uuidv7();

      const category1 = Category.create({
        id: id1,
        userId: validUserId,
        name: "Groceries",
      });
      const category2 = Category.create({
        id: id2,
        userId: validUserId,
        name: "Entertainment",
      });

      expect(category1.toPrimitives().id).not.toBe(
        category2.toPrimitives().id
      );
    });


    test("throws error for invalid user ID", () => {
      expect(() =>
        Category.create({
          id: uuidv7(),
          userId: "invalid-uuid",
          name: "Groceries",
        })
      ).toThrow("Invalid UUID format");
    });

  });

  describe("fromPrimitives", () => {
    test("creates category from valid primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "Groceries",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      const category = Category.fromPrimitives(primitives);
      const result = category.toPrimitives();

      expect(result.id).toBe(primitives.id);
      expect(result.userId).toBe(primitives.userId);
      expect(result.name).toBe(primitives.name);
      expect(result.createdAt).toEqual(primitives.createdAt);
      expect(result.updatedAt).toEqual(primitives.updatedAt);
    });

    test("throws error for invalid category ID in primitives", () => {
      const primitives = {
        id: "invalid-uuid",
        userId: validUserId,
        name: "Groceries",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Category.fromPrimitives(primitives)).toThrow(
        "Invalid UUID format"
      );
    });

    test("throws error for invalid user ID in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: "invalid-uuid",
        name: "Groceries",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Category.fromPrimitives(primitives)).toThrow(
        "Invalid UUID format"
      );
    });

    test("throws error for empty name in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Category.fromPrimitives(primitives)).toThrow(
        "Category name cannot be empty"
      );
    });
  });

  describe("toPrimitives", () => {
    test("returns primitive representation with all fields", () => {
      const category = Category.create({
        id: uuidv7(),
        userId: validUserId,
        name: "Groceries",
      });
      const primitives = category.toPrimitives();

      expect(primitives.id).toBeDefined();
      expect(primitives.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.name).toBe("Groceries");
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });
});
