import { UserId } from "~/users/domain/value-object.user-id";
import { Money } from "~/_shared/domain/value-object.money";
import { AccountId } from "./value-object.account-id";
import { AccountName } from "./value-object.account-name";

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

  static create(
    userId: string,
    name: string,
    initialBalanceAmount: number,
    currency: string
  ): Account {
    const initialBalance = new Money(initialBalanceAmount, currency);
    const currentBalance = new Money(initialBalanceAmount, currency);
    return new Account(
      new AccountId(),
      new UserId(userId),
      new AccountName(name),
      initialBalance,
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
