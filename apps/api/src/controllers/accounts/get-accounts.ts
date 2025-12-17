import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchAccountsByUser } from "@repo/core/accounts/application/search-accounts-by-user";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { domainError, internalServerError } from "~/lib/http-response";

export const getAccountsSchema = z.object({
  userId: z.uuid(),
});

export type GetAccountsCtx = Context<
  Record<string, unknown>,
  "/",
  {
    in: {
      query: z.infer<typeof getAccountsSchema>;
    };
    out: {
      query: z.infer<typeof getAccountsSchema>;
    };
  }
>;

export const getAccountsController = async (c: GetAccountsCtx) => {
  try {
    const useCase = container.get(SearchAccountsByUser);
    const query = c.req.valid("query");

    const accounts = await useCase.execute({ userId: query.userId });
    const data = accounts.map((account) => account.toPrimitives());

    return c.json({ data }, 200);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
};
