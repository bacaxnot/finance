import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { FindUser } from "@repo/core/users/application/find-user";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	domainError,
	internalServerError,
	json,
} from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export const getMeResponseSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type GetMeCtx = Context<
	{ Variables: ProtectedVariables },
	"/",
	{
		out: {
			json: z.infer<typeof getMeResponseSchema>;
		};
	}
>;

export const getMeController = async (c: GetMeCtx) => {
	try {
		const useCase = container.get(FindUser);
		const user = c.get("user");

		const result = await useCase.execute({
			userId: user.id,
		});

		return json(c, result);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
