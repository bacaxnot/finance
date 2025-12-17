import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchCategoriesByUser } from "@repo/core/categories/application/search-categories-by-user";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { domainError, internalServerError } from "~/lib/http-response";

export const getCategoriesSchema = z.object({
  userId: z.uuid(),
});

export type GetCategoriesCtx = Context<
  Record<string, unknown>,
  "/",
  {
    in: {
      query: z.infer<typeof getCategoriesSchema>;
    };
    out: {
      query: z.infer<typeof getCategoriesSchema>;
    };
  }
>;

export const getCategoriesController = async (c: GetCategoriesCtx) => {
  try {
    const useCase = container.get(SearchCategoriesByUser);
    const query = c.req.valid("query");

    const data = await useCase.execute({ userId: query.userId });

    return c.json({ data }, 200);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
};
