import type { EventBus } from "../../../../shared/domain/event-bus";
import type { FindTransaction } from "../domain/find-transaction";
import { TransactionId } from "../domain/transaction-id";
import type { TransactionRepository } from "../domain/transaction-repository";

export class DeleteTransactionUseCase {
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
