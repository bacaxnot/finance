import { Account } from "./aggregate.account";
import { AccountId } from "./value-object.account-id";

export interface AccountRepository {
  save(account: Account): Promise<void>;
  search(id: AccountId): Promise<Account | null>;
}
