import { describe, test, expect } from "bun:test";
import { CategoryName } from "./value-object.category-name";

describe("CategoryName", () => {
  describe("constructor - valid names", () => {
    test("accepts simple category name", () => {
      const name = new CategoryName("Groceries");
      expect(name.value).toBe("Groceries");
    });

    test("accepts category name with numbers", () => {
      const name = new CategoryName("Category 123");
      expect(name.value).toBe("Category 123");
    });

    test("accepts category name with special characters", () => {
      const name = new CategoryName("Food & Drinks");
      expect(name.value).toBe("Food & Drinks");
    });

    test("accepts category name with unicode characters", () => {
      const name = new CategoryName("Comida 🍕");
      expect(name.value).toBe("Comida 🍕");
    });

    test("accepts single character name", () => {
      const name = new CategoryName("A");
      expect(name.value).toBe("A");
    });

    test("accepts category name at max length (50 chars)", () => {
      const longName = "a".repeat(50);
      const name = new CategoryName(longName);
      expect(name.value).toBe(longName);
    });

    test("trims whitespace from name", () => {
      const name = new CategoryName("  Groceries  ");
      expect(name.value).toBe("Groceries");
    });
  });

  describe("constructor - invalid names", () => {
    test("throws error for empty string", () => {
      expect(() => new CategoryName("")).toThrow(
        "Category name cannot be empty"
      );
    });

    test("throws error for whitespace-only string", () => {
      expect(() => new CategoryName("   ")).toThrow(
        "Category name cannot be empty"
      );
    });

    test("throws error for name exceeding max length", () => {
      const tooLongName = "a".repeat(51);
      expect(() => new CategoryName(tooLongName)).toThrow(
        "Category name is too long (max 50 characters)"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same category name value", () => {
      const name1 = new CategoryName("Groceries");
      const name2 = new CategoryName("Groceries");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns false for different category name values", () => {
      const name1 = new CategoryName("Groceries");
      const name2 = new CategoryName("Entertainment");

      expect(name1.equals(name2)).toBe(false);
    });

    test("returns true for case-different names (case-insensitive)", () => {
      const name1 = new CategoryName("Groceries");
      const name2 = new CategoryName("groceries");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns true for names with different whitespace (after trim)", () => {
      const name1 = new CategoryName("Groceries");
      const name2 = new CategoryName("  Groceries  ");

      expect(name1.equals(name2)).toBe(true);
    });
  });

  describe("value", () => {
    test("returns the category name value", () => {
      const name = new CategoryName("My Category");
      expect(name.value).toBe("My Category");
    });

    test("preserves internal spaces", () => {
      const name = new CategoryName("My  Spaced  Category");
      expect(name.value).toBe("My  Spaced  Category");
    });
  });
});
