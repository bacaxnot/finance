import { CreateAccount } from "@repo/core/accounts/application/create-account";
import { FindAccount } from "@repo/core/accounts/application/find-account";
import { ListAccountsByUser } from "@repo/core/accounts/application/list-accounts-by-user";
import { AccountRepository } from "@repo/core/accounts/domain/account-repository";
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
		.register(ListAccountsByUser)
		.use(ListAccountsByUser)
		.withDependencies([AccountRepository]);
}
