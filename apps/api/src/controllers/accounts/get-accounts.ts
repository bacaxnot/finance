import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchAccountsByUser } from "@repo/core/accounts/application/search-accounts-by-user";
import type { Context } from "hono";
import { container } from "~/di";
import { domainError, internalServerError, json } from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export type GetAccountsCtx = Context<{ Variables: ProtectedVariables }, "/">;

export const getAccountsController = async (c: GetAccountsCtx) => {
  try {
    const useCase = container.get(SearchAccountsByUser);
    const user = c.get("user");

    const data = await useCase.execute({ userId: user.id });

    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
};
