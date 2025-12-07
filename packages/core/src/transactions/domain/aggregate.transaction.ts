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
  categoryId: string;
  amount: { amount: number; currency: string };
  direction: TransactionDirectionType;
  description: string;
  transactionDate: string; // ISO 8601 UTC
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Transaction {
  private constructor(
    private readonly id: TransactionId,
    private readonly userId: UserId,
    private readonly accountId: AccountId,
    private readonly categoryId: CategoryId,
    private amount: Money,
    private direction: TransactionDirection,
    private description: TransactionDescription,
    private date: TransactionDate,
    private notes: string | undefined,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(
    userId: string,
    accountId: string,
    categoryId: string,
    amount: number,
    currency: string,
    direction: TransactionDirectionType,
    description: string,
    transactionDate: string, // ISO 8601 UTC
    notes?: string
  ): Transaction {
    return new Transaction(
      new TransactionId(),
      new UserId(userId),
      new AccountId(accountId),
      new CategoryId(categoryId),
      new Money(amount, currency),
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
      new CategoryId(primitives.categoryId),
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
      categoryId: this.categoryId.value,
      amount: this.amount.toPrimitives(),
      direction: this.direction.value,
      description: this.description.value,
      transactionDate: this.date.value.toISOString(),
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
