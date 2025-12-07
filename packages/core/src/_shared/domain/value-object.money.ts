import { InvalidArgumentException } from "./exceptions";
import { Currency } from "./value-object.currency";

export class Money {
  private amount: number;
  private currency: Currency;

  constructor(amount: number, currency: string) {
    this.ensureAmountIsNotNegative(amount);
    this.currency = new Currency(currency);
    this.amount = amount;
  }

  private ensureAmountIsNotNegative(amount: number): void {
    if (amount >= 0) return;
    throw new InvalidArgumentException("Amount must be non-negative");
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency.equals(other.currency)) return;
    throw new InvalidArgumentException(
      "Cannot perform operation with different currencies"
    );
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency.value);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency.value);
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  toPrimitives(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency.value,
    };
  }
}
