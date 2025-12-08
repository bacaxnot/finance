import { Transaction } from "./aggregate.transaction";
import { TransactionId } from "./value-object.transaction-id";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  search(id: TransactionId): Promise<Transaction | null>;
}
