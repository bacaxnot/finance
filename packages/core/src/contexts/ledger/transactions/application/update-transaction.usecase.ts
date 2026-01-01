import { InferDependencies } from "../../../../../di/autoregister";

import { EventBus } from "../../../../shared/domain/event-bus";
import { FindTransaction } from "../domain/find-transaction.usecase";
import type { Transaction } from "../domain/transaction";
import type { TransactionDirectionType } from "../domain/transaction-direction";
import { TransactionRepository } from "../domain/transaction-repository";

export type UpdateTransactionPayload = {
  categoryId?: string | null;
  amount?: number;
  direction?: TransactionDirectionType;
  description?: string;
  transactionDate?: string;
  notes?: string | null;
};

@InferDependencies()
export class UpdateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly findTransaction: FindTransaction,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string, payload: UpdateTransactionPayload): Promise<void> {
    const transaction = await this.findTransaction.execute({ id });

    this.applyUpdates(transaction, payload);
    await this.transactionRepository.save(transaction);

    const events = transaction.pullDomainEvents();
    await this.eventBus.publish(events);
  }

  private applyUpdates(
    transaction: Transaction,
    payload: UpdateTransactionPayload,
  ) {
    type PayloadHandlers = {
      [K in keyof Required<UpdateTransactionPayload>]: (
        value: Exclude<UpdateTransactionPayload[K], undefined>,
      ) => void;
    };

    const handlers = {
      categoryId: (v) => transaction.updateCategoryId(v),
      amount: (v) => transaction.updateAmount(v),
      direction: (v) => transaction.updateDirection(v),
      description: (v) => transaction.updateDescription(v),
      transactionDate: (v) => transaction.updateDate(v),
      notes: (v) => transaction.updateNotes(v),
      /**
       *
       * this 'satisfies' is needed to ensure
       * all payload keys are handled and type safe at compile time
       *
       * */
    } satisfies PayloadHandlers;

    for (const [key, handler] of Object.entries(handlers)) {
      const value = payload[key as keyof typeof handlers];
      if (value !== undefined) {
        handler(value as never);
      }
    }
  }
}
