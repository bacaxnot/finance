import { Account } from "../domain/account";
import type { AccountRepository } from "../domain/account-repository";

export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;
    userId: string;
    name: string;
    currency: string;
    initialBalance: number;
  }): Promise<void> {
    const account = Account.create({
      id: params.id,
      userId: params.userId,
      name: params.name,
      currency: params.currency,
      initialBalance: params.initialBalance,
    });

    await this.accountRepository.save(account);
  }
}
