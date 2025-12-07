import { InvalidArgumentException } from "~/_shared/domain/exceptions";

export class TransactionDate {
  constructor(public readonly value: Date) {
    this.ensureDateIsNotInFuture(value);
  }

  private ensureDateIsNotInFuture(date: Date): void {
    const now = new Date();
    if (date <= now) return;
    throw new InvalidArgumentException("Transaction date cannot be in the future");
  }

  equals(other: TransactionDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }
}
