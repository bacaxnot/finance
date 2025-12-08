import { Id } from "~/_shared/domain/value-object.id";

export class TransactionId extends Id {
  constructor(value?: string) {
    super(value);
  }
}
