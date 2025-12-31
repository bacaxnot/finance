import { container } from "@repo/core/container";
import { FindUser } from "@repo/core/ledger/users/application/find-user";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

/**
 * @summary Get user
 * @description Retrieve user profile information
 */
export const getMeHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(FindUser);
    const user = c.get("user");

    const result = await useCase.execute({
      userId: user.id,
    });

    return json(c, result);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }

    return internalServerError(c);
  }
});
