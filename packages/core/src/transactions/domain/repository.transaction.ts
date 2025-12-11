import type { AccountId } from "~/accounts/domain/value-object.account-id";
import type { UserId } from "~/users/domain/value-object.user-id";
import type { Transaction } from "./aggregate.transaction";
import type { TransactionId } from "./value-object.transaction-id";

export abstract class TransactionRepository {
	abstract save(transaction: Transaction): Promise<void>;
	abstract search(id: TransactionId): Promise<Transaction | null>;
	abstract searchByAccountId(accountId: AccountId): Promise<Transaction[]>;
	abstract searchByUserId(userId: UserId): Promise<Transaction[]>;
	abstract delete(id: TransactionId): Promise<void>;
}
