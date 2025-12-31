import { DomainEvent } from "../../../../../shared/domain/domain-event";
import type { TransactionPrimitives } from "../transaction";
import type { TransactionDirectionType } from "../transaction-direction";

export class TransactionAmountUpdatedDomainEvent extends DomainEvent {
  static eventName = "toke.ledger.transaction.amount.updated";

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly categoryId: string | null,
    public readonly amount: { amount: number; currency: string },
    public readonly direction: TransactionDirectionType,
    public readonly description: string,
    public readonly date: string,
    public readonly notes: string | null,
  ) {
    super(TransactionAmountUpdatedDomainEvent.eventName, id);
  }

  toPrimitives(): Omit<TransactionPrimitives, "createdAt" | "updatedAt"> {
    return {
      id: this.id,
      userId: this.userId,
      categoryId: this.categoryId,
      accountId: this.accountId,
      amount: this.amount,
      direction: this.direction,
      description: this.description,
      date: this.date,
      notes: this.notes,
    };
  }
}
