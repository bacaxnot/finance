import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DeleteTransactionUseCase } from "@repo/core/ledger/transactions/application/delete-transaction";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const deleteTransactionParamsSchema = z.object({
  id: z.uuid(),
});

/**
 * @summary Delete transaction
 * @description Remove transaction permanently
 */
export const deleteTransactionHandlers = factory.createHandlers(
  zValidator("param", deleteTransactionParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteTransactionUseCase);
      const params = c.req.valid("param");

      await useCase.execute(params.id);

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      return internalServerError(c);
    }
  },
);
