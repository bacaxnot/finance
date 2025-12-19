import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { UpdateTransactionUseCase } from "@repo/core/transactions/application/update-transaction";
import { z } from "zod";
import { container } from "~/di";
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
  currency: z.string().optional(),
  direction: z.enum(["inbound", "outbound"]).optional(),
  description: z.string().optional(),
  transactionDate: z.string().optional(),
  notes: z.string().nullable().optional(),
  categoryId: z.uuid().nullable().optional(),
});

export const patchTransactionHandlers = factory.createHandlers(
  zValidator("param", patchTransactionParamsSchema),
  zValidator("json", patchTransactionBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateTransactionUseCase);
      const params = c.req.valid("param");
      const body = c.req.valid("json");

      await useCase.execute({
        id: params.id,
        amount: body.amount,
        currency: body.currency,
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
