import { InferDependencies } from "../../../../../di/autoregister";

import type { Account } from "../domain/account";
import { AccountDoesNotExistError } from "../domain/account-does-not-exist-error";
import { AccountId } from "../domain/account-id";
import { AccountRepository } from "../domain/account-repository";

@InferDependencies()
export class DeleteAccount {
  constructor(private readonly repository: AccountRepository) {}

  async execute(params: { userId: string; accountId: string }): Promise<void> {
    const accountId = new AccountId(params.accountId);
    const account = await this.repository.search(accountId);

    this.ensureAccountExists(account, params.accountId);
    this.ensureAccountBelongsToUser(account, params.userId);

    await this.repository.delete(accountId);
  }

  private ensureAccountExists(
    account: Account | null,
    accountId: string,
  ): asserts account is Account {
    if (account) return;
    throw new AccountDoesNotExistError(accountId);
  }

  private ensureAccountBelongsToUser(account: Account, userId: string): void {
    if (account.belongsTo(userId)) return;
    throw new Error("Account does not belong to user");
  }
}
