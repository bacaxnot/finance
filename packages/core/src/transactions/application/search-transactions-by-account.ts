import { AccountId } from "~/accounts/domain/account-id";
import type { TransactionPrimitives } from "../domain/transaction";
import type { TransactionRepository } from "../domain/transaction-repository";

export class SearchTransactionsByAccount {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(params: {
    userId: string;
    accountId: string;
  }): Promise<TransactionPrimitives[]> {
    const accountId = new AccountId(params.accountId);

    const transactions = await this.repository.searchByAccountId(accountId);

    return transactions
      .filter((transaction) => transaction.belongsTo(params.userId))
      .map((transaction) => transaction.toPrimitives());
  }
}
