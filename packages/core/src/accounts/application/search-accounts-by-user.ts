import type { AccountPrimitives } from "~/accounts/domain/account";
import type { AccountRepository } from "~/accounts/domain/account-repository";
import { UserId } from "~/users/domain/user-id";

export class SearchAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<AccountPrimitives[]> {
    const userId = new UserId(params.userId);
    const accounts = await this.accountRepository.searchByUserId(userId);
    return accounts.map((account) => account.toPrimitives());
  }
}
