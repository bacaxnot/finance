import { UserId } from "~/users/domain/user-id";
import { Money } from "~/_shared/domain/money";
import { AccountId } from "~/accounts/domain/account-id";
import { AccountName } from "~/accounts/domain/account-name";
import { dateFromPrimitive, dateToPrimitive, Primitives } from "~/_shared/domain/primitives";
import { AggregateRoot } from "~/_shared/domain/aggregate-root";

export class Account extends AggregateRoot {
  constructor(
    public readonly id: AccountId,
    public name: AccountName,
    public readonly userId: UserId,
    public readonly initialBalance: Money,
    public currentBalance: Money,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    super();
  }

  static create(params:{
    id: string,
    userId: string,
    name: string,
    currency: string,
    initialBalance: number,
  }): Account {
    const initialBalanceMoney = new Money(
      params.initialBalance,
        params.currency
    );

    const currentBalance = new Money(
      params.initialBalance,
      params.currency
    );

    return new Account(
      new AccountId(params.id),
      new AccountName(params.name),
      new UserId(params.userId),
      initialBalanceMoney,
      currentBalance,
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: Primitives<Account>): Account {
    return new Account(
      new AccountId(primitives.id),
      new AccountName(primitives.name),
      new UserId(primitives.userId),
      new Money(primitives.initialBalance.amount, primitives.initialBalance.currency),
      new Money(primitives.currentBalance.amount, primitives.currentBalance.currency),
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt)
    );
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  hasCurrency(currency: string): boolean {
    return this.currentBalance.toPrimitives().currency === currency;
  }

  applyTransaction(amount: number, currency: string, direction: "inbound" | "outbound"): void {
    const money = new Money(amount, currency);
    if (direction === "inbound") {
      this.currentBalance = this.currentBalance.add(money);
    } else {
      this.currentBalance = this.currentBalance.subtract(money);
    }
    this.updatedAt = new Date();
  }

  reverseTransaction(amount: number, currency: string, direction: "inbound" | "outbound"): void {
    const money = new Money(amount, currency);
    if (direction === "inbound") {
      this.currentBalance = this.currentBalance.subtract(money);
    } else {
      this.currentBalance = this.currentBalance.add(money);
    }
    this.updatedAt = new Date();
  }

  toPrimitives(): Primitives<Account> {
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
