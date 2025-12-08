import { describe, test, expect } from "bun:test";
import { PersonName } from "~/users/domain/value-object.person-name";

describe("PersonName", () => {
  describe("constructor - valid names", () => {
    test("accepts simple name", () => {
      const name = new PersonName("John");
      expect(name.value).toBe("John");
    });

    test("accepts name with spaces", () => {
      const name = new PersonName("María José");
      expect(name.value).toBe("María José");
    });

    test("accepts name with hyphens", () => {
      const name = new PersonName("Jean-Claude");
      expect(name.value).toBe("Jean-Claude");
    });

    test("accepts name with apostrophes", () => {
      const name = new PersonName("O'Brien");
      expect(name.value).toBe("O'Brien");
    });

    test("accepts name with accents", () => {
      const name = new PersonName("José");
      expect(name.value).toBe("José");
    });

    test("accepts complex international name", () => {
      const name = new PersonName("María-José D'Angelo");
      expect(name.value).toBe("María-José D'Angelo");
    });

    test("trims whitespace from name", () => {
      const name = new PersonName("  John  ");
      expect(name.value).toBe("John");
    });

    test("accepts name at max length (100 chars)", () => {
      const longName = "a".repeat(100);
      const name = new PersonName(longName);
      expect(name.value).toBe(longName);
    });
  });

  describe("constructor - invalid names", () => {
    test("throws error for empty string", () => {
      expect(() => new PersonName("")).toThrow("Name cannot be empty");
    });

    test("throws error for whitespace-only string", () => {
      expect(() => new PersonName("   ")).toThrow("Name cannot be empty");
    });

    test("throws error for name with numbers", () => {
      expect(() => new PersonName("John123")).toThrow(
        "Name contains invalid characters"
      );
    });

    test("throws error for name with special characters", () => {
      expect(() => new PersonName("John@Doe")).toThrow(
        "Name contains invalid characters"
      );
    });

    test("throws error for name with underscore", () => {
      expect(() => new PersonName("John_Doe")).toThrow(
        "Name contains invalid characters"
      );
    });

    test("throws error for name with period", () => {
      expect(() => new PersonName("John.Doe")).toThrow(
        "Name contains invalid characters"
      );
    });

    test("throws error for name exceeding max length", () => {
      const tooLongName = "a".repeat(101);
      expect(() => new PersonName(tooLongName)).toThrow(
        "Name is too long (max 100 characters)"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same name value", () => {
      const name1 = new PersonName("John");
      const name2 = new PersonName("John");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns true for same name with trimmed whitespace", () => {
      const name1 = new PersonName("John");
      const name2 = new PersonName("  John  ");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns false for different name values", () => {
      const name1 = new PersonName("John");
      const name2 = new PersonName("Jane");

      expect(name1.equals(name2)).toBe(false);
    });

    test("returns false for case-different names", () => {
      const name1 = new PersonName("John");
      const name2 = new PersonName("john");

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe("value", () => {
    test("returns the trimmed name value", () => {
      const name = new PersonName("  María  ");
      expect(name.value).toBe("María");
    });

    test("returns name with preserved internal spaces", () => {
      const name = new PersonName("María José");
      expect(name.value).toBe("María José");
    });
  });
});
