import { UserId } from "../../users/domain/user-id";
import type { TransactionPrimitives } from "../domain/transaction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class SearchTransactionsByUser {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { userId: string }): Promise<TransactionPrimitives[]> {
    const userId = new UserId(params.userId);
    const transactions = await this.repository.searchByUserId(userId);
    return transactions.map((transaction) => transaction.toPrimitives());
  }
}
