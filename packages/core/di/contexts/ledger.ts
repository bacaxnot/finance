import { AccountRepository } from "@repo/core/ledger/accounts/domain/account-repository";
import { AccountRepositoryPostgres } from "@repo/core/ledger/accounts/infrastructure/account-repository.postgres";
import { CategoryRepository } from "@repo/core/ledger/categories/domain/category-repository";
import { CategoryRepositoryPostgres } from "@repo/core/ledger/categories/infrastructure/category-repository.postgres";
import { TransactionRepository } from "@repo/core/ledger/transactions/domain/transaction-repository";
import { TransactionRepositoryPostgres } from "@repo/core/ledger/transactions/infrastructure/transaction-repository.postgres";
import { UserRepository } from "@repo/core/ledger/users/domain/user-repository";
import { UserRepositoryPostgres } from "@repo/core/ledger/users/infrastructure/repository.user.postgres";
import type { ContainerBuilder } from "diod";

export function register(builder: ContainerBuilder) {
  builder.register(AccountRepository).use(AccountRepositoryPostgres);
  builder.register(CategoryRepository).use(CategoryRepositoryPostgres);
  builder.register(TransactionRepository).use(TransactionRepositoryPostgres);
  builder.register(UserRepository).use(UserRepositoryPostgres);
}
