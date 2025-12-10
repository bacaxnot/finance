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

export type TransactionPrimitives = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  amount: { amount: number; currency: string };
  direction: TransactionDirectionType;
  description: string;
  transactionDate: string; // ISO 8601 UTC
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
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

export class Transaction {
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
    private updatedAt: Date
  ) {}

  static create({
    id,
    userId,
    accountId,
    categoryId,
    amount,
    direction,
    description,
    transactionDate,
    notes,
  }: Omit<TransactionPrimitives, "createdAt" | "updatedAt">): Transaction {
    return new Transaction(
      new TransactionId(id),
      new UserId(userId),
      new AccountId(accountId),
      categoryId ? new CategoryId(categoryId) : null,
      new Money(amount.amount, amount.currency),
      new TransactionDirection(direction),
      new TransactionDescription(description),
      new TransactionDate(new Date(transactionDate)),
      notes,
      new Date(),
      new Date()
    );
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
      new TransactionDate(new Date(primitives.transactionDate)),
      primitives.notes,
      primitives.createdAt,
      primitives.updatedAt
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
      transactionDate: this.date.value.toISOString(),
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  getAccountId(): string {
    return this.accountId.value;
  }

  getAmount(): { amount: number; currency: string } {
    return this.amount.toPrimitives();
  }

  getDirection(): "inbound" | "outbound" {
    return this.direction.value;
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
