import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchAccountsByUser } from "@repo/core/accounts/application/search-accounts-by-user";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

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
