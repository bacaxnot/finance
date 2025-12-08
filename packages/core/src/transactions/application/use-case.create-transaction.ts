
import { Account } from "~/accounts/domain/aggregate.account";
import { AccountRepository } from "~/accounts/domain/repository.account";
import { FindAccount } from "~/accounts/application/use-case.find-account";
import { UnauthorizedAccountAccessException } from "~/accounts/domain/exceptions";
import { TransactionRepository } from "../domain/repository.transaction";
import { Transaction } from "../domain/aggregate.transaction";
import { TransactionDirectionType } from "../domain/value-object.transaction-direction";
import { CurrencyMismatchException } from "../domain/exceptions";

export class CreateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
  ) {}

  async execute(params: {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: number;
    currency: string;
    direction: TransactionDirectionType;
    description: string;
    transactionDate: string;
    notes: string | null;
  }): Promise<void> {
    const account = await this.findAccount.execute({ id: params.accountId });

    this.ensureAccountBelongsToUser(account, params.userId);
    this.ensureCurrencyMatches(account, params.currency);

    const transaction = Transaction.create({
      id: params.id,
      userId: params.userId,
      accountId: params.accountId,
      categoryId: params.categoryId,
      amount: { amount: params.amount, currency: params.currency },
      direction: params.direction,
      description: params.description,
      transactionDate: params.transactionDate,
      notes: params.notes,
    });

    account.applyTransaction(params.amount, params.currency, params.direction);

    await this.transactionRepository.save(transaction);
    await this.accountRepository.save(account);
  }

  private ensureAccountBelongsToUser(account: Account, userId: string): void {
    if (account.belongsTo(userId)) return;
    throw new UnauthorizedAccountAccessException(
      "Account does not belong to user"
    );
  }

  private ensureCurrencyMatches(account: Account, currency: string): void {
    if (account.hasCurrency(currency)) return;
    throw new CurrencyMismatchException(
      "Transaction currency must match account currency"
    );
  }
}
