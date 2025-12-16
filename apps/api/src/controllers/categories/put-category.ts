import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { CreateCategory } from "@repo/core/categories/application/create-category";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putCategorySchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	name: z.string().min(1),
});

export type PutCategoryCtx = Context<
	Record<string, unknown>,
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

		await useCase.execute(body);

		return created(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
