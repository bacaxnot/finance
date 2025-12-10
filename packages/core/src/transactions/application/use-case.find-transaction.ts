import { Transaction } from "../domain/aggregate.transaction";
import { TransactionRepository } from "../domain/repository.transaction";
import { TransactionId } from "../domain/value-object.transaction-id";
import { TransactionDoesNotExistError } from "../domain/error.transaction-does-not-exist";

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
