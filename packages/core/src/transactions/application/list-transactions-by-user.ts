import { UserId } from "~/users/domain/user-id";
import type { Transaction } from "../domain/transaction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class ListTransactionsByUser {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { userId: string }): Promise<Transaction[]> {
    const userId = new UserId(params.userId);

    return await this.repository.searchByUserId(userId);
  }
}
