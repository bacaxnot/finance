import { InferDependencies } from "../../../../../di/autoregister";

import type { DomainEventName } from "../../../../shared/domain/domain-event-name";
import { DomainEventSubscriber } from "../../../../shared/domain/domain-event-subscriber";
import { TransactionDeletedDomainEvent } from "../../transactions/domain/events/transaction-deleted";
import { UpdateAccountBalance } from "./update-account-balance.usecase";

@InferDependencies()
export class UpdateAccountBalanceOnTransactionDeleted extends DomainEventSubscriber<TransactionDeletedDomainEvent> {
  constructor(private readonly updateAccountBalance: UpdateAccountBalance) {
    super();
  }

  async on(event: TransactionDeletedDomainEvent): Promise<void> {
    const { accountId, amount, direction } = event;

    // Reverse the transaction's effect on the balance
    const operation = direction === "inbound" ? "subtract" : "add";

    await this.updateAccountBalance.execute({
      accountId,
      operation,
      amount: amount.amount,
      currency: amount.currency,
    });
  }

  subscribedTo(): DomainEventName<TransactionDeletedDomainEvent>[] {
    return [TransactionDeletedDomainEvent];
  }
}
