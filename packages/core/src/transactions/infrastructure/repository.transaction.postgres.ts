import { db } from "@repo/db";
import { transactions } from "@repo/db/schema";
import { Transaction } from "../domain/aggregate.transaction";
import { eq } from "@repo/db/orm";
import { TransactionRepository } from "../domain/repository.transaction";
import { TransactionId } from "../domain/value-object.transaction-id";

export class TransactionRepositoryPostgres implements TransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    const primitives = transaction.toPrimitives();

    await db
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
        transactionDate: new Date(primitives.transactionDate),
        notes: primitives.notes,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: transactions.id,
        set: {
          amount: primitives.amount.amount.toString(),
          direction: primitives.direction,
          description: primitives.description,
          transactionDate: new Date(primitives.transactionDate),
          notes: primitives.notes,
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async search(id: TransactionId): Promise<Transaction | null> {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

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
      transactionDate: row.transactionDate.toISOString(),
      notes: row.notes || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
