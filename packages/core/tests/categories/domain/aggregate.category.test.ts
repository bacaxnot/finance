import { describe, test, expect } from "bun:test";
import { Category } from "./aggregate.category";

describe("Category", () => {
  const validUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";

  describe("create", () => {
    test("creates category with valid parameters", () => {
      const category = Category.create(validUserId, "Groceries");
      const primitives = category.toPrimitives();

      expect(primitives.userId).toBe(validUserId);
      expect(primitives.name).toBe("Groceries");
    });

    test("generates unique category ID", () => {
      const category1 = Category.create(validUserId, "Groceries");
      const category2 = Category.create(validUserId, "Entertainment");

      expect(category1.toPrimitives().id).not.toBe(
        category2.toPrimitives().id
      );
    });


    test("throws error for invalid user ID", () => {
      expect(() => Category.create("invalid-uuid", "Groceries")).toThrow(
        "Invalid UUID format"
      );
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
      const category = Category.create(validUserId, "Groceries");
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
