import { describe, test, expect } from "bun:test";
import { TransactionDirection } from "~/transactions/domain/value-object.transaction-direction";

describe("TransactionDirection", () => {
  describe("constructor - valid directions", () => {
    test("accepts inbound direction", () => {
      const direction = new TransactionDirection("inbound");
      expect(direction.value).toBe("inbound");
    });

    test("accepts outbound direction", () => {
      const direction = new TransactionDirection("outbound");
      expect(direction.value).toBe("outbound");
    });
  });

  describe("constructor - invalid directions", () => {
    test("throws error for invalid direction", () => {
      expect(() => new TransactionDirection("invalid" as any)).toThrow(
        'Transaction direction must be either "inbound" or "outbound"'
      );
    });

    test("throws error for empty string", () => {
      expect(() => new TransactionDirection("" as any)).toThrow(
        'Transaction direction must be either "inbound" or "outbound"'
      );
    });

    test("throws error for uppercase direction", () => {
      expect(() => new TransactionDirection("INBOUND" as any)).toThrow(
        'Transaction direction must be either "inbound" or "outbound"'
      );
    });

    test("throws error for income/expense terminology", () => {
      expect(() => new TransactionDirection("income" as any)).toThrow(
        'Transaction direction must be either "inbound" or "outbound"'
      );
    });
  });

  describe("equals", () => {
    test("returns true for same direction", () => {
      const direction1 = new TransactionDirection("inbound");
      const direction2 = new TransactionDirection("inbound");

      expect(direction1.equals(direction2)).toBe(true);
    });

    test("returns false for different directions", () => {
      const direction1 = new TransactionDirection("inbound");
      const direction2 = new TransactionDirection("outbound");

      expect(direction1.equals(direction2)).toBe(false);
    });
  });

  describe("value", () => {
    test("returns inbound direction value", () => {
      const direction = new TransactionDirection("inbound");
      expect(direction.value).toBe("inbound");
    });

    test("returns outbound direction value", () => {
      const direction = new TransactionDirection("outbound");
      expect(direction.value).toBe("outbound");
    });
  });
});
