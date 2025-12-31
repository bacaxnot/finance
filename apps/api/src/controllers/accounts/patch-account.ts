import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateAccountUseCase } from "@repo/core/ledger/accounts/application/update-account";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const patchAccountParamsSchema = z.object({
  id: z.uuid(),
});

export const patchAccountBodySchema = z.object({
  name: z.string().min(1),
});

/**
 * @summary Update account
 * @description Change name of account
 */
export const patchAccountHandlers = factory.createHandlers(
  zValidator("param", patchAccountParamsSchema),
  zValidator("json", patchAccountBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateAccountUseCase);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
        accountId: params.id,
        name: body.name,
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
