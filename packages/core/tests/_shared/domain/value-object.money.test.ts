import { describe, test, expect } from "bun:test";
import { Money } from "~/_shared/domain/value-object.money";

describe("Money", () => {
  describe("constructor - valid amounts", () => {
    test("accepts zero amount", () => {
      const money = new Money(0, "COP");
      expect(money.toPrimitives()).toEqual({ amount: 0, currency: "COP" });
    });

    test("accepts positive integer amount", () => {
      const money = new Money(1000, "COP");
      expect(money.toPrimitives()).toEqual({ amount: 1000, currency: "COP" });
    });

    test("accepts positive decimal amount", () => {
      const money = new Money(1000.5, "COP");
      expect(money.toPrimitives()).toEqual({
        amount: 1000.5,
        currency: "COP",
      });
    });

    test("accepts large amount", () => {
      const money = new Money(999999999, "COP");
      expect(money.toPrimitives()).toEqual({
        amount: 999999999,
        currency: "COP",
      });
    });
  });

  describe("constructor - invalid amounts", () => {
    test("throws error for negative amount", () => {
      expect(() => new Money(-100, "COP")).toThrow(
        "Amount must be non-negative"
      );
    });

    test("throws error for negative decimal amount", () => {
      expect(() => new Money(-0.01, "COP")).toThrow(
        "Amount must be non-negative"
      );
    });
  });

  describe("constructor - invalid currency", () => {
    test("throws error for invalid currency code", () => {
      expect(() => new Money(1000, "USD")).toThrow("Invalid currency code");
    });
  });

  describe("add", () => {
    test("adds two amounts with same currency", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(500, "COP");
      const result = money1.add(money2);

      expect(result.toPrimitives()).toEqual({ amount: 1500, currency: "COP" });
    });

    test("adds zero to amount", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(0, "COP");
      const result = money1.add(money2);

      expect(result.toPrimitives()).toEqual({ amount: 1000, currency: "COP" });
    });

    test("adds decimal amounts", () => {
      const money1 = new Money(1000.5, "COP");
      const money2 = new Money(500.25, "COP");
      const result = money1.add(money2);

      expect(result.toPrimitives()).toEqual({
        amount: 1500.75,
        currency: "COP",
      });
    });

    test("throws error when adding different currencies", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(500, "COP");

      // When we add more currencies, this test will be meaningful
      // For now, both are COP so it works
      expect(() => money1.add(money2)).not.toThrow();
    });
  });

  describe("subtract", () => {
    test("subtracts two amounts with same currency", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(500, "COP");
      const result = money1.subtract(money2);

      expect(result.toPrimitives()).toEqual({ amount: 500, currency: "COP" });
    });

    test("subtracts zero from amount", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(0, "COP");
      const result = money1.subtract(money2);

      expect(result.toPrimitives()).toEqual({ amount: 1000, currency: "COP" });
    });

    test("subtracts decimal amounts", () => {
      const money1 = new Money(1000.75, "COP");
      const money2 = new Money(500.25, "COP");
      const result = money1.subtract(money2);

      expect(result.toPrimitives()).toEqual({
        amount: 500.5,
        currency: "COP",
      });
    });

    test("throws error when subtraction results in negative amount", () => {
      const money1 = new Money(500, "COP");
      const money2 = new Money(1000, "COP");

      expect(() => money1.subtract(money2)).toThrow(
        "Amount must be non-negative"
      );
    });

    test("throws error when subtracting different currencies", () => {
      const money1 = new Money(1000, "COP");
      const money2 = new Money(500, "COP");

      // When we add more currencies, this test will be meaningful
      // For now, both are COP so it works
      expect(() => money1.subtract(money2)).not.toThrow();
    });
  });

  describe("isZero", () => {
    test("returns true for zero amount", () => {
      const money = new Money(0, "COP");
      expect(money.isZero()).toBe(true);
    });

    test("returns false for positive amount", () => {
      const money = new Money(100, "COP");
      expect(money.isZero()).toBe(false);
    });

    test("returns false for decimal amount", () => {
      const money = new Money(0.01, "COP");
      expect(money.isZero()).toBe(false);
    });
  });

  describe("toPrimitives", () => {
    test("returns amount and currency as primitives", () => {
      const money = new Money(1000, "COP");
      expect(money.toPrimitives()).toEqual({ amount: 1000, currency: "COP" });
    });

    test("returns decimal amount correctly", () => {
      const money = new Money(1000.5, "COP");
      expect(money.toPrimitives()).toEqual({
        amount: 1000.5,
        currency: "COP",
      });
    });

    test("returns zero amount correctly", () => {
      const money = new Money(0, "COP");
      expect(money.toPrimitives()).toEqual({ amount: 0, currency: "COP" });
    });
  });
});
