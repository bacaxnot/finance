import { AccountRepository } from "~/accounts/domain/account-repository";
import { FindAccount } from "~/accounts/application/find-account";
import { Transaction } from "~/transactions/domain/transaction";
import { TransactionRepository } from "~/transactions/domain/transaction-repository";
import { TransactionId } from "~/transactions/domain/transaction-id";
import { FindTransactionUseCase } from "~/transactions/application/find-transaction";
import { Account } from "~/accounts/domain/account";

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
    private readonly findTransaction: FindTransactionUseCase,
  ) {}

  async execute(params: { id: string; userId: string }): Promise<void> {
    const transaction = await this.getTransaction(params.id);
    const account = await this.getTransactionAccount(transaction);

    const transactionPrimitives = transaction.toPrimitives();
    account.reverseTransaction(
      transactionPrimitives.amount.amount,
      transactionPrimitives.amount.currency,
      transactionPrimitives.direction,
    );

    await this.accountRepository.save(account);

    const transactionId = new TransactionId(params.id);
    await this.transactionRepository.delete(transactionId);
  }

  private getTransaction(id: string): Promise<Transaction> {
    return this.findTransaction.execute({ id });
  }

  private getTransactionAccount(transaction: Transaction): Promise<Account> {
    const transactionPrimitives = transaction.toPrimitives();
    return this.findAccount.execute({ id: transactionPrimitives.accountId });
  }
}
