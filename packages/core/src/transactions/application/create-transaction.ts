import type { FindAccount } from "~/accounts/application/find-account";
import type { Account } from "~/accounts/domain/account";
import type { AccountRepository } from "~/accounts/domain/account-repository";
import { CurrencyMismatchError } from "../domain/currency-mismatch-error";
import { Transaction } from "../domain/transaction";
import type { TransactionDirectionType } from "../domain/transaction-direction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class CreateTransactionUseCase {
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
      date: params.transactionDate as `${number}${number}${number}${number}-${number}${number}-${number}${number}T${number}${number}:${number}${number}:${number}${number}.${number}${number}${number}Z`,
      notes: params.notes,
    });

    account.applyTransaction(params.amount, params.currency, params.direction);

    await this.transactionRepository.save(transaction);
    await this.accountRepository.save(account);
  }

  private ensureAccountBelongsToUser(account: Account, userId: string): void {
    if (account.belongsTo(userId)) return;
    // TODO: Authorization pattern to be defined
    throw new Error("Account does not belong to user");
  }

  private ensureCurrencyMatches(account: Account, currency: string): void {
    if (account.hasCurrency(currency)) return;
    const accountPrimitives = account.toPrimitives();
    throw new CurrencyMismatchError(
      accountPrimitives.currentBalance.currency,
      currency,
    );
  }
}
