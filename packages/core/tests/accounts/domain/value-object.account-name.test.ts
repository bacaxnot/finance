import { describe, test, expect } from "bun:test";
import { AccountName } from "~/accounts/domain/value-object.account-name";

describe("AccountName", () => {
  describe("constructor - valid names", () => {
    test("accepts simple account name", () => {
      const name = new AccountName("Checking Account");
      expect(name.value).toBe("Checking Account");
    });

    test("accepts account name with numbers", () => {
      const name = new AccountName("Account 123");
      expect(name.value).toBe("Account 123");
    });

    test("accepts account name with special characters", () => {
      const name = new AccountName("My Bank - Savings (USD)");
      expect(name.value).toBe("My Bank - Savings (USD)");
    });

    test("accepts account name with unicode characters", () => {
      const name = new AccountName("Cuenta Principal 💰");
      expect(name.value).toBe("Cuenta Principal 💰");
    });

    test("accepts single character name", () => {
      const name = new AccountName("A");
      expect(name.value).toBe("A");
    });

    test("accepts account name at max length (100 chars)", () => {
      const longName = "a".repeat(100);
      const name = new AccountName(longName);
      expect(name.value).toBe(longName);
    });

    test("trims whitespace from name", () => {
      const name = new AccountName("  Checking  ");
      expect(name.value).toBe("Checking");
    });
  });

  describe("constructor - invalid names", () => {
    test("throws error for empty string", () => {
      expect(() => new AccountName("")).toThrow("Account name cannot be empty");
    });

    test("throws error for whitespace-only string", () => {
      expect(() => new AccountName("   ")).toThrow(
        "Account name cannot be empty"
      );
    });

    test("throws error for name exceeding max length", () => {
      const tooLongName = "a".repeat(101);
      expect(() => new AccountName(tooLongName)).toThrow(
        "Account name is too long (max 100 characters)"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same account name value", () => {
      const name1 = new AccountName("Checking");
      const name2 = new AccountName("Checking");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns false for different account name values", () => {
      const name1 = new AccountName("Checking");
      const name2 = new AccountName("Savings");

      expect(name1.equals(name2)).toBe(false);
    });

    test("returns true for case-different names (case-insensitive)", () => {
      const name1 = new AccountName("Checking");
      const name2 = new AccountName("checking");

      expect(name1.equals(name2)).toBe(true);
    });

    test("returns true for names with different whitespace (after trim)", () => {
      const name1 = new AccountName("Checking");
      const name2 = new AccountName("  Checking  ");

      expect(name1.equals(name2)).toBe(true);
    });
  });

  describe("value", () => {
    test("returns the account name value", () => {
      const name = new AccountName("My Account");
      expect(name.value).toBe("My Account");
    });

    test("preserves internal spaces", () => {
      const name = new AccountName("My  Spaced  Account");
      expect(name.value).toBe("My  Spaced  Account");
    });
  });
});
