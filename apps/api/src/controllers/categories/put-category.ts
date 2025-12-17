import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateCategory } from "@repo/core/categories/application/create-category";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { created, domainError, internalServerError } from "~/lib/http-response";
import type { ProtectedVariables } from "~/types/app";

export const putCategorySchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
});

export type PutCategoryCtx = Context<
	{ Variables: ProtectedVariables },
	"/",
	{
		in: {
			json: z.infer<typeof putCategorySchema>;
		};
		out: {
			json: z.infer<typeof putCategorySchema>;
		};
	}
>;

export const putCategoryController = async (c: PutCategoryCtx) => {
	try {
		const useCase = container.get(CreateCategory);
		const body = c.req.valid("json");
		const user = c.get("user");

		await useCase.execute({
			id: body.id,
			userId: user.id,
			name: body.name,
		});

		return created(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
