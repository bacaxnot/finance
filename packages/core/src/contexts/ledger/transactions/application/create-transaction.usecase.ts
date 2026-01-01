import { InferDependencies } from "../../../../../di/autoregister";

import { EventBus } from "../../../../shared/domain/event-bus";
import type { Account } from "../../accounts/domain/account";
import { FindAccount } from "../../accounts/domain/find-account.usecase";
import { CurrencyMismatchError } from "../domain/currency-mismatch-error";
import { Transaction } from "../domain/transaction";
import type { TransactionDirectionType } from "../domain/transaction-direction";
import { TransactionRepository } from "../domain/transaction-repository";

export type CreateTransactionPayload = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  amount: number;
  currency: string;
  direction: TransactionDirectionType;
  description: string;
  date: string;
  notes: string | null;
};

@InferDependencies()
export class CreateTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly findAccount: FindAccount,
    private readonly eventBus: EventBus,
  ) {}

  async execute(payload: CreateTransactionPayload): Promise<void> {
    const { currency, amount, ...params } = payload;

    const account = await this.findAccount.execute({ id: payload.accountId });
    this.ensureCurrencyMatches(account, currency);

    const transaction = Transaction.create({
      ...params,
      amount: { amount, currency },
    });
    await this.transactionRepository.save(transaction);

    const events = transaction.pullDomainEvents();
    await this.eventBus.publish(events);
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
