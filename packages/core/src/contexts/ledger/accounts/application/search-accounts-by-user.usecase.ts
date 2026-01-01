import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { AccountPrimitives } from "../domain/account";
import { AccountRepository } from "../domain/account-repository";

@InferDependencies()
export class SearchAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: { userId: string }): Promise<AccountPrimitives[]> {
    const userId = new UserId(params.userId);
    const accounts = await this.accountRepository.searchByUserId(userId);
    return accounts.map((account) => account.toPrimitives());
  }
}
