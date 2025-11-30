import { describe, test, expect } from "bun:test";
import { UserId } from "./value-object.user-id";

describe("UserId", () => {
  describe("generate", () => {
    test("creates a valid UUID v7", () => {
      const userId = UserId.generate();
      const uuidV7Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuidV7Regex.test(userId.toString())).toBe(true);
    });

    test("generates unique IDs", () => {
      const id1 = UserId.generate();
      const id2 = UserId.generate();

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("from", () => {
    test("creates UserId from valid UUID v7 string", () => {
      const validV7 = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const userId = UserId.from(validV7);

      expect(userId.toString()).toBe(validV7);
    });

    test("throws error for empty string", () => {
      expect(() => UserId.from("")).toThrow("User ID cannot be empty");
    });

    test("throws error for whitespace-only string", () => {
      expect(() => UserId.from("   ")).toThrow("User ID cannot be empty");
    });

    test("throws error for invalid UUID format", () => {
      expect(() => UserId.from("not-a-uuid")).toThrow(
        "User ID must be a valid UUID v7"
      );
    });

    test("throws error for UUID v4", () => {
      const v4Uuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(() => UserId.from(v4Uuid)).toThrow(
        "User ID must be a valid UUID v7"
      );
    });

    test("throws error for malformed UUID", () => {
      expect(() => UserId.from("01936d8f-5e27-7b3a-9c4e")).toThrow(
        "User ID must be a valid UUID v7"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same UUID value", () => {
      const uuid = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const id1 = UserId.from(uuid);
      const id2 = UserId.from(uuid);

      expect(id1.equals(id2)).toBe(true);
    });

    test("returns false for different UUID values", () => {
      const id1 = UserId.from("01936d8f-5e27-7b3a-9c4e-123456789abc");
      const id2 = UserId.from("01936d8f-5e27-7b3a-9c4e-987654321def");

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("returns the UUID string value", () => {
      const uuid = "01936d8f-5e27-7b3a-9c4e-123456789abc";
      const userId = UserId.from(uuid);

      expect(userId.toString()).toBe(uuid);
    });
  });
});
