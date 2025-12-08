import { InvalidArgumentException } from "~/_shared/domain/exceptions";

const MAX_NAME_LENGTH = 100;

export class AccountName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureIsNotEmpty(value: string): void {
    if (value && value.trim() !== "") return;
    throw new InvalidArgumentException("Account name cannot be empty");
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_NAME_LENGTH) return;
    throw new InvalidArgumentException(
      `Account name is too long (max ${MAX_NAME_LENGTH} characters)`
    );
  }

  equals(other: AccountName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
