import { InferDependencies } from "../../../../../di/autoregister";

import type { DomainEventName } from "../../../../shared/domain/domain-event-name";
import { DomainEventSubscriber } from "../../../../shared/domain/domain-event-subscriber";
import { TransactionDirectionUpdatedDomainEvent } from "../../transactions/domain/events/transaction-direction-updated";
import { UpdateAccountBalance } from "./update-account-balance.usecase";

@InferDependencies()
export class UpdateAccountBalanceOnTransactionDirectionUpdated extends DomainEventSubscriber<TransactionDirectionUpdatedDomainEvent> {
  constructor(private readonly updateAccountBalance: UpdateAccountBalance) {
    super();
  }

  async on(event: TransactionDirectionUpdatedDomainEvent): Promise<void> {
    const { accountId, amount, direction, previousDirection } = event;

    // If direction didn't actually change, do nothing
    if (direction === previousDirection) {
      return;
    }

    // Direction changed, so we need to reverse the effect twice
    // (once to undo the old direction, once to apply the new direction)
    // This is equivalent to applying 2x the amount in the new direction
    const operation = direction === "inbound" ? "add" : "subtract";
    const doubleAmount = amount.amount * 2;

    await this.updateAccountBalance.execute({
      accountId,
      operation,
      amount: doubleAmount,
      currency: amount.currency,
    });
  }

  subscribedTo(): DomainEventName<TransactionDirectionUpdatedDomainEvent>[] {
    return [TransactionDirectionUpdatedDomainEvent];
  }
}
