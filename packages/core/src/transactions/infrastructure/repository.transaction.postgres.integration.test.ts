import { describe, test, expect, afterEach } from "bun:test";
import { eq } from "@repo/db/orm";
import { db } from "@repo/db";
import { transactions, users, accounts, categories } from "@repo/db/schema";
import { Transaction } from "../domain/aggregate.transaction";
import { TransactionRepositoryPostgres } from "./repository.transaction.postgres";

const skipIntegration = !process.env.RUN_INTEGRATION_TESTS;

describe.skipIf(skipIntegration)(
  "TransactionRepositoryPostgres - Integration",
  () => {
    const repository = new TransactionRepositoryPostgres();
    const createdTransactionIds: string[] = [];
    const testUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";
    const testAccountId = "01936d8f-5e27-7b3a-9c4e-123456789abd";
    const testCategoryId = "01936d8f-5e27-7b3a-9c4e-123456789abe";

    afterEach(async () => {
      for (const id of createdTransactionIds) {
        await db.delete(transactions).where(eq(transactions.id, id));
      }
      createdTransactionIds.length = 0;
    });

    test("save creates a new transaction in the database", async () => {
      // Ensure test user exists
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      // Ensure test account exists
      await db
        .insert(accounts)
        .values({
          id: testAccountId,
          userId: testUserId,
          name: "Test Account",
          currency: "COP",
          initialBalance: "1000",
          currentBalance: "1000",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      // Ensure test category exists
      await db
        .insert(categories)
        .values({
          id: testCategoryId,
          userId: testUserId,
          name: "Test Category",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const transaction = Transaction.create(
        testUserId,
        testAccountId,
        testCategoryId,
        500,
        "COP",
        "inbound",
        "Salary payment",
        "2024-01-01T10:00:00.000Z",
        "Monthly salary"
      );
      const primitives = transaction.toPrimitives();
      createdTransactionIds.push(primitives.id);

      await repository.save(transaction);

      const result = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(primitives.id);
      expect(result[0].userId).toBe(testUserId);
      expect(result[0].accountId).toBe(testAccountId);
      expect(result[0].categoryId).toBe(testCategoryId);
      expect(parseFloat(result[0].amount)).toBe(500);
      expect(result[0].currency).toBe("COP");
      expect(result[0].direction).toBe("inbound");
      expect(result[0].description).toBe("Salary payment");
      expect(result[0].notes).toBe("Monthly salary");
    });

    test("save updates an existing transaction in the database", async () => {
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(accounts)
        .values({
          id: testAccountId,
          userId: testUserId,
          name: "Test Account",
          currency: "COP",
          initialBalance: "1000",
          currentBalance: "1000",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(categories)
        .values({
          id: testCategoryId,
          userId: testUserId,
          name: "Test Category",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const transaction = Transaction.create(
        testUserId,
        testAccountId,
        testCategoryId,
        300,
        "COP",
        "outbound",
        "Groceries",
        "2024-01-01T10:00:00.000Z"
      );
      const primitives = transaction.toPrimitives();
      createdTransactionIds.push(primitives.id);

      await repository.save(transaction);

      const updatedTransaction = Transaction.fromPrimitives({
        ...primitives,
        amount: { amount: 350, currency: "COP" },
        description: "Groceries at supermarket",
        notes: "Weekly shopping",
        updatedAt: new Date(),
      });

      await repository.save(updatedTransaction);

      const result = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(parseFloat(result[0].amount)).toBe(350);
      expect(result[0].description).toBe("Groceries at supermarket");
      expect(result[0].notes).toBe("Weekly shopping");
    });

    test("search returns a transaction by id", async () => {
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(accounts)
        .values({
          id: testAccountId,
          userId: testUserId,
          name: "Test Account",
          currency: "COP",
          initialBalance: "1000",
          currentBalance: "1000",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(categories)
        .values({
          id: testCategoryId,
          userId: testUserId,
          name: "Test Category",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const transaction = Transaction.create(
        testUserId,
        testAccountId,
        testCategoryId,
        200,
        "COP",
        "inbound",
        "Freelance work",
        "2024-01-15T14:30:00.000Z",
        "Project payment"
      );
      const primitives = transaction.toPrimitives();
      createdTransactionIds.push(primitives.id);

      await repository.save(transaction);

      const foundTransaction = await repository.search(primitives.id);

      expect(foundTransaction).not.toBeNull();
      const foundPrimitives = foundTransaction!.toPrimitives();

      expect(foundPrimitives.id).toBe(primitives.id);
      expect(foundPrimitives.userId).toBe(testUserId);
      expect(foundPrimitives.accountId).toBe(testAccountId);
      expect(foundPrimitives.categoryId).toBe(testCategoryId);
      expect(foundPrimitives.amount).toEqual({ amount: 200, currency: "COP" });
      expect(foundPrimitives.direction).toBe("inbound");
      expect(foundPrimitives.description).toBe("Freelance work");
      expect(foundPrimitives.notes).toBe("Project payment");
    });

    test("search returns null when transaction is not found", async () => {
      const nonExistentId = "00000000-0000-7000-8000-000000000000";

      const result = await repository.search(nonExistentId);

      expect(result).toBeNull();
    });

    test("save handles transaction without notes", async () => {
      await db
        .insert(users)
        .values({
          id: testUserId,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(accounts)
        .values({
          id: testAccountId,
          userId: testUserId,
          name: "Test Account",
          currency: "COP",
          initialBalance: "1000",
          currentBalance: "1000",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      await db
        .insert(categories)
        .values({
          id: testCategoryId,
          userId: testUserId,
          name: "Test Category",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      const transaction = Transaction.create(
        testUserId,
        testAccountId,
        testCategoryId,
        100,
        "COP",
        "outbound",
        "Coffee",
        "2024-01-01T10:00:00.000Z"
      );
      const primitives = transaction.toPrimitives();
      createdTransactionIds.push(primitives.id);

      await repository.save(transaction);

      const result = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].notes).toBeNull();
    });
  }
);
