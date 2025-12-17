import { AggregateRoot } from "~/_shared/domain/aggregate-root";
import { Money } from "~/_shared/domain/money";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "~/_shared/domain/primitives";
import { AccountId } from "~/accounts/domain/account-id";
import { AccountName } from "~/accounts/domain/account-name";
import { UserId } from "~/users/domain/user-id";

export type AccountPrimitives = {
  id: string;
  name: string;
  userId: string;
  initialBalance: { amount: number; currency: string };
  currentBalance: { amount: number; currency: string };
  createdAt: string;
  updatedAt: string;
};

export class Account extends AggregateRoot {
  private constructor(
    private readonly id: AccountId,
    private name: AccountName,
    private readonly userId: UserId,
    private readonly initialBalance: Money,
    private currentBalance: Money,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    userId: string;
    name: string;
    currency: string;
    initialBalance: number;
  }): Account {
    const now = dateToPrimitive(new Date());
    const initialBalance = {
      amount: params.initialBalance,
      currency: params.currency,
    };
    const currentBalance = {
      amount: params.initialBalance,
      currency: params.currency,
    };
    return Account.fromPrimitives({
      id: params.id,
      userId: params.userId,
      name: params.name,
      initialBalance,
      currentBalance,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrimitives(primitives: AccountPrimitives): Account {
    return new Account(
      new AccountId(primitives.id),
      new AccountName(primitives.name),
      new UserId(primitives.userId),
      new Money(
        primitives.initialBalance.amount,
        primitives.initialBalance.currency,
      ),
      new Money(
        primitives.currentBalance.amount,
        primitives.currentBalance.currency,
      ),
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt),
    );
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  hasCurrency(currency: string): boolean {
    return this.currentBalance.toPrimitives().currency === currency;
  }

  applyTransaction(
    amount: number,
    currency: string,
    direction: "inbound" | "outbound",
  ): void {
    const money = new Money(amount, currency);
    if (direction === "inbound") {
      this.currentBalance = this.currentBalance.add(money);
    } else {
      this.currentBalance = this.currentBalance.subtract(money);
    }
    this.updatedAt = new Date();
  }

  reverseTransaction(
    amount: number,
    currency: string,
    direction: "inbound" | "outbound",
  ): void {
    const money = new Money(amount, currency);
    if (direction === "inbound") {
      this.currentBalance = this.currentBalance.subtract(money);
    } else {
      this.currentBalance = this.currentBalance.add(money);
    }
    this.updatedAt = new Date();
  }

  toPrimitives(): AccountPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      userId: this.userId.value,
      initialBalance: this.initialBalance.toPrimitives(),
      currentBalance: this.currentBalance.toPrimitives(),
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
