import type { AccountRepository } from "../domain/account-repository";
import type { FindAccount } from "../domain/find-account";

type Params = {
  accountId: string;
  operation: "add" | "subtract";
  amount: number;
  currency: string;
};

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
