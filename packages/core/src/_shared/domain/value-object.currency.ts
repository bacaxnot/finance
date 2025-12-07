import { InvalidArgumentException } from "./exceptions";

// ISO 4217 currency codes - COP for MVP, expandable later
export const ALLOWED_CURRENCIES = ["COP"] as const;

export class Currency {
  constructor(public readonly value: string) {
    this.ensureIsValidCode(value);
  }

  private ensureIsValidCode(value: string): void {
    if (ALLOWED_CURRENCIES.includes(value as any)) return;
    throw new InvalidArgumentException(
      `Invalid currency code. Allowed currencies: ${ALLOWED_CURRENCIES.join(", ")}`
    );
  }

  equals(other: Currency): boolean {
    return this.value === other.value;
  }
}
