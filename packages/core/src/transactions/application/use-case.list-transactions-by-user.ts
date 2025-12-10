import { UserId } from "~/users/domain/value-object.user-id";
import { TransactionRepository } from "../domain/repository.transaction";
import { Transaction } from "../domain/aggregate.transaction";

export class ListTransactionsByUser {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { userId: string }): Promise<Transaction[]> {
    const userId = new UserId(params.userId);

    return await this.repository.searchByUserId(userId);
  }
}
