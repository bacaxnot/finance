import { Transaction } from "../domain/aggregate.transaction";
import { TransactionRepository } from "../domain/repository.transaction";
import { TransactionId } from "../domain/value-object.transaction-id";
import { TransactionNotFoundException } from "../domain/exceptions";

export class FindTransaction {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: { id: string }): Promise<Transaction> {
    const transactionId = new TransactionId(params.id);
    const transaction = await this.repository.search(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundException(`Transaction not found: ${params.id}`);
    }

    return transaction;
  }
}
