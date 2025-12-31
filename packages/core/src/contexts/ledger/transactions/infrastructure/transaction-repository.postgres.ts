import { eq } from "@repo/db/orm";
import { transactions } from "@repo/db/schema";
import { dateToPrimitive } from "../../../../shared/domain/primitives";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/drizzle-postgres-repository";
import type { AccountId } from "../../accounts/domain/account-id";
import type { UserId } from "../../users/domain/user-id";
import { Transaction } from "../domain/transaction";
import type { TransactionId } from "../domain/transaction-id";
import type { TransactionRepository } from "../domain/transaction-repository";

export class TransactionRepositoryPostgres
  extends DrizzlePostgresRepository<Transaction>
  implements TransactionRepository
{
  async save(transaction: Transaction): Promise<void> {
    const primitives = transaction.toPrimitives();

    await this.db
      .insert(transactions)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        accountId: primitives.accountId,
        categoryId: primitives.categoryId,
        amount: primitives.amount.amount.toString(),
        currency: primitives.amount.currency,
        direction: primitives.direction,
        description: primitives.description,
        transactionDate: new Date(primitives.date),
        notes: primitives.notes,
        createdAt: new Date(primitives.createdAt),
        updatedAt: new Date(primitives.updatedAt),
      })
      .onConflictDoUpdate({
        target: transactions.id,
        set: {
          amount: primitives.amount.amount.toString(),
          direction: primitives.direction,
          description: primitives.description,
          transactionDate: new Date(primitives.date),
          notes: primitives.notes,
          updatedAt: new Date(primitives.updatedAt),
        },
      });
  }

  async search(id: TransactionId): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toAggregate(result[0]);
  }

  async searchByAccountId(accountId: AccountId): Promise<Transaction[]> {
    const results = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId.value));

    return results.map((row) => this.toAggregate(row));
  }

  async searchByUserId(userId: UserId): Promise<Transaction[]> {
    const results = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId.value));

    return results.map((row) => this.toAggregate(row));
  }

  async delete(id: TransactionId): Promise<void> {
    await this.db.delete(transactions).where(eq(transactions.id, id.value));
  }

  protected toAggregate(row: typeof transactions.$inferSelect): Transaction {
    return Transaction.fromPrimitives({
      id: row.id,
      userId: row.userId,
      accountId: row.accountId,
      categoryId: row.categoryId,
      amount: {
        amount: parseFloat(row.amount),
        currency: row.currency,
      },
      direction: row.direction,
      description: row.description,
      date: dateToPrimitive(row.transactionDate),
      notes: row.notes,
      createdAt: dateToPrimitive(row.createdAt),
      updatedAt: dateToPrimitive(row.updatedAt),
    });
  }
}
