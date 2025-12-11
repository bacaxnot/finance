import { AccountId } from "~/accounts/domain/account-id";
import type { Transaction } from "../domain/transaction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class ListTransactionsByAccount {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: {
    userId: string;
    accountId: string;
  }): Promise<Transaction[]> {
    const accountId = new AccountId(params.accountId);

    const transactions = await this.repository.searchByAccountId(accountId);

    return transactions.filter((transaction) =>
      transaction.belongsTo(params.userId),
    );
  }
}
