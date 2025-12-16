import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { UpdateCategoryUseCase } from "@repo/core/categories/application/update-category";
import type { Context } from "hono";
import { z } from "zod";
import { container } from "~/di";
import {
	domainError,
	internalServerError,
	noContent,
} from "~/lib/http-response";

export const patchCategoryParamsSchema = z.object({
	id: z.uuid(),
});

export const patchCategoryBodySchema = z.object({
	userId: z.uuid(),
	name: z.string().min(1),
});

export type PatchCategoryCtx = Context<
	Record<string, unknown>,
	"/:id",
	{
		in: {
			param: z.infer<typeof patchCategoryParamsSchema>;
			json: z.infer<typeof patchCategoryBodySchema>;
		};
		out: {
			param: z.infer<typeof patchCategoryParamsSchema>;
			json: z.infer<typeof patchCategoryBodySchema>;
		};
	}
>;

export const patchCategoryController = async (c: PatchCategoryCtx) => {
	try {
		const useCase = container.get(UpdateCategoryUseCase);
		const params = c.req.valid("param");
		const body = c.req.valid("json");

		await useCase.execute({
			userId: body.userId,
			categoryId: params.id,
			name: body.name,
		});

		return noContent(c);
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			return domainError(c, error, 400);
		}

		return internalServerError(c);
	}
};
