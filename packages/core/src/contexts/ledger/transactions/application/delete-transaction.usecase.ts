import { InferDependencies } from "../../../../../di/autoregister";

import { EventBus } from "../../../../shared/domain/event-bus";
import { FindTransaction } from "../domain/find-transaction.usecase";
import { TransactionId } from "../domain/transaction-id";
import { TransactionRepository } from "../domain/transaction-repository";

@InferDependencies()
export class DeleteTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly findTransaction: FindTransaction,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string): Promise<void> {
    const transaction = await this.findTransaction.execute({ id });
    transaction.delete();

    await this.transactionRepository.delete(new TransactionId(id));

    const events = transaction.pullDomainEvents();
    await this.eventBus.publish(events);
  }
}
