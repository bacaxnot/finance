import { UserId } from "~/users/domain/value-object.user-id";
import { AccountId } from "~/accounts/domain/value-object.account-id";
import { CategoryId } from "~/categories/domain/value-object.category-id";
import { Money } from "~/_shared/domain/value-object.money";
import { TransactionId } from "./value-object.transaction-id";
import {
  TransactionDirection,
  TransactionDirectionType,
} from "./value-object.transaction-direction";
import { TransactionDescription } from "./value-object.transaction-description";
import { TransactionDate } from "./value-object.transaction-date";
import { dateFromPrimitive, dateToPrimitive, Primitives } from "~/_shared/domain/primitives";
import { AggregateRoot } from "~/_shared/domain/aggregate-root";

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
  constructor(
    public readonly id: TransactionId,
    public readonly userId: UserId,
    public readonly accountId: AccountId,
    public categoryId: CategoryId | null,
    public amount: Money,
    public direction: TransactionDirection,
    public description: TransactionDescription,
    public date: TransactionDate,
    public notes: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    super();
  }

  static create({
    id,
    userId,
    accountId,
    categoryId,
    amount,
    direction,
    description,
    date,
    notes,
  }: Omit<Primitives<Transaction>, "createdAt" | "updatedAt">): Transaction {
    return new Transaction(
      new TransactionId(id),
      new UserId(userId),
      new AccountId(accountId),
      categoryId ? new CategoryId(categoryId) : null,
      new Money(amount.value, amount.currency),
      new TransactionDirection(direction),
      new TransactionDescription(description),
      new TransactionDate(dateFromPrimitive(date)),
      notes,
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: Primitives<Transaction>): Transaction {
    return new Transaction(
      new TransactionId(primitives.id),
      new UserId(primitives.userId),
      new AccountId(primitives.accountId),
      primitives.categoryId ? new CategoryId(primitives.categoryId) : null,
      new Money(primitives.amount.value, primitives.amount.currency),
      new TransactionDirection(primitives.direction),
      new TransactionDescription(primitives.description),
      new TransactionDate(dateFromPrimitive(primitives.date)),
      primitives.notes,
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt)
    );
  }

  toPrimitives(): Primitives<Transaction> {
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

  private updateAmount(amount: number | undefined, currency: string | undefined): void {
    const currentAmount = this.amount.toPrimitives();
    const newAmount = amount !== undefined ? amount : currentAmount.amount;
    const newCurrency = currency !== undefined ? currency : currentAmount.currency;
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
