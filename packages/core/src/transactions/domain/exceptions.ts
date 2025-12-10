import { BaseException } from "~/_shared/domain/exceptions";

export class TransactionNotFoundException extends BaseException {
  constructor(public readonly transactionId: string) {
    super(`Transaction not found: ${transactionId}`);
  }
}

export class CurrencyMismatchException extends BaseException {
  constructor(
    public readonly expected: string,
    public readonly actual: string
  ) {
    super(`Currency mismatch: expected ${expected}, got ${actual}`);
  }
}
