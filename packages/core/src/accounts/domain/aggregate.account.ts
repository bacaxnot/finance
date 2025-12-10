import { UserId } from "~/users/domain/value-object.user-id";
import { Money } from "~/_shared/domain/value-object.money";
import { AccountId } from "~/accounts/domain/value-object.account-id";
import { AccountName } from "~/accounts/domain/value-object.account-name";

export type AccountPrimitives = {
  id: string;
  userId: string;
  name: string;
  initialBalance: { amount: number; currency: string };
  currentBalance: { amount: number; currency: string };
  createdAt: Date;
  updatedAt: Date;
};

export class Account {
  private constructor(
    private readonly id: AccountId,
    private readonly userId: UserId,
    private name: AccountName,
    private readonly initialBalance: Money,
    private currentBalance: Money,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create({
    id,
    userId,
    name,
    initialBalance,
  }: Omit<AccountPrimitives, "createdAt" | "updatedAt" | "currentBalance">): Account {
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
      new UserId(userId),
      new AccountName(name),
      initialBalanceMoney,
      currentBalance,
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: AccountPrimitives): Account {
    return new Account(
      new AccountId(primitives.id),
      new UserId(primitives.userId),
      new AccountName(primitives.name),
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

  getCurrency(): string {
    return this.currentBalance.toPrimitives().currency;
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

  toPrimitives(): AccountPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      name: this.name.value,
      initialBalance: this.initialBalance.toPrimitives(),
      currentBalance: this.currentBalance.toPrimitives(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
