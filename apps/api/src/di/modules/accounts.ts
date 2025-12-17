import { CreateAccount } from "@repo/core/accounts/application/create-account";
import { SearchAccountsByUser } from "@repo/core/accounts/application/search-accounts-by-user";
import { AccountRepository } from "@repo/core/accounts/domain/account-repository";
import { FindAccount } from "@repo/core/accounts/domain/find-account";
import { AccountRepositoryPostgres } from "@repo/core/accounts/infrastructure/account-repository.postgres";
import type { ContainerBuilder } from "diod";

export function register(builder: ContainerBuilder) {
  // Repository
  builder.register(AccountRepository).use(AccountRepositoryPostgres);

  // Use cases
  builder
    .register(FindAccount)
    .use(FindAccount)
    .withDependencies([AccountRepository]);

  builder
    .register(CreateAccount)
    .use(CreateAccount)
    .withDependencies([AccountRepository]);

  builder
    .register(SearchAccountsByUser)
    .use(SearchAccountsByUser)
    .withDependencies([AccountRepository]);
}
