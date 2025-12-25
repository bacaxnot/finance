import { AccountRepository } from "@repo/core/ledger/accounts/domain/account-repository";
import { FindAccount } from "@repo/core/ledger/accounts/domain/find-account";
import { CreateTransactionUseCase } from "@repo/core/ledger/transactions/application/create-transaction";
import { DeleteTransactionUseCase } from "@repo/core/ledger/transactions/application/delete-transaction";
import { SearchTransactionsByAccount } from "@repo/core/ledger/transactions/application/search-transactions-by-account";
import { SearchTransactionsByUser } from "@repo/core/ledger/transactions/application/search-transactions-by-user";
import { UpdateTransactionUseCase } from "@repo/core/ledger/transactions/application/update-transaction";
import { FindTransaction } from "@repo/core/ledger/transactions/domain/find-transaction";
import { TransactionRepository } from "@repo/core/ledger/transactions/domain/transaction-repository";
import { TransactionRepositoryPostgres } from "@repo/core/ledger/transactions/infrastructure/transaction-repository.postgres";
import type { ContainerBuilder } from "diod";

export function register(builder: ContainerBuilder) {
  // Repository
  builder.register(TransactionRepository).use(TransactionRepositoryPostgres);

  // Use cases
  builder
    .register(FindTransaction)
    .use(FindTransaction)
    .withDependencies([TransactionRepository]);

  builder
    .register(CreateTransactionUseCase)
    .use(CreateTransactionUseCase)
    .withDependencies([TransactionRepository, AccountRepository, FindAccount]);

  builder
    .register(UpdateTransactionUseCase)
    .use(UpdateTransactionUseCase)
    .withDependencies([
      TransactionRepository,
      AccountRepository,
      FindAccount,
      FindTransaction,
    ]);

  builder
    .register(DeleteTransactionUseCase)
    .use(DeleteTransactionUseCase)
    .withDependencies([
      TransactionRepository,
      AccountRepository,
      FindAccount,
      FindTransaction,
    ]);

  builder
    .register(SearchTransactionsByAccount)
    .use(SearchTransactionsByAccount)
    .withDependencies([TransactionRepository]);

  builder
    .register(SearchTransactionsByUser)
    .use(SearchTransactionsByUser)
    .withDependencies([TransactionRepository]);
}
