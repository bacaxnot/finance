import { DomainEvent } from "../../../../../shared/domain/domain-event";
import type { TransactionPrimitives } from "../transaction";
import type { TransactionDirectionType } from "../transaction-direction";

export class TransactionCategoryUpdatedDomainEvent extends DomainEvent {
  static eventName = "toke.ledger.transaction.category.updated";

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
    super(TransactionCategoryUpdatedDomainEvent.eventName, id);
  }

  toPrimitives(): Omit<TransactionPrimitives, "createdAt" | "updatedAt"> {
    return {
      id: this.id,
      userId: this.userId,
      accountId: this.accountId,
      categoryId: this.categoryId,
      amount: this.amount,
      direction: this.direction,
      description: this.description,
      date: this.date,
      notes: this.notes,
    };
  }
}
