import type { DomainEventName } from "../../../../shared/domain/domain-event-name";
import { DomainEventSubscriber } from "../../../../shared/domain/domain-event-subscriber";
import { TransactionCreatedDomainEvent } from "../../transactions/domain/events/transaction-created";
import type { UpdateAccountBalance } from "./update-account-balance";

export class UpdateAccountBalanceOnTransactionCreated extends DomainEventSubscriber<TransactionCreatedDomainEvent> {
  constructor(private readonly updateAccountBalance: UpdateAccountBalance) {
    super();
  }

  async on(event: TransactionCreatedDomainEvent): Promise<void> {
    const { accountId, amount, direction } = event;
    const operation = direction === "inbound" ? "add" : "subtract";

    await this.updateAccountBalance.execute({
      accountId,
      operation,
      amount: amount.amount,
      currency: amount.currency,
    });
  }

  subscribedTo(): DomainEventName<TransactionCreatedDomainEvent>[] {
    return [TransactionCreatedDomainEvent];
  }
}
