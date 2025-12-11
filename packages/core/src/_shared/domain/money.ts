import { Currency } from "./currency";
import { InvalidArgumentError } from "./domain-error";

export class Money {
	public readonly amount: number;
	public readonly currency: Currency;

	constructor(amount: number, currency: string) {
		this.ensureAmountIsNotNegative(amount);
		this.currency = new Currency(currency);
		this.amount = amount;
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

	private ensureAmountIsNotNegative(amount: number): void {
		if (amount >= 0) return;
		throw new InvalidArgumentError("Amount must be non-negative");
	}

	private ensureSameCurrency(other: Money): void {
		if (this.currency.equals(other.currency)) return;
		throw new InvalidArgumentError(
			"Cannot perform operation with different currencies",
		);
	}
}
