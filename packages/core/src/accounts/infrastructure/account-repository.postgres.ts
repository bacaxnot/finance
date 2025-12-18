import { eq } from "@repo/db/orm";
import { accounts } from "@repo/db/schema";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "~/_shared/domain/primitives";
import { DrizzlePostgresRepository } from "~/_shared/infrastructure/drizzle-postgres-repository";
import type { UserId } from "~/users/domain/user-id";
import { Account } from "../domain/account";
import type { AccountId } from "../domain/account-id";
import type { AccountRepository } from "../domain/account-repository";

export class AccountRepositoryPostgres
  extends DrizzlePostgresRepository<Account>
  implements AccountRepository
{
  async save(account: Account): Promise<void> {
    const primitives = account.toPrimitives();

    await this.db
      .insert(accounts)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        name: primitives.name,
        currency: primitives.initialBalance.currency,
        initialBalance: primitives.initialBalance.amount.toString(),
        currentBalance: primitives.currentBalance.amount.toString(),
        createdAt: dateFromPrimitive(primitives.createdAt),
        updatedAt: dateFromPrimitive(primitives.updatedAt),
      })
      .onConflictDoUpdate({
        target: accounts.id,
        set: {
          name: primitives.name,
          currentBalance: primitives.currentBalance.amount.toString(),
          updatedAt: dateFromPrimitive(primitives.updatedAt),
        },
      });
  }

  async search(id: AccountId): Promise<Account | null> {
    const result = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toAggregate(result[0]);
  }

  async searchByUserId(userId: UserId): Promise<Account[]> {
    const results = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId.value));

    return results.map((row) => this.toAggregate(row));
  }

  async delete(id: AccountId): Promise<void> {
    await this.db.delete(accounts).where(eq(accounts.id, id.value));
  }

  protected toAggregate(row: typeof accounts.$inferSelect): Account {
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
      createdAt: dateToPrimitive(row.createdAt),
      updatedAt: dateToPrimitive(row.updatedAt),
    });
  }
}
