import { describe, test, expect } from "bun:test";
import { User } from "~/users/domain/aggregate.user";

describe("User", () => {
  describe("create", () => {
    test("creates user with valid names", () => {
      const user = User.create("John", "Doe");

      expect(user.getFullName()).toBe("John Doe");
    });

    test("generates unique user ID", () => {
      const user1 = User.create("John", "Doe");
      const user2 = User.create("Jane", "Smith");

      expect(user1.toPrimitives().id).not.toBe(user2.toPrimitives().id);
    });

    test("accepts international names", () => {
      const user = User.create("María", "José");

      expect(user.getFullName()).toBe("María José");
    });

    test("accepts names with hyphens and apostrophes", () => {
      const user = User.create("Jean-Claude", "O'Brien");

      expect(user.getFullName()).toBe("Jean-Claude O'Brien");
    });

    test("trims whitespace from names", () => {
      const user = User.create("  John  ", "  Doe  ");

      expect(user.getFullName()).toBe("John Doe");
    });

    test("throws error for empty first name", () => {
      expect(() => User.create("", "Doe")).toThrow("Name cannot be empty");
    });

    test("throws error for empty last name", () => {
      expect(() => User.create("John", "")).toThrow("Name cannot be empty");
    });

    test("throws error for invalid first name", () => {
      expect(() => User.create("John123", "Doe")).toThrow(
        "Name contains invalid characters"
      );
    });

    test("throws error for invalid last name", () => {
      expect(() => User.create("John", "Doe@123")).toThrow(
        "Name contains invalid characters"
      );
    });
  });

  describe("getFullName", () => {
    test("returns combined first and last name", () => {
      const user = User.create("John", "Doe");

      expect(user.getFullName()).toBe("John Doe");
    });

    test("returns full name with international characters", () => {
      const user = User.create("María", "José");

      expect(user.getFullName()).toBe("María José");
    });

    test("returns full name with special characters", () => {
      const user = User.create("Jean-Claude", "O'Brien");

      expect(user.getFullName()).toBe("Jean-Claude O'Brien");
    });
  });

  describe("toPrimitives", () => {
    test("returns primitive representation with all fields", () => {
      const user = User.create("John", "Doe");
      const primitives = user.toPrimitives();

      expect(primitives.id).toBeDefined();
      expect(primitives.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(primitives.firstName).toBe("John");
      expect(primitives.lastName).toBe("Doe");
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });

    test("returns trimmed names in primitives", () => {
      const user = User.create("  John  ", "  Doe  ");
      const primitives = user.toPrimitives();

      expect(primitives.firstName).toBe("John");
      expect(primitives.lastName).toBe("Doe");
    });

    test("returns international characters correctly", () => {
      const user = User.create("María", "José");
      const primitives = user.toPrimitives();

      expect(primitives.firstName).toBe("María");
      expect(primitives.lastName).toBe("José");
    });
  });
});
