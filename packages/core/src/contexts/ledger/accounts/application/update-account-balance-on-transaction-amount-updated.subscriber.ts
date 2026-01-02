import { InferDependencies } from "../../../../../di/autoregister";

import type { DomainEventName } from "../../../../shared/domain/domain-event-name";
import { DomainEventSubscriber } from "../../../../shared/domain/domain-event-subscriber";
import { TransactionAmountUpdatedDomainEvent } from "../../transactions/domain/events/transaction-amount-updated";
import { UpdateAccountBalance } from "./update-account-balance.usecase";

@InferDependencies()
export class UpdateAccountBalanceOnTransactionAmountUpdated extends DomainEventSubscriber<TransactionAmountUpdatedDomainEvent> {
  constructor(private readonly updateAccountBalance: UpdateAccountBalance) {
    super();
  }

  async on(event: TransactionAmountUpdatedDomainEvent): Promise<void> {
    const { accountId, amount, previousAmount, direction } = event;

    const amountDelta = amount.amount - previousAmount.amount;
    if (amountDelta === 0) {
      return;
    }

    // For inbound: positive delta = add, negative delta = subtract
    // For outbound: flip the sign
    const balanceDelta = direction === "inbound" ? amountDelta : -amountDelta;
    const operation = balanceDelta >= 0 ? "add" : "subtract";

    await this.updateAccountBalance.execute({
      accountId,
      operation,
      amount: Math.abs(balanceDelta),
      currency: amount.currency,
    });
  }

  subscribedTo(): DomainEventName<TransactionAmountUpdatedDomainEvent>[] {
    return [TransactionAmountUpdatedDomainEvent];
  }
}
