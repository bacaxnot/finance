import { BaseException } from "~/_shared/domain/exceptions";

export class CategoryNotFoundException extends BaseException {
  constructor(public readonly categoryId: string) {
    super(`Category not found: ${categoryId}`);
  }
}

export class UnauthorizedCategoryAccessException extends BaseException {}
