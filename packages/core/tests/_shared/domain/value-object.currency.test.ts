import { describe, test, expect } from "bun:test";
import { Currency, ALLOWED_CURRENCIES } from "./value-object.currency";

describe("Currency", () => {
  describe("constructor - valid currencies", () => {
    test("accepts COP currency code", () => {
      const currency = new Currency("COP");
      expect(currency.value).toBe("COP");
    });
  });

  describe("constructor - invalid currencies", () => {
    test("throws error for invalid currency code", () => {
      expect(() => new Currency("USD")).toThrow(
        `Invalid currency code. Allowed currencies: ${ALLOWED_CURRENCIES.join(", ")}`
      );
    });

    test("throws error for lowercase currency code", () => {
      expect(() => new Currency("cop")).toThrow("Invalid currency code");
    });

    test("throws error for empty string", () => {
      expect(() => new Currency("")).toThrow("Invalid currency code");
    });

    test("throws error for random string", () => {
      expect(() => new Currency("INVALID")).toThrow("Invalid currency code");
    });
  });

  describe("equals", () => {
    test("returns true for same currency value", () => {
      const currency1 = new Currency("COP");
      const currency2 = new Currency("COP");

      expect(currency1.equals(currency2)).toBe(true);
    });

    test("returns false for different currency values", () => {
      // This test will need to be updated when we add more currencies
      const currency1 = new Currency("COP");
      const currency2 = new Currency("COP");

      // For now, since we only have COP, this always returns true
      expect(currency1.equals(currency2)).toBe(true);
    });
  });

  describe("value", () => {
    test("returns the currency code", () => {
      const currency = new Currency("COP");
      expect(currency.value).toBe("COP");
    });
  });
});
