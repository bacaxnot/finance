import { AccountRepository } from "@repo/core/accounts/domain/account-repository";
import { FindAccount } from "@repo/core/accounts/domain/find-account";
import { CreateTransactionUseCase } from "@repo/core/transactions/application/create-transaction";
import { DeleteTransactionUseCase } from "@repo/core/transactions/application/delete-transaction";
import { SearchTransactionsByAccount } from "@repo/core/transactions/application/search-transactions-by-account";
import { SearchTransactionsByUser } from "@repo/core/transactions/application/search-transactions-by-user";
import { UpdateTransactionUseCase } from "@repo/core/transactions/application/update-transaction";
import { FindTransaction } from "@repo/core/transactions/domain/find-transaction";
import { TransactionRepository } from "@repo/core/transactions/domain/transaction-repository";
import { TransactionRepositoryPostgres } from "@repo/core/transactions/infrastructure/transaction-repository.postgres";
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
