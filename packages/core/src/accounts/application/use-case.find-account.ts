import { Account } from "../domain/aggregate.account";
import { AccountRepository } from "../domain/repository.account";
import { AccountId } from "../domain/value-object.account-id";
import { AccountDoesNotExistError } from "../domain/error.account-does-not-exist";

export class FindAccountUseCase {
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
