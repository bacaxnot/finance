import type { Account } from "~/accounts/domain/account";
import type { AccountRepository } from "~/accounts/domain/account-repository";
import { UserId } from "~/users/domain/user-id";

export class ListAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<Account[]> {
    const userId = new UserId(params.userId);
    return await this.accountRepository.searchByUserId(userId);
  }
}
