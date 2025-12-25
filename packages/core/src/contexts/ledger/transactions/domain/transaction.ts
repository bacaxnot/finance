import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import { Money } from "../../../../shared/domain/money";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { AccountId } from "../../accounts/domain/account-id";
import { CategoryId } from "../../categories/domain/category-id";
import { UserId } from "../../users/domain/user-id";
import { TransactionDate } from "./transaction-date";
import { TransactionDescription } from "./transaction-description";
import {
  TransactionDirection,
  type TransactionDirectionType,
} from "./transaction-direction";
import { TransactionId } from "./transaction-id";

export type TransactionPrimitives = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  amount: { amount: number; currency: string };
  direction: TransactionDirectionType;
  description: string;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateTransactionPrimitives = Partial<{
  categoryId: string | null;
  amount: number;
  currency: string;
  direction: TransactionDirectionType;
  description: string;
  transactionDate: string;
  notes: string | null;
}>;

export class Transaction extends AggregateRoot {
  private constructor(
    private readonly id: TransactionId,
    private readonly userId: UserId,
    private readonly accountId: AccountId,
    private categoryId: CategoryId | null,
    private amount: Money,
    private direction: TransactionDirection,
    private description: TransactionDescription,
    private date: TransactionDate,
    private notes: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: { amount: number; currency: string };
    direction: TransactionDirectionType;
    description: string;
    date: string;
    notes: string | null;
  }): Transaction {
    const now = dateToPrimitive(new Date());
    return Transaction.fromPrimitives({
      id: params.id,
      userId: params.userId,
      accountId: params.accountId,
      categoryId: params.categoryId,
      amount: params.amount,
      direction: params.direction,
      description: params.description,
      date: params.date,
      notes: params.notes,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrimitives(primitives: TransactionPrimitives): Transaction {
    return new Transaction(
      new TransactionId(primitives.id),
      new UserId(primitives.userId),
      new AccountId(primitives.accountId),
      primitives.categoryId ? new CategoryId(primitives.categoryId) : null,
      new Money(primitives.amount.amount, primitives.amount.currency),
      new TransactionDirection(primitives.direction),
      new TransactionDescription(primitives.description),
      new TransactionDate(dateFromPrimitive(primitives.date)),
      primitives.notes,
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt),
    );
  }

  toPrimitives(): TransactionPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      accountId: this.accountId.value,
      categoryId: this.categoryId ? this.categoryId.value : null,
      amount: this.amount.toPrimitives(),
      direction: this.direction.value,
      description: this.description.value,
      date: dateToPrimitive(this.date.value),
      notes: this.notes,
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  update(params: UpdateTransactionPrimitives): void {
    if (params.amount !== undefined || params.currency !== undefined) {
      this.updateAmount(params.amount, params.currency);
    }
    if (params.categoryId !== undefined) {
      this.updateCategoryId(params.categoryId);
    }
    if (params.direction !== undefined) {
      this.updateDirection(params.direction);
    }
    if (params.description !== undefined) {
      this.updateDescription(params.description);
    }
    if (params.transactionDate !== undefined) {
      this.updateTransactionDate(params.transactionDate);
    }
    if (params.notes !== undefined) {
      this.updateNotes(params.notes);
    }

    this.updatedAt = new Date();
  }

  private updateCategoryId(categoryId: string | null): void {
    this.categoryId = categoryId ? new CategoryId(categoryId) : null;
  }

  private updateAmount(
    amount: number | undefined,
    currency: string | undefined,
  ): void {
    const currentAmount = this.amount.toPrimitives();
    const newAmount = amount !== undefined ? amount : currentAmount.amount;
    const newCurrency =
      currency !== undefined ? currency : currentAmount.currency;
    this.amount = new Money(newAmount, newCurrency);
  }

  private updateDirection(direction: TransactionDirectionType): void {
    this.direction = new TransactionDirection(direction);
  }

  private updateDescription(description: string): void {
    this.description = new TransactionDescription(description);
  }

  private updateTransactionDate(transactionDate: string): void {
    this.date = new TransactionDate(new Date(transactionDate));
  }

  private updateNotes(notes: string | null): void {
    this.notes = notes;
  }
}
