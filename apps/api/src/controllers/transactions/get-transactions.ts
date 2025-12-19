import { zValidator } from "@hono/zod-validator";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchTransactionsByAccount } from "@repo/core/transactions/application/search-transactions-by-account";
import { SearchTransactionsByUser } from "@repo/core/transactions/application/search-transactions-by-user";
import { z } from "zod";
import { container } from "~/di";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

export const getTransactionsSchema = z.object({
  accountId: z.uuid().optional(),
});

/**
 * @summary List transactions
 * @description Retrieve transactions by account or all accounts
 */
export const getTransactionsHandlers = factory.createHandlers(
  zValidator("query", getTransactionsSchema),
  async (c) => {
    try {
      const query = c.req.valid("query");
      const user = c.get("user");

      if (query.accountId) {
        const useCase = container.get(SearchTransactionsByAccount);
        const data = await useCase.execute({
          userId: user.id,
          accountId: query.accountId,
        });
        return json(c, { data });
      }

      const useCase = container.get(SearchTransactionsByUser);
      const data = await useCase.execute({ userId: user.id });
      return json(c, { data });
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }

      return internalServerError(c);
    }
  },
);
