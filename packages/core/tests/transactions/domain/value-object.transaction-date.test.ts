import { describe, test, expect } from "bun:test";
import { TransactionDate } from "~/transactions/domain/value-object.transaction-date";

describe("TransactionDate", () => {
  describe("constructor - valid dates", () => {
    test("accepts current date", () => {
      const now = new Date();
      const transactionDate = new TransactionDate(now);
      expect(transactionDate.value).toEqual(now);
    });

    test("accepts past date", () => {
      const pastDate = new Date("2024-01-01");
      const transactionDate = new TransactionDate(pastDate);
      expect(transactionDate.value).toEqual(pastDate);
    });

    test("accepts date one year ago", () => {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      const transactionDate = new TransactionDate(yearAgo);
      expect(transactionDate.value).toEqual(yearAgo);
    });

    test("accepts date exactly now", () => {
      const now = new Date();
      const transactionDate = new TransactionDate(now);

      // Allow for small timing differences (less than 1 second)
      const diff = Math.abs(transactionDate.value.getTime() - now.getTime());
      expect(diff).toBeLessThan(1000);
    });
  });

  describe("constructor - invalid dates", () => {
    test("throws error for future date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(() => new TransactionDate(futureDate)).toThrow(
        "Transaction date cannot be in the future"
      );
    });

    test("throws error for date one year in future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      expect(() => new TransactionDate(futureDate)).toThrow(
        "Transaction date cannot be in the future"
      );
    });

    test("throws error for date tomorrow", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(() => new TransactionDate(tomorrow)).toThrow(
        "Transaction date cannot be in the future"
      );
    });
  });

  describe("equals", () => {
    test("returns true for same date value", () => {
      const date = new Date("2024-01-01T10:00:00Z");
      const transactionDate1 = new TransactionDate(date);
      const transactionDate2 = new TransactionDate(new Date(date));

      expect(transactionDate1.equals(transactionDate2)).toBe(true);
    });

    test("returns false for different date values", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");
      const transactionDate1 = new TransactionDate(date1);
      const transactionDate2 = new TransactionDate(date2);

      expect(transactionDate1.equals(transactionDate2)).toBe(false);
    });

    test("returns false for same date but different time", () => {
      const date1 = new Date("2024-01-01T10:00:00Z");
      const date2 = new Date("2024-01-01T11:00:00Z");
      const transactionDate1 = new TransactionDate(date1);
      const transactionDate2 = new TransactionDate(date2);

      expect(transactionDate1.equals(transactionDate2)).toBe(false);
    });
  });

  describe("value", () => {
    test("returns the date value", () => {
      const date = new Date("2024-01-01");
      const transactionDate = new TransactionDate(date);
      expect(transactionDate.value).toEqual(date);
    });

    test("returns date with time preserved", () => {
      const date = new Date("2024-01-01T10:30:45Z");
      const transactionDate = new TransactionDate(date);
      expect(transactionDate.value.toISOString()).toBe(date.toISOString());
    });
  });
});
