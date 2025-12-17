import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { DeleteTransactionUseCase } from "@repo/core/transactions/application/delete-transaction";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	domainError,
	internalServerError,
	noContent,
} from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export const deleteTransactionParamsSchema = z.object({
	id: z.uuid(),
});

export type DeleteTransactionCtx = Context<
	{ Variables: ProtectedVariables },
	"/:id",
	{
		in: {
			param: z.infer<typeof deleteTransactionParamsSchema>;
		};
		out: {
			param: z.infer<typeof deleteTransactionParamsSchema>;
		};
	}
>;

export const deleteTransactionController = async (c: DeleteTransactionCtx) => {
	try {
		const useCase = container.get(DeleteTransactionUseCase);
		const params = c.req.valid("param");

		await useCase.execute({ id: params.id });

		return noContent(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
