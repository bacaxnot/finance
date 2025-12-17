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
import type { ProtectedVariables } from "~/types/app";

export const deleteCategoryParamsSchema = z.object({
	id: z.uuid(),
});

export type DeleteCategoryCtx = Context<
	{ Variables: ProtectedVariables },
	"/:id",
	{
		in: {
			param: z.infer<typeof deleteCategoryParamsSchema>;
		};
		out: {
			param: z.infer<typeof deleteCategoryParamsSchema>;
		};
	}
>;

export const deleteCategoryController = async (c: DeleteCategoryCtx) => {
	try {
		const useCase = container.get(DeleteCategoryUseCase);
		const params = c.req.valid("param");
		const user = c.get("user");

		await useCase.execute({
			userId: user.id,
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
