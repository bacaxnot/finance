import { AccountRepository } from "~/accounts/domain/repository.account";
import { FindAccount } from "~/accounts/application/use-case.find-account";
import { Transaction } from "~/transactions/domain/aggregate.transaction";
import { TransactionRepository } from "~/transactions/domain/repository.transaction";
import { TransactionId } from "~/transactions/domain/value-object.transaction-id";
import { FindTransaction } from "~/transactions/application/use-case.find-transaction";
import { Account } from "~/accounts/domain/aggregate.account";

export class DeleteTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
    private readonly findTransaction: FindTransaction
  ) {}

  async execute(params: {
    id: string;
    userId: string;
  }): Promise<void> {
    const transaction = await this.getTransaction(params.id);
    const account = await this.getTransactionAccount(transaction);

    const amount = transaction.getAmount();
    const direction = transaction.getDirection();
    account.reverseTransaction(amount.amount, amount.currency, direction);

    await this.accountRepository.save(account);

    const transactionId = new TransactionId(params.id);
    await this.transactionRepository.delete(transactionId);
  }

  private getTransaction(id: string): Promise<Transaction> {
    return this.findTransaction.execute({ id });
  }

  private getTransactionAccount(transaction: Transaction): Promise<Account> {
    const accountId = transaction.getAccountId();
    return this.findAccount.execute({ id: accountId });
  }
}
