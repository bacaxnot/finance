import { AccountId } from "~/accounts/domain/value-object.account-id";
import { TransactionRepository } from "../domain/repository.transaction";
import { Transaction } from "../domain/aggregate.transaction";

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
