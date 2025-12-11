import { AccountId } from "~/accounts/domain/account-id";
import { TransactionRepository } from "../domain/transaction-repository";
import { Transaction } from "../domain/transaction";

export class ListTransactionsByAccount {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: {
    userId: string;
    accountId: string;
  }): Promise<Transaction[]> {
    const accountId = new AccountId(params.accountId);

    const transactions = await this.repository.searchByAccountId(
      accountId
    );

    return transactions.filter((transaction) => transaction.belongsTo(params.userId));
  }
}
