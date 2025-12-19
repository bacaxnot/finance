import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateTransactionUseCase } from "@repo/core/transactions/application/create-transaction";
import { z } from "zod";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putTransactionParamsSchema = z.object({
  id: z.uuid(),
});

export const putTransactionBodySchema = z.object({
  accountId: z.uuid(),
  categoryId: z.uuid().nullable(),
  amount: z.number(),
  currency: z.string(),
  direction: z.enum(["inbound", "outbound"]),
  description: z.string(),
  transactionDate: z.string(),
  notes: z.string().nullable(),
});

/**
 * @summary Upsert transaction
 * @description Create transaction with detailed financial information
 */
export const putTransactionHandlers = factory.createHandlers(
  zValidator("param", putTransactionParamsSchema),
  zValidator("json", putTransactionBodySchema),
  async (c) => {
    try {
      const useCase = container.get(CreateTransactionUseCase);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        id: params.id,
        userId: user.id,
        accountId: body.accountId,
        categoryId: body.categoryId || null,
        amount: body.amount,
        currency: body.currency,
        direction: body.direction,
        description: body.description,
        transactionDate: body.transactionDate,
        notes: body.notes || null,
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
