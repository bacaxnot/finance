import { UserId } from "~/users/domain/value-object.user-id";
import { Account } from "~/accounts/domain/aggregate.account";
import { AccountRepository } from "~/accounts/domain/repository.account";

export class ListAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<Account[]> {
    const userId = new UserId(params.userId);
    return await this.accountRepository.searchByUserId(userId);
  }
}
