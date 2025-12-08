import { describe, test, expect } from "bun:test";
import { Account } from "~/accounts/domain/aggregate.account";
import { v7 as uuidv7 } from "uuid";

describe("Account", () => {
  const validUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";

  describe("create", () => {
    test("creates account with valid parameters", () => {
      const accountId = uuidv7();
      const account = Account.create({
        id: accountId,
        userId: validUserId,
        name: "Checking Account",
        initialBalance: { amount: 1000, currency: "COP" },
      });
      const primitives = account.toPrimitives();

      expect(primitives.id).toBe(accountId);
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.name).toBe("Checking Account");
      expect(primitives.initialBalance).toEqual({
        amount: 1000,
        currency: "COP",
      });
      expect(primitives.currentBalance).toEqual({
        amount: 1000,
        currency: "COP",
      });
    });

    test("generates unique account ID", () => {
      const id1 = uuidv7();
      const id2 = uuidv7();

      const account1 = Account.create({
        id: id1,
        userId: validUserId,
        name: "Checking",
        initialBalance: { amount: 1000, currency: "COP" },
      });
      const account2 = Account.create({
        id: id2,
        userId: validUserId,
        name: "Savings",
        initialBalance: { amount: 2000, currency: "COP" },
      });

      expect(account1.toPrimitives().id).not.toBe(account2.toPrimitives().id);
    });

    test("accepts zero initial balance", () => {
      const account = Account.create({
        id: uuidv7(),
        userId: validUserId,
        name: "New Account",
        initialBalance: { amount: 0, currency: "COP" },
      });
      const primitives = account.toPrimitives();

      expect(primitives.initialBalance).toEqual({ amount: 0, currency: "COP" });
      expect(primitives.currentBalance).toEqual({ amount: 0, currency: "COP" });
    });

    test("accepts decimal initial balance", () => {
      const account = Account.create({
        id: uuidv7(),
        userId: validUserId,
        name: "Savings",
        initialBalance: { amount: 1000.5, currency: "COP" },
      });
      const primitives = account.toPrimitives();

      expect(primitives.initialBalance.amount).toBe(1000.5);
    });


    test("throws error for negative initial balance", () => {
      expect(() =>
        Account.create({
          id: uuidv7(),
          userId: validUserId,
          name: "Checking",
          initialBalance: { amount: -100, currency: "COP" },
        })
      ).toThrow("Amount must be non-negative");
    });

    test("throws error for invalid currency", () => {
      expect(() =>
        Account.create({
          id: uuidv7(),
          userId: validUserId,
          name: "Checking",
          initialBalance: { amount: 1000, currency: "USD" },
        })
      ).toThrow("Invalid currency code");
    });

    test("throws error for invalid user ID", () => {
      expect(() =>
        Account.create({
          id: uuidv7(),
          userId: "invalid-uuid",
          name: "Checking",
          initialBalance: { amount: 1000, currency: "COP" },
        })
      ).toThrow("Invalid UUID format");
    });

  });

  describe("fromPrimitives", () => {
    test("creates account from valid primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "Checking Account",
        initialBalance: { amount: 1000, currency: "COP" },
        currentBalance: { amount: 1500, currency: "COP" },
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      const account = Account.fromPrimitives(primitives);
      const result = account.toPrimitives();

      expect(result.id).toBe(primitives.id);
      expect(result.userId).toBe(primitives.userId);
      expect(result.name).toBe(primitives.name);
      expect(result.initialBalance).toEqual(primitives.initialBalance);
      expect(result.currentBalance).toEqual(primitives.currentBalance);
      expect(result.createdAt).toEqual(primitives.createdAt);
      expect(result.updatedAt).toEqual(primitives.updatedAt);
    });

    test("creates account with different initial and current balance", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "Savings",
        initialBalance: { amount: 1000, currency: "COP" },
        currentBalance: { amount: 2000, currency: "COP" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const account = Account.fromPrimitives(primitives);
      const result = account.toPrimitives();

      expect(result.initialBalance.amount).toBe(1000);
      expect(result.currentBalance.amount).toBe(2000);
    });

    test("throws error for invalid account ID in primitives", () => {
      const primitives = {
        id: "invalid-uuid",
        userId: validUserId,
        name: "Checking",
        initialBalance: { amount: 1000, currency: "COP" },
        currentBalance: { amount: 1000, currency: "COP" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Account.fromPrimitives(primitives)).toThrow(
        "Invalid UUID format"
      );
    });

    test("throws error for invalid user ID in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: "invalid-uuid",
        name: "Checking",
        initialBalance: { amount: 1000, currency: "COP" },
        currentBalance: { amount: 1000, currency: "COP" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Account.fromPrimitives(primitives)).toThrow(
        "Invalid UUID format"
      );
    });

    test("throws error for empty name in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "",
        initialBalance: { amount: 1000, currency: "COP" },
        currentBalance: { amount: 1000, currency: "COP" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Account.fromPrimitives(primitives)).toThrow(
        "Account name cannot be empty"
      );
    });

    test("throws error for negative balance in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        name: "Checking",
        initialBalance: { amount: -100, currency: "COP" },
        currentBalance: { amount: -100, currency: "COP" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => Account.fromPrimitives(primitives)).toThrow(
        "Amount must be non-negative"
      );
    });
  });

  describe("toPrimitives", () => {
    test("returns primitive representation with all fields", () => {
      const account = Account.create({
        id: uuidv7(),
        userId: validUserId,
        name: "Checking",
        initialBalance: { amount: 1000, currency: "COP" },
      });
      const primitives = account.toPrimitives();

      expect(primitives.id).toBeDefined();
      expect(primitives.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.name).toBe("Checking");
      expect(primitives.initialBalance).toEqual({
        amount: 1000,
        currency: "COP",
      });
      expect(primitives.currentBalance).toEqual({
        amount: 1000,
        currency: "COP",
      });
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });

    test("returns correct balance primitives", () => {
      const account = Account.create({
        id: uuidv7(),
        userId: validUserId,
        name: "Savings",
        initialBalance: { amount: 5000.75, currency: "COP" },
      });
      const primitives = account.toPrimitives();

      expect(primitives.initialBalance).toEqual({
        amount: 5000.75,
        currency: "COP",
      });
      expect(primitives.currentBalance).toEqual({
        amount: 5000.75,
        currency: "COP",
      });
    });
  });
});
