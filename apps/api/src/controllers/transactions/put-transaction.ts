import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateTransactionUseCase } from "@repo/core/transactions/application/create-transaction";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putTransactionSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	accountId: z.uuid(),
	categoryId: z.uuid().nullable(),
	amount: z.number(),
	currency: z.string(),
	direction: z.enum(["income", "expense"]),
	description: z.string(),
	transactionDate: z.string(),
	notes: z.string().nullable(),
});

export type PutTransactionCtx = Context<
	Record<string, unknown>,
	"/",
	{
		in: {
			json: z.infer<typeof putTransactionSchema>;
		};
		out: {
			json: z.infer<typeof putTransactionSchema>;
		};
	}
>;

export const putTransactionController = async (c: PutTransactionCtx) => {
	try {
		const useCase = container.get(CreateTransactionUseCase);
		const body = c.req.valid("json");

		await useCase.execute({
			id: body.id,
			userId: body.userId,
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
};
