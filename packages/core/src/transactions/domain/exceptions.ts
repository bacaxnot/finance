import { BaseException } from "~/_shared/domain/exceptions";

export class TransactionNotFoundException extends BaseException {}

export class CurrencyMismatchException extends BaseException {}
