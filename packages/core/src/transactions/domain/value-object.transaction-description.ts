import { InvalidArgumentError } from "~/_shared/domain/domain-error";

const MAX_DESCRIPTION_LENGTH = 200;

export class TransactionDescription {
  constructor(public readonly value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidLength(value);
  }

  private ensureIsNotEmpty(value: string): void {
    if (value && value.trim() !== "") return;
    throw new InvalidArgumentError("Transaction description cannot be empty");
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_DESCRIPTION_LENGTH) return;
    throw new InvalidArgumentError(
      `Transaction description is too long (max ${MAX_DESCRIPTION_LENGTH} characters)`
    );
  }

  equals(other: TransactionDescription): boolean {
    return this.value === other.value;
  }
}
