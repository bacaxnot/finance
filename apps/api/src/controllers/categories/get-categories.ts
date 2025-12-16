import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { ListCategoriesByUser } from "@repo/core/categories/application/list-categories-by-user";
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
    const useCase = container.get(ListCategoriesByUser);
    const query = c.req.valid("query");

    const categories = await useCase.execute({ userId: query.userId });
    const data = categories.map((category) => category.toPrimitives());

    return c.json({ data }, 200);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
};
