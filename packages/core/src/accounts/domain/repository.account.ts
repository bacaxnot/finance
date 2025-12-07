import { Account } from "./aggregate.account";

export interface AccountRepository {
  save(account: Account): Promise<void>;
  search(id: string): Promise<Account | null>;
}
