import { BaseException } from "~/_shared/domain/exceptions";

export class AccountNotFoundException extends BaseException {}

export class UnauthorizedAccountAccessException extends BaseException {}
