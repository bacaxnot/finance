import { CreateCategory } from "@repo/core/ledger/categories/application/create-category";
import { DeleteCategoryUseCase } from "@repo/core/ledger/categories/application/delete-category";
import { SearchCategoriesByUser } from "@repo/core/ledger/categories/application/search-categories-by-user";
import { UpdateCategoryUseCase } from "@repo/core/ledger/categories/application/update-category";
import { CategoryRepository } from "@repo/core/ledger/categories/domain/category-repository";
import { CategoryRepositoryPostgres } from "@repo/core/ledger/categories/infrastructure/category-repository.postgres";
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
    .register(SearchCategoriesByUser)
    .use(SearchCategoriesByUser)
    .withDependencies([CategoryRepository]);
}
