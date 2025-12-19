import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateAccount } from "@repo/core/accounts/application/create-account";
import { z } from "zod";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putAccountParamsSchema = z.object({
  id: z.uuid(),
});

export const putAccountBodySchema = z.object({
  name: z.string().min(1),
  currency: z.string(),
  initialBalance: z.number(),
});

export const putAccountHandlers = factory.createHandlers(
  zValidator("param", putAccountParamsSchema),
  zValidator("json", putAccountBodySchema),
  async (c) => {
    try {
      const useCase = container.get(CreateAccount);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        id: params.id,
        userId: user.id,
        name: body.name,
        currency: body.currency,
        initialBalance: body.initialBalance,
      });

      return created(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      return internalServerError(c);
    }
  },
);
