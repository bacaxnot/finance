import { Id } from "~/_shared/domain/id";

export class UserId extends Id {
  constructor(value?: string) {
    super(value);
  }
}
