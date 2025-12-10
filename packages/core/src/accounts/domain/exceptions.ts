import { BaseException } from "~/_shared/domain/exceptions";

export class AccountNotFoundException extends BaseException {
  constructor(public readonly accountId: string) {
    super(`Account not found: ${accountId}`);
  }
}

export class UnauthorizedAccountAccessException extends BaseException {}
