import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateAccount } from "@repo/core/accounts/application/create-account";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { created, domainError, internalServerError } from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export const putAccountSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	currency: z.string(),
	initialBalance: z.number(),
});

export type PutAccountCtx = Context<
	{ Variables: ProtectedVariables },
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
		const user = c.get("user");

		await useCase.execute({
			id: body.id,
			userId: user.id,
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
