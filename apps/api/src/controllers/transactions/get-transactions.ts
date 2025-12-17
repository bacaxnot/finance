import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchTransactionsByAccount } from "@repo/core/transactions/application/search-transactions-by-account";
import { SearchTransactionsByUser } from "@repo/core/transactions/application/search-transactions-by-user";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	badRequest,
	domainError,
	internalServerError,
	json,
} from "~/lib/http-response";

export const getTransactionsSchema = z.object({
	accountId: z.uuid().optional(),
	userId: z.uuid().optional(),
});

export type GetTransactionsCtx = Context<
	Record<string, unknown>,
	"/",
	{
		in: {
			query: z.infer<typeof getTransactionsSchema>;
		};
		out: {
			query: z.infer<typeof getTransactionsSchema>;
		};
	}
>;

export const getTransactionsController = async (c: GetTransactionsCtx) => {
	try {
		const query = c.req.valid("query");

		if (query.accountId && query.userId) {
			const useCase = container.get(SearchTransactionsByAccount);
			const data = await useCase.execute({
				userId: query.userId,
				accountId: query.accountId,
			});
			return json(c, { data });
		}

		if (query.userId) {
			const useCase = container.get(SearchTransactionsByUser);
			const data = await useCase.execute({ userId: query.userId });
			return json(c, { data });
		}

		return badRequest(
			c,
			"userId is required. Optionally provide accountId to filter by account.",
		);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
