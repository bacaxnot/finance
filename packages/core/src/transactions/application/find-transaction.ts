import type { Transaction } from "../domain/transaction";
import { TransactionDoesNotExistError } from "../domain/transaction-does-not-exist-error";
import { TransactionId } from "../domain/transaction-id";
import type { TransactionRepository } from "../domain/transaction-repository";

export class FindTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { id: string }): Promise<Transaction> {
    const transactionId = new TransactionId(params.id);
    const transaction = await this.repository.search(transactionId);

    if (!transaction) {
      throw new TransactionDoesNotExistError(params.id);
    }

    return transaction;
  }
}
