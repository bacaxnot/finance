import { container } from "@repo/core/container";
import { SearchAccountsByUser } from "@repo/core/ledger/accounts/application/search-accounts-by-user.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

/**
 * @summary List accounts
 * @description Retrieve user accounts with balances
 * @tags Accounts
 */
export const getAccountsHandlers = factory.createHandlers(async (c) => {
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
});
