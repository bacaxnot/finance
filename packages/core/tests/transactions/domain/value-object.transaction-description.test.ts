import { describe, test, expect } from "bun:test";
import { TransactionDescription } from "~/transactions/domain/value-object.transaction-description";

describe("TransactionDescription", () => {
  describe("constructor - valid descriptions", () => {
    test("accepts simple description", () => {
      const description = new TransactionDescription("Grocery shopping");
      expect(description.value).toBe("Grocery shopping");
    });

    test("accepts description with numbers", () => {
      const description = new TransactionDescription("Invoice #12345");
      expect(description.value).toBe("Invoice #12345");
    });

    test("accepts description with special characters", () => {
      const description = new TransactionDescription(
        "Payment for rent @ $1,000"
      );
      expect(description.value).toBe("Payment for rent @ $1,000");
    });

    test("accepts description with unicode characters", () => {
      const description = new TransactionDescription("Café con leche ☕");
      expect(description.value).toBe("Café con leche ☕");
    });

    test("accepts single character description", () => {
      const description = new TransactionDescription("A");
      expect(description.value).toBe("A");
    });

    test("accepts description at max length (200 chars)", () => {
      const longDescription = "a".repeat(200);
      const description = new TransactionDescription(longDescription);
      expect(description.value).toBe(longDescription);
    });

    test("preserves whitespace in description", () => {
      const description = new TransactionDescription("  Grocery  shopping  ");
      expect(description.value).toBe("  Grocery  shopping  ");
    });
  });

  describe("constructor - invalid descriptions", () => {
    test("throws error for empty string", () => {
      expect(() => new TransactionDescription("")).toThrow(
        "Transaction description cannot be empty"
      );
    });

    test("throws error for whitespace-only string", () => {
      expect(() => new TransactionDescription("   ")).toThrow(
        "Transaction description cannot be empty"
      );
    });

    test("throws error for description exceeding max length", () => {
      const tooLongDescription = "a".repeat(201);
      expect(() => new TransactionDescription(tooLongDescription)).toThrow(
        "Transaction description is too long (max 200 characters)"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same description value", () => {
      const description1 = new TransactionDescription("Grocery shopping");
      const description2 = new TransactionDescription("Grocery shopping");

      expect(description1.equals(description2)).toBe(true);
    });

    test("returns false for different description values", () => {
      const description1 = new TransactionDescription("Grocery shopping");
      const description2 = new TransactionDescription("Gas station");

      expect(description1.equals(description2)).toBe(false);
    });

    test("returns false for case-different descriptions", () => {
      const description1 = new TransactionDescription("Grocery shopping");
      const description2 = new TransactionDescription("grocery shopping");

      expect(description1.equals(description2)).toBe(false);
    });
  });

  describe("value", () => {
    test("returns the description value", () => {
      const description = new TransactionDescription("My transaction");
      expect(description.value).toBe("My transaction");
    });

    test("returns description with preserved spaces", () => {
      const description = new TransactionDescription(
        "My  spaced  transaction"
      );
      expect(description.value).toBe("My  spaced  transaction");
    });
  });
});
