import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { SearchTransactionsByAccount } from "@repo/core/transactions/application/search-transactions-by-account";
import { SearchTransactionsByUser } from "@repo/core/transactions/application/search-transactions-by-user";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	domainError,
	internalServerError,
	json,
} from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export const getTransactionsSchema = z.object({
	accountId: z.uuid().optional(),
});

export type GetTransactionsCtx = Context<
	{ Variables: ProtectedVariables },
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
};
