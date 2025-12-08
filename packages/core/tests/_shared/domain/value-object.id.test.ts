import { describe, test, expect } from "bun:test";
import { Id } from "~/_shared/domain/value-object.id";

describe("Id", () => {
  describe("constructor without value", () => {
    test("creates a valid UUID v7", () => {
      const id = new Id();
      const uuidV7Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuidV7Regex.test(id.value)).toBe(true);
    });

    test("generates unique IDs", () => {
      const id1 = new Id();
      const id2 = new Id();

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("constructor with value", () => {
    test("creates Id from valid UUID string", () => {
      const validV7 = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const id = new Id(validV7);

      expect(id.value).toBe(validV7);
    });

    test("throws error for empty string", () => {
      expect(() => new Id("")).toThrow("Invalid UUID format");
    });

    test("throws error for whitespace-only string", () => {
      expect(() => new Id("   ")).toThrow("Invalid UUID format");
    });

    test("throws error for invalid UUID format", () => {
      expect(() => new Id("not-a-uuid")).toThrow("Invalid UUID format");
    });

    test("throws error for malformed UUID", () => {
      expect(() => new Id("01936d8f-5e27-7b3a-9c4e")).toThrow(
        "Invalid UUID format"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same UUID value", () => {
      const uuid = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const id1 = new Id(uuid);
      const id2 = new Id(uuid);

      expect(id1.equals(id2)).toBe(true);
    });

    test("returns false for different UUID values", () => {
      const id1 = new Id("01936d8f-5e27-7b3a-9c4e-123456789abc");
      const id2 = new Id("01936d8f-5e27-7b3a-9c4e-987654321def");

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("value", () => {
    test("returns the UUID string value", () => {
      const uuid = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const id = new Id(uuid);

      expect(id.value).toBe(uuid);
    });
  });
});
