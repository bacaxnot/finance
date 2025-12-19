import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { DeleteTransactionUseCase } from "@repo/core/transactions/application/delete-transaction";
import { z } from "zod";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const deleteTransactionParamsSchema = z.object({
  id: z.uuid(),
});

export const deleteTransactionHandlers = factory.createHandlers(
  zValidator("param", deleteTransactionParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteTransactionUseCase);
      const params = c.req.valid("param");
      const user = c.get("user");

      await useCase.execute({ userId: user.id, id: params.id });

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      return internalServerError(c);
    }
  },
);
