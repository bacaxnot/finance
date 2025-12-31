import { FindUser } from "@repo/core/ledger/users/application/find-user";
import { UpdateUser } from "@repo/core/ledger/users/application/update-user";
import { UserRepository } from "@repo/core/ledger/users/domain/user-repository";
import { UserRepositoryPostgres } from "@repo/core/ledger/users/infrastructure/repository.user.postgres";
import type { ContainerBuilder } from "diod";

export function register(builder: ContainerBuilder) {
  // Repository
  builder.register(UserRepository).use(UserRepositoryPostgres);

  // Use cases
  builder.register(FindUser).use(FindUser).withDependencies([UserRepository]);

  builder
    .register(UpdateUser)
    .use(UpdateUser)
    .withDependencies([UserRepository]);
}
