import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DeleteAccount } from "@repo/core/ledger/accounts/application/delete-account.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const deleteAccountParamsSchema = z.object({
  id: z.uuid(),
});

/**
 * @summary Delete account
 * @description Remove account permanently
 */
export const deleteAccountHandlers = factory.createHandlers(
  zValidator("param", deleteAccountParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteAccount);
      const params = c.req.valid("param");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
        accountId: params.id,
      });

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      return internalServerError(c);
    }
  },
);
