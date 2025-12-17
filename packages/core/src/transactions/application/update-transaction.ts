import type { Account } from "~/accounts/domain/account";
import type { AccountRepository } from "~/accounts/domain/account-repository";
import type { FindAccount } from "~/accounts/domain/find-account";
import { CurrencyMismatchError } from "../domain/currency-mismatch-error";
import type { FindTransaction } from "../domain/find-transaction";
import type {
  Transaction,
  UpdateTransactionPrimitives,
} from "../domain/transaction";
import type { TransactionDirectionType } from "../domain/transaction-direction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
    private readonly findTransaction: FindTransaction,
  ) {}

  async execute(
    params: UpdateTransactionPrimitives & { id: string },
  ): Promise<void> {
    const transaction = await this.getTransaction(params.id);
    const account = await this.getTransactionAccount(transaction);

    this.ensureCurrencyMatches(account, params.currency);

    if (this.needsBalanceRecalculation(params)) {
      await this.recalculateBalance(account, transaction, params);
    }

    transaction.update({ ...params });

    await this.transactionRepository.save(transaction);
  }

  private getTransactionAccount(transaction: Transaction): Promise<Account> {
    const transactionPrimitives = transaction.toPrimitives();
    return this.findAccount.execute({ id: transactionPrimitives.accountId });
  }

  private getTransaction(id: string): Promise<Transaction> {
    return this.findTransaction.execute({ id });
  }

  private needsBalanceRecalculation(params: {
    amount?: number;
    direction?: TransactionDirectionType;
  }): boolean {
    return params.amount !== undefined || params.direction !== undefined;
  }

  private async recalculateBalance(
    account: Account,
    transaction: Transaction,
    params: {
      amount?: number;
      currency?: string;
      direction?: TransactionDirectionType;
    },
  ): Promise<void> {
    const transactionPrimitives = transaction.toPrimitives();
    const oldAmount = transactionPrimitives.amount;
    const oldDirection = transactionPrimitives.direction;

    account.reverseTransaction(
      oldAmount.amount,
      oldAmount.currency,
      oldDirection,
    );

    const newAmount =
      params.amount !== undefined ? params.amount : oldAmount.amount;
    const newCurrency =
      params.currency !== undefined ? params.currency : oldAmount.currency;
    const newDirection =
      params.direction !== undefined ? params.direction : oldDirection;

    account.applyTransaction(newAmount, newCurrency, newDirection);

    await this.accountRepository.save(account);
  }

  private ensureCurrencyMatches(account: Account, currency?: string): void {
    if (!currency) return;
    if (account.hasCurrency(currency)) return;
    const accountPrimitives = account.toPrimitives();
    throw new CurrencyMismatchError(
      accountPrimitives.currentBalance.currency,
      currency,
    );
  }
}
