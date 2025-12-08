import { BaseException } from "~/_shared/domain/exceptions";

export class CategoryNotFoundException extends BaseException {}

export class UnauthorizedCategoryAccessException extends BaseException {}
