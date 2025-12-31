import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateTransactionUseCase } from "@repo/core/ledger/transactions/application/update-transaction";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const patchTransactionParamsSchema = z.object({
  id: z.uuid(),
});

export const patchTransactionBodySchema = z.object({
  amount: z.number().optional(),
  direction: z.enum(["inbound", "outbound"]).optional(),
  description: z.string().optional(),
  transactionDate: z.string().optional(),
  notes: z.string().nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
});

/**
 * @summary Update transaction
 * @description Modify transaction details partially
 */
export const patchTransactionHandlers = factory.createHandlers(
  zValidator("param", patchTransactionParamsSchema),
  zValidator("json", patchTransactionBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateTransactionUseCase);
      const params = c.req.valid("param");
      const body = c.req.valid("json");

      await useCase.execute(params.id, {
        amount: body.amount,
        direction: body.direction,
        description: body.description,
        transactionDate: body.transactionDate,
        notes: body.notes,
        categoryId: body.categoryId,
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
