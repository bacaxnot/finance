import { UserId } from "~/users/domain/user-id";
import { Account } from "~/accounts/domain/account";
import { AccountRepository } from "~/accounts/domain/account-repository";

export class ListAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<Account[]> {
    const userId = new UserId(params.userId);
    return await this.accountRepository.searchByUserId(userId);
  }
}
