import { db } from "@repo/db";
import { accounts } from "@repo/db/schema";
import { Account } from "../domain/aggregate.account";
import { eq } from "@repo/db/orm";
import { AccountRepository } from "../domain/repository.account";
import { AccountId } from "../domain/value-object.account-id";

export class AccountRepositoryPostgres implements AccountRepository {
  async save(account: Account): Promise<void> {
    const primitives = account.toPrimitives();

    await db
      .insert(accounts)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        name: primitives.name,
        currency: primitives.initialBalance.currency,
        initialBalance: primitives.initialBalance.amount.toString(),
        currentBalance: primitives.currentBalance.amount.toString(),
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: accounts.id,
        set: {
          name: primitives.name,
          currentBalance: primitives.currentBalance.amount.toString(),
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async search(id: AccountId): Promise<Account | null> {
    const result = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    return Account.fromPrimitives({
      id: row.id,
      userId: row.userId,
      name: row.name,
      initialBalance: {
        amount: parseFloat(row.initialBalance),
        currency: row.currency,
      },
      currentBalance: {
        amount: parseFloat(row.currentBalance),
        currency: row.currency,
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
