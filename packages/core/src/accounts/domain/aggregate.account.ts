import { UserId } from "~/users/domain/value-object.user-id";
import { Money } from "~/_shared/domain/value-object.money";
import { AccountId } from "~/accounts/domain/value-object.account-id";
import { AccountName } from "~/accounts/domain/value-object.account-name";
import { Primitives } from "~/_shared/domain/primitives";

export class Account {
  constructor(
    public readonly id: AccountId,
    public name: AccountName,
    public readonly userId: UserId,
    public readonly initialBalance: Money,
    public currentBalance: Money,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create({
    id,
    userId,
    name,
    initialBalance,
  }: Omit<Primitives<Account>, "createdAt" | "updatedAt" | "currentBalance">): Account {
    const initialBalanceMoney = new Money(
      initialBalance.amount,
      initialBalance.currency
    );
    const currentBalance = new Money(
      initialBalance.amount,
      initialBalance.currency
    );
    return new Account(
      new AccountId(id),
      new AccountName(name),
      new UserId(userId),
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
      new Money(
        primitives.initialBalance.amount,
        primitives.initialBalance.currency
      ),
      new Money(
        primitives.currentBalance.amount,
        primitives.currentBalance.currency
      ),
      primitives.createdAt,
      primitives.updatedAt
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
