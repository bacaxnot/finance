import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { UpdateAccountUseCase } from "@repo/core/accounts/application/update-account";
import { z } from "zod";
import { container } from "~/di";
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
