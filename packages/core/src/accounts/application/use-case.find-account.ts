import { Account } from "../domain/aggregate.account";
import { AccountRepository } from "../domain/repository.account";
import { AccountId } from "../domain/value-object.account-id";
import { AccountNotFoundException } from "../domain/exceptions";

export class FindAccount {
  constructor(private readonly repository: AccountRepository) {}

  async execute(params: { id: string }): Promise<Account> {
    const accountId = new AccountId(params.id);
    const account = await this.repository.search(accountId);

    if (!account) {
      throw new AccountNotFoundException(params.id);
    }

    return account;
  }
}
