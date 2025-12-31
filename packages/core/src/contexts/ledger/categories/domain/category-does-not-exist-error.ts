import { DomainError } from "../../../shared/domain/domain-error";

export class CategoryDoesNotExistError extends DomainError {
  readonly type = "CategoryDoesNotExistError";
  readonly message: string;

  constructor(public readonly categoryId: string) {
    super();
    this.message = `The category ${this.categoryId} does not exist`;
  }
}
