import type { UserId } from "~/users/domain/user-id";
import type { Account } from "./account";
import type { AccountId } from "./account-id";

export abstract class AccountRepository {
  abstract save(account: Account): Promise<void>;
  abstract search(id: AccountId): Promise<Account | null>;
  abstract searchByUserId(userId: UserId): Promise<Account[]>;
  abstract delete(id: AccountId): Promise<void>;
}
