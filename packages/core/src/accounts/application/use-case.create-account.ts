import { UserId } from "~/users/domain/value-object.user-id";
import { Account } from "../domain/aggregate.account";
import { AccountRepository } from "../domain/repository.account";

export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(params: {
    id: string;
    userId: string;
    name: string;
    initialBalanceAmount: number;
    currency: string;
  }): Promise<void> {
    const account = Account.create({
      id: params.id,
      userId: params.userId,
      name: params.name,
      initialBalance: {
        amount: params.initialBalanceAmount,
        currency: params.currency,
      },
    });

    await this.accountRepository.save(account);
  }
}
