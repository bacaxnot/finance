import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { UpdateUser } from "@repo/core/users/application/update-user";
import { z } from "zod";
import { container } from "~/di";
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
