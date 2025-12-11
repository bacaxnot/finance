import { UserId } from "~/users/domain/user-id";
import { TransactionRepository } from "../domain/transaction-repository";
import { Transaction } from "../domain/transaction";

export class ListTransactionsByUser {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { userId: string }): Promise<Transaction[]> {
    const userId = new UserId(params.userId);

    return await this.repository.searchByUserId(userId);
  }
}
