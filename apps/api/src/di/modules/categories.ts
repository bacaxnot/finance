import { CreateCategory } from "@repo/core/categories/application/create-category";
import { DeleteCategoryUseCase } from "@repo/core/categories/application/delete-category";
import { ListCategoriesByUser } from "@repo/core/categories/application/list-categories-by-user";
import { UpdateCategoryUseCase } from "@repo/core/categories/application/update-category";
import { CategoryRepository } from "@repo/core/categories/domain/category-repository";
import { CategoryRepositoryPostgres } from "@repo/core/categories/infrastructure/category-repository.postgres";
import type { ContainerBuilder } from "diod";

export function register(builder: ContainerBuilder) {
	// Repository
	builder.register(CategoryRepository).use(CategoryRepositoryPostgres);

	// Use cases
	builder
		.register(CreateCategory)
		.use(CreateCategory)
		.withDependencies([CategoryRepository]);

	builder
		.register(UpdateCategoryUseCase)
		.use(UpdateCategoryUseCase)
		.withDependencies([CategoryRepository]);

	builder
		.register(DeleteCategoryUseCase)
		.use(DeleteCategoryUseCase)
		.withDependencies([CategoryRepository]);

	builder
		.register(ListCategoriesByUser)
		.use(ListCategoriesByUser)
		.withDependencies([CategoryRepository]);
}
