import { DomainError } from "../../../../shared/domain/domain-error";

export class UserDoesNotExistError extends DomainError {
  readonly type = "UserDoesNotExistError";
  readonly message: string;

  constructor(public readonly userId: string) {
    super();
    this.message = `User with id ${this.userId} does not exist`;
  }
}
