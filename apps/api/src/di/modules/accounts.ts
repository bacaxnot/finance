import { CreateAccount } from "@repo/core/ledger/accounts/application/create-account";
import { DeleteAccountUseCase } from "@repo/core/ledger/accounts/application/delete-account";
import { SearchAccountsByUser } from "@repo/core/ledger/accounts/application/search-accounts-by-user";
import { UpdateAccountUseCase } from "@repo/core/ledger/accounts/application/update-account";
import { AccountRepository } from "@repo/core/ledger/accounts/domain/account-repository";
import { FindAccount } from "@repo/core/ledger/accounts/domain/find-account";
import { AccountRepositoryPostgres } from "@repo/core/ledger/accounts/infrastructure/account-repository.postgres";
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

  builder
    .register(UpdateAccountUseCase)
    .use(UpdateAccountUseCase)
    .withDependencies([AccountRepository]);

  builder
    .register(DeleteAccountUseCase)
    .use(DeleteAccountUseCase)
    .withDependencies([AccountRepository]);
}
