import { Id } from "~/_shared/domain/id";

export class TransactionId extends Id {
  constructor(value?: string) {
    super(value);
  }
}
