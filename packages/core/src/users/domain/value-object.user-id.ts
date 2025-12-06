import { Id } from "~/_shared/domain/value-object.id";

export class UserId extends Id {
  constructor(value?: string) {
    super(value);
  }
}
