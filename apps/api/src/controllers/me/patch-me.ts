import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateUser } from "@repo/core/ledger/users/application/update-user.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const patchMeBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

/**
 * @summary Update user
 * @description Update user profile information
 */
export const patchMeHandlers = factory.createHandlers(
  zValidator("json", patchMeBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateUser);
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
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
