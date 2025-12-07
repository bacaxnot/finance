import { InvalidArgumentException } from "~/_shared/domain/exceptions";

export type TransactionDirectionType = "inbound" | "outbound";

export class TransactionDirection {
  constructor(public readonly value: TransactionDirectionType) {
    this.ensureIsValidDirection(value);
  }

  private ensureIsValidDirection(value: string): void {
    if (value === "inbound" || value === "outbound") return;
    throw new InvalidArgumentException(
      'Transaction direction must be either "inbound" or "outbound"'
    );
  }

  equals(other: TransactionDirection): boolean {
    return this.value === other.value;
  }
}
