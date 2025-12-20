import { DomainError } from "../../_shared/domain/domain-error";

export class TransactionDoesNotExistError extends DomainError {
  readonly type = "TransactionDoesNotExistError";
  readonly message: string;

  constructor(public readonly transactionId: string) {
    super();
    this.message = `The transaction ${this.transactionId} does not exist`;
  }
}
