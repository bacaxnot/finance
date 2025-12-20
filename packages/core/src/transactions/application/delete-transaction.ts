import type { Account } from "../../accounts/domain/account";
import type { AccountRepository } from "../../accounts/domain/account-repository";
import type { FindAccount } from "../../accounts/domain/find-account";
import type { FindTransaction } from "../domain/find-transaction";
import type { Transaction } from "../domain/transaction";
import { TransactionId } from "../domain/transaction-id";
import type { TransactionRepository } from "../domain/transaction-repository";

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly findAccount: FindAccount,
    private readonly findTransaction: FindTransaction,
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
