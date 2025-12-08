import { Id } from "~/_shared/domain/value-object.id";

export class CategoryId extends Id {
  constructor(value?: string) {
    super(value);
  }
}
