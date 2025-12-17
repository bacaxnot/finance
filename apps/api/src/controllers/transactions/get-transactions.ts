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

		if (query.accountId) {
			const useCase = container.get(SearchTransactionsByAccount);
			const transactions = await useCase.execute({
				accountId: query.accountId,
			});
			const data = transactions.map((transaction) =>
				transaction.toPrimitives(),
			);
			return json(c, { data });
		}

		if (query.userId) {
			const useCase = container.get(SearchTransactionsByUser);
			const transactions = await useCase.execute({ userId: query.userId });
			const data = transactions.map((transaction) =>
				transaction.toPrimitives(),
			);
			return json(c, { data });
		}

		return badRequest(
			c,
			"Either accountId or userId query parameter is required",
		);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
