import { AccountId } from "~/accounts/domain/value-object.account-id";
import { UserId } from "~/users/domain/value-object.user-id";
import { Transaction } from "./aggregate.transaction";
import { TransactionId } from "./value-object.transaction-id";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  search(id: TransactionId): Promise<Transaction | null>;
  searchByAccountId(accountId: AccountId): Promise<Transaction[]>;
  searchByUserId(userId: UserId): Promise<Transaction[]>;
  delete(id: TransactionId): Promise<void>;
}
