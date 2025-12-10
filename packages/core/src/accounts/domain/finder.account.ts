import { Account } from "./aggregate.account";
import { AccountRepository } from "./repository.account";
import { AccountId } from "./value-object.account-id";
import { AccountDoesNotExistError } from "./error.account-does-not-exist";

export class FindAccount {
  constructor(private readonly repository: AccountRepository) {}

  async execute(params: { id: string }): Promise<Account> {
    const account = await this.repository.search(new AccountId(params.id));

    if (!account) {
      throw new AccountDoesNotExistError(params.id);
    }

    return account;
  }
}
