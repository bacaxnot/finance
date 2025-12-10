import { UserId } from "~/users/domain/value-object.user-id";
import { Account } from "./aggregate.account";
import { AccountId } from "./value-object.account-id";

export abstract class AccountRepository {
  abstract save(account: Account): Promise<void>;
  abstract search(id: AccountId): Promise<Account | null>;
  abstract searchByUserId(userId: UserId): Promise<Account[]>;
  abstract delete(id: AccountId): Promise<void>;
}
