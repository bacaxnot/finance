import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchCategoriesByUser } from "@repo/core/categories/application/search-categories-by-user";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

/**
 * @summary List categories
 * @description Retrieve user's categories
 */
export const getCategoriesHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchCategoriesByUser);
    const user = c.get("user");

    const data = await useCase.execute({ userId: user.id });

    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
});
