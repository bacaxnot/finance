import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { DeleteCategoryUseCase } from "@repo/core/categories/application/delete-category";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	domainError,
	internalServerError,
	noContent,
} from "~/lib/http-response";

export const deleteCategoryParamsSchema = z.object({
	id: z.uuid(),
});

export const deleteCategoryBodySchema = z.object({
	userId: z.uuid(),
});

export type DeleteCategoryCtx = Context<
	Record<string, unknown>,
	"/:id",
	{
		in: {
			param: z.infer<typeof deleteCategoryParamsSchema>;
			json: z.infer<typeof deleteCategoryBodySchema>;
		};
		out: {
			param: z.infer<typeof deleteCategoryParamsSchema>;
			json: z.infer<typeof deleteCategoryBodySchema>;
		};
	}
>;

export const deleteCategoryController = async (c: DeleteCategoryCtx) => {
	try {
		const useCase = container.get(DeleteCategoryUseCase);
		const params = c.req.valid("param");
		const body = c.req.valid("json");

		await useCase.execute({
			userId: body.userId,
			categoryId: params.id,
		});

		return noContent(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
