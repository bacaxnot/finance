import { InferDependencies } from "../../../../../di/autoregister";

import type { Transaction } from "./transaction";
import { TransactionDoesNotExistError } from "./transaction-does-not-exist-error";
import { TransactionId } from "./transaction-id";
import { TransactionRepository } from "./transaction-repository";

@InferDependencies()
export class FindTransaction {
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
