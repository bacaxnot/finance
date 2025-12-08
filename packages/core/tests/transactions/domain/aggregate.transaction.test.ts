import { describe, test, expect } from "bun:test";
import { Transaction } from "~/transactions/domain/aggregate.transaction";
import { v7 as uuidv7 } from "uuid";

describe("Transaction", () => {
  const validUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";
  const validAccountId = "01936d8f-5e27-7b3a-9c4e-123456789abd";
  const validCategoryId = "01936d8f-5e27-7b3a-9c4e-123456789abe";
  const validDate = "2024-01-01T10:00:00Z";

  describe("create", () => {
    test("creates transaction with valid parameters", () => {
      const transactionId = uuidv7();
      const transaction = Transaction.create({
        id: transactionId,
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Salary payment",
        transactionDate: validDate,
        notes: null,
      });
      const primitives = transaction.toPrimitives();

      expect(primitives.id).toBe(transactionId);
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.accountId).toBe(validAccountId);
      expect(primitives.categoryId).toBe(validCategoryId);
      expect(primitives.amount).toEqual({ amount: 1000, currency: "COP" });
      expect(primitives.direction).toBe("inbound");
      expect(primitives.description).toBe("Salary payment");
      expect(primitives.transactionDate).toBe("2024-01-01T10:00:00.000Z");
      expect(primitives.notes).toBeNull();
    });

    test("creates transaction with notes", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Salary payment",
        transactionDate: validDate,
        notes: "Monthly salary",
      });
      const primitives = transaction.toPrimitives();

      expect(primitives.notes).toBe("Monthly salary");
    });

    test("generates unique transaction ID", () => {
      const id1 = uuidv7();
      const id2 = uuidv7();

      const transaction1 = Transaction.create({
        id: id1,
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Salary",
        transactionDate: validDate,
        notes: null,
      });
      const transaction2 = Transaction.create({
        id: id2,
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 500, currency: "COP" },
        direction: "outbound",
        description: "Groceries",
        transactionDate: validDate,
        notes: null,
      });

      expect(transaction1.toPrimitives().id).not.toBe(
        transaction2.toPrimitives().id
      );
    });

    test("creates inbound transaction", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Income",
        transactionDate: validDate,
        notes: null,
      });

      expect(transaction.toPrimitives().direction).toBe("inbound");
    });

    test("creates outbound transaction", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "outbound",
        description: "Expense",
        transactionDate: validDate,
        notes: null,
      });

      expect(transaction.toPrimitives().direction).toBe("outbound");
    });

    test("accepts zero amount", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 0, currency: "COP" },
        direction: "inbound",
        description: "Free item",
        transactionDate: validDate,
        notes: null,
      });

      expect(transaction.toPrimitives().amount.amount).toBe(0);
    });

    test("accepts decimal amount", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000.75, currency: "COP" },
        direction: "inbound",
        description: "Payment",
        transactionDate: validDate,
        notes: null,
      });

      expect(transaction.toPrimitives().amount.amount).toBe(1000.75);
    });

    test("throws error for negative amount", () => {
      expect(() =>
        Transaction.create({
          id: uuidv7(),
          userId: validUserId,
          accountId: validAccountId,
          categoryId: validCategoryId,
          amount: { amount: -100, currency: "COP" },
          direction: "inbound",
          description: "Payment",
          transactionDate: validDate,
          notes: null,
        })
      ).toThrow("Amount must be non-negative");
    });

    test("throws error for invalid currency", () => {
      expect(() =>
        Transaction.create({
          id: uuidv7(),
          userId: validUserId,
          accountId: validAccountId,
          categoryId: validCategoryId,
          amount: { amount: 1000, currency: "USD" },
          direction: "inbound",
          description: "Payment",
          transactionDate: validDate,
          notes: null,
        })
      ).toThrow("Invalid currency code");
    });


    test("throws error for invalid user ID", () => {
      expect(() =>
        Transaction.create({
          id: uuidv7(),
          userId: "invalid-uuid",
          accountId: validAccountId,
          categoryId: validCategoryId,
          amount: { amount: 1000, currency: "COP" },
          direction: "inbound",
          description: "Payment",
          transactionDate: validDate,
          notes: null,
        })
      ).toThrow("Invalid UUID format");
    });

    test("throws error for invalid account ID", () => {
      expect(() =>
        Transaction.create({
          id: uuidv7(),
          userId: validUserId,
          accountId: "invalid-uuid",
          categoryId: validCategoryId,
          amount: { amount: 1000, currency: "COP" },
          direction: "inbound",
          description: "Payment",
          transactionDate: validDate,
          notes: null,
        })
      ).toThrow("Invalid UUID format");
    });

    test("throws error for invalid category ID", () => {
      expect(() =>
        Transaction.create({
          id: uuidv7(),
          userId: validUserId,
          accountId: validAccountId,
          categoryId: "invalid-uuid",
          amount: { amount: 1000, currency: "COP" },
          direction: "inbound",
          description: "Payment",
          transactionDate: validDate,
          notes: null,
        })
      ).toThrow("Invalid UUID format");
    });

  });

  describe("fromPrimitives", () => {
    test("creates transaction from valid primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound" as const,
        description: "Salary payment",
        transactionDate: validDate,
        notes: "Monthly salary",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      const transaction = Transaction.fromPrimitives(primitives);
      const result = transaction.toPrimitives();

      expect(result.id).toBe(primitives.id);
      expect(result.userId).toBe(primitives.userId);
      expect(result.accountId).toBe(primitives.accountId);
      expect(result.categoryId).toBe(primitives.categoryId);
      expect(result.amount).toEqual(primitives.amount);
      expect(result.direction).toBe(primitives.direction);
      expect(result.description).toBe(primitives.description);
      expect(result.transactionDate).toBe("2024-01-01T10:00:00.000Z");
      expect(result.notes).toBe(primitives.notes);
      expect(result.createdAt).toEqual(primitives.createdAt);
      expect(result.updatedAt).toEqual(primitives.updatedAt);
    });

    test("creates transaction without notes", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound" as const,
        description: "Payment",
        transactionDate: validDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      };

      const transaction = Transaction.fromPrimitives(primitives);
      const result = transaction.toPrimitives();

      expect(result.notes).toBeUndefined();
    });

    test("throws error for invalid transaction ID in primitives", () => {
      const primitives = {
        id: "invalid-uuid",
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound" as const,
        description: "Payment",
        transactionDate: validDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      };

      expect(() => Transaction.fromPrimitives(primitives)).toThrow(
        "Invalid UUID format"
      );
    });

    test("throws error for negative amount in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: -100, currency: "COP" },
        direction: "inbound" as const,
        description: "Payment",
        transactionDate: validDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      };

      expect(() => Transaction.fromPrimitives(primitives)).toThrow(
        "Amount must be non-negative"
      );
    });

    test("throws error for empty description in primitives", () => {
      const primitives = {
        id: "01936d8f-5e27-7b3a-9c4e-123456789abc",
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound" as const,
        description: "",
        transactionDate: validDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      };

      expect(() => Transaction.fromPrimitives(primitives)).toThrow(
        "Transaction description cannot be empty"
      );
    });
  });

  describe("toPrimitives", () => {
    test("returns primitive representation with all fields", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Salary payment",
        transactionDate: validDate,
        notes: "Monthly salary",
      });
      const primitives = transaction.toPrimitives();

      expect(primitives.id).toBeDefined();
      expect(primitives.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(primitives.userId).toBe(validUserId);
      expect(primitives.accountId).toBe(validAccountId);
      expect(primitives.categoryId).toBe(validCategoryId);
      expect(primitives.amount).toEqual({ amount: 1000, currency: "COP" });
      expect(primitives.direction).toBe("inbound");
      expect(primitives.description).toBe("Salary payment");
      expect(primitives.transactionDate).toBe("2024-01-01T10:00:00.000Z");
      expect(primitives.notes).toBe("Monthly salary");
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });

    test("returns ISO 8601 date string", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Payment",
        transactionDate: validDate,
        notes: null,
      });
      const primitives = transaction.toPrimitives();

      expect(primitives.transactionDate).toBe("2024-01-01T10:00:00.000Z");
    });

    test("returns undefined notes when not provided", () => {
      const transaction = Transaction.create({
        id: uuidv7(),
        userId: validUserId,
        accountId: validAccountId,
        categoryId: validCategoryId,
        amount: { amount: 1000, currency: "COP" },
        direction: "inbound",
        description: "Payment",
        transactionDate: validDate,
        notes: null,
      });
      const primitives = transaction.toPrimitives();

      expect(primitives.notes).toBeNull();
    });
  });
});
