import { Transaction } from "./aggregate.transaction";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  search(id: string): Promise<Transaction | null>;
}
