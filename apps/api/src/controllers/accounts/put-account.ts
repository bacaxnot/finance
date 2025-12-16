import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateAccount } from "@repo/core/accounts/application/create-account";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putAccountSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	name: z.string().min(1),
	currency: z.string(),
	initialBalance: z.number(),
});

export type PutAccountCtx = Context<
	Record<string, unknown>,
	"/",
	{
		in: {
			json: z.infer<typeof putAccountSchema>;
		};
		out: {
			json: z.infer<typeof putAccountSchema>;
		};
	}
>;

export const putAccountController = async (c: PutAccountCtx) => {
	try {
		const useCase = container.get(CreateAccount);
		const body = c.req.valid("json");

		await useCase.execute({
			id: body.id,
			userId: body.userId,
			name: body.name,
			currency: body.currency,
			initialBalance: body.initialBalance,
		});

		return created(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
