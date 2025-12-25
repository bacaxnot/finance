import { DomainError } from "../../shared/domain/domain-error";

export class CurrencyMismatchError extends DomainError {
  readonly type = "CurrencyMismatchError";
  readonly message: string;

  constructor(
    public readonly expected: string,
    public readonly actual: string,
  ) {
    super();
    this.message = `Currency mismatch: expected ${this.expected}, got ${this.actual}`;
  }
}
