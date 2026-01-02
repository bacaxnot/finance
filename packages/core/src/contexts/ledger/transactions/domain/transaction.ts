import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import { Money } from "../../../../shared/domain/money";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { AccountId } from "../../accounts/domain/account-id";
import { CategoryId } from "../../categories/domain/category-id";
import { UserId } from "../../users/domain/user-id";
import { TransactionAmountUpdatedDomainEvent } from "./events/transaction-amount-updated";
import { TransactionCategoryUpdatedDomainEvent } from "./events/transaction-category-updated";
import { TransactionCreatedDomainEvent } from "./events/transaction-created";
import { TransactionDateUpdatedDomainEvent } from "./events/transaction-date-updated";
import { TransactionDeletedDomainEvent } from "./events/transaction-deleted";
import { TransactionDescriptionUpdatedDomainEvent } from "./events/transaction-description-updated";
import { TransactionDirectionUpdatedDomainEvent } from "./events/transaction-direction-updated";
import { TransactionNotesUpdatedDomainEvent } from "./events/transaction-notes-updated";
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
    const transaction = Transaction.fromPrimitives({
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

    transaction.record(
      new TransactionCreatedDomainEvent(
        params.id,
        params.userId,
        params.accountId,
        params.categoryId,
        params.amount,
        params.direction,
        params.description,
        params.date,
        params.notes,
      ),
    );

    return transaction;
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

  updateCategoryId(categoryId: string | null): void {
    this.categoryId = categoryId ? new CategoryId(categoryId) : null;
    this.updatedAt = new Date();

    this.record(
      new TransactionCategoryUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
      ),
    );
  }

  updateAmount(amount: number): void {
    const previousAmount = this.amount.toPrimitives();
    this.amount = new Money(amount, previousAmount.currency);
    this.updatedAt = new Date();

    this.record(
      new TransactionAmountUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
        previousAmount,
      ),
    );
  }

  updateDirection(direction: TransactionDirectionType): void {
    const previousDirection = this.direction.value;
    this.direction = new TransactionDirection(direction);
    this.updatedAt = new Date();

    this.record(
      new TransactionDirectionUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
        previousDirection,
      ),
    );
  }

  updateDescription(description: string): void {
    this.description = new TransactionDescription(description);
    this.updatedAt = new Date();

    this.record(
      new TransactionDescriptionUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
      ),
    );
  }

  updateDate(date: string): void {
    this.date = new TransactionDate(new Date(date));
    this.updatedAt = new Date();

    this.record(
      new TransactionDateUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
      ),
    );
  }

  updateNotes(notes: string | null): void {
    this.notes = notes;
    this.updatedAt = new Date();

    this.record(
      new TransactionNotesUpdatedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
      ),
    );
  }

  delete(): void {
    this.record(
      new TransactionDeletedDomainEvent(
        this.id.value,
        this.userId.value,
        this.accountId.value,
        this.categoryId?.value ?? null,
        this.amount.toPrimitives(),
        this.direction.value,
        this.description.value,
        dateToPrimitive(this.date.value),
        this.notes,
      ),
    );
  }
}
