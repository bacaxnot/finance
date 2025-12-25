import { InvalidArgumentError } from "../../shared/domain/domain-error";

export class TransactionDate {
  constructor(public readonly value: Date) {
    this.ensureDateIsNotInFuture(value);
  }

  private ensureDateIsNotInFuture(date: Date): void {
    const now = new Date();
    if (date <= now) return;
    throw new InvalidArgumentError("Transaction date cannot be in the future");
  }

  equals(other: TransactionDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }
}
