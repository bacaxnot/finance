import { DomainError } from "../../shared/domain/domain-error";

export class AccountDoesNotExistError extends DomainError {
  readonly type = "AccountDoesNotExistError";
  readonly message: string;

  constructor(public readonly accountId: string) {
    super();
    this.message = `The account ${this.accountId} does not exist`;
  }
}
