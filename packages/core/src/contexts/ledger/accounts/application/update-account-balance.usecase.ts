import { InferDependencies } from "../../../../../di/autoregister";

import { AccountRepository } from "../domain/account-repository";
import { FindAccount } from "../domain/find-account.usecase";

type Params = {
  accountId: string;
  operation: "add" | "subtract";
  amount: number;
  currency: string;
};

@InferDependencies()
export class UpdateAccountBalance {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
  ) {}

  async execute({
    accountId,
    operation,
    amount,
    currency,
  }: Params): Promise<void> {
    const account = await this.findAccount.execute({ id: accountId });

    if (operation === "add") {
      account.addAmount(amount, currency);
    } else {
      account.subtractAmount(amount, currency);
    }

    await this.accountRepository.save(account);
  }
}
