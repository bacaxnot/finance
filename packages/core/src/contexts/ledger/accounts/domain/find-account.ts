import type { Account } from "./account";
import { AccountDoesNotExistError } from "./account-does-not-exist-error";
import { AccountId } from "./account-id";
import type { AccountRepository } from "./account-repository";

export class FindAccount {
  constructor(private readonly repository: AccountRepository) {}

  async execute(params: { id: string }): Promise<Account> {
    const accountId = new AccountId(params.id);
    const account = await this.repository.search(accountId);

    if (!account) {
      throw new AccountDoesNotExistError(params.id);
    }

    return account;
  }
}
