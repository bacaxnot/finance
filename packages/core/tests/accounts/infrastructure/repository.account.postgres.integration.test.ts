import { describe, test, expect, afterEach } from "bun:test";
import { eq } from "@repo/db/orm";
import { db } from "@repo/db";
import { accounts, users } from "@repo/db/schema";
import { Account } from "~/accounts/domain/aggregate.account";
import { AccountRepositoryPostgres } from "~/accounts/infrastructure/repository.account.postgres";

const skipIntegration = !process.env.RUN_INTEGRATION_TESTS;

describe.skipIf(skipIntegration)(
  "AccountRepositoryPostgres - Integration",
  () => {
    const repository = new AccountRepositoryPostgres();
    const createdAccountIds: string[] = [];
    const testUserId = "01936d8f-5e27-7b3a-9c4e-123456789abc";

    afterEach(async () => {
      for (const id of createdAccountIds) {
        await db.delete(accounts).where(eq(accounts.id, id));
      }
      createdAccountIds.length = 0;
    });

    test("save creates a new account in the database", async () => {
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

      const account = Account.create(testUserId, "Checking Account", 1000, "COP");
      const primitives = account.toPrimitives();
      createdAccountIds.push(primitives.id);

      await repository.save(account);

      const result = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(primitives.id);
      expect(result[0].userId).toBe(testUserId);
      expect(result[0].name).toBe("Checking Account");
      expect(result[0].currency).toBe("COP");
      expect(parseFloat(result[0].initialBalance)).toBe(1000);
      expect(parseFloat(result[0].currentBalance)).toBe(1000);
    });

    test("save updates an existing account in the database", async () => {
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

      const account = Account.create(testUserId, "Savings Account", 5000, "COP");
      const primitives = account.toPrimitives();
      createdAccountIds.push(primitives.id);

      await repository.save(account);

      const updatedAccount = Account.fromPrimitives({
        ...primitives,
        name: "Updated Savings",
        currentBalance: { amount: 6000, currency: "COP" },
        updatedAt: new Date(),
      });

      await repository.save(updatedAccount);

      const result = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, primitives.id))
        .limit(1);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Updated Savings");
      expect(parseFloat(result[0].currentBalance)).toBe(6000);
      expect(parseFloat(result[0].initialBalance)).toBe(5000); // Unchanged
    });

    test("search returns an account by id", async () => {
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

      const account = Account.create(testUserId, "Investment Account", 10000, "COP");
      const primitives = account.toPrimitives();
      createdAccountIds.push(primitives.id);

      await repository.save(account);

      const foundAccount = await repository.search(primitives.id);

      expect(foundAccount).not.toBeNull();
      const foundPrimitives = foundAccount!.toPrimitives();

      expect(foundPrimitives.id).toBe(primitives.id);
      expect(foundPrimitives.userId).toBe(testUserId);
      expect(foundPrimitives.name).toBe("Investment Account");
      expect(foundPrimitives.initialBalance).toEqual({
        amount: 10000,
        currency: "COP",
      });
      expect(foundPrimitives.currentBalance).toEqual({
        amount: 10000,
        currency: "COP",
      });
    });

    test("search returns null when account is not found", async () => {
      const nonExistentId = "00000000-0000-7000-8000-000000000000";

      const result = await repository.search(nonExistentId);

      expect(result).toBeNull();
    });
  }
);
