import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateCategory } from "@repo/core/ledger/categories/application/update-category.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const patchCategoryParamsSchema = z.object({
  id: z.uuid(),
});

export const patchCategoryBodySchema = z.object({
  name: z.string().min(1),
});

/**
 * @summary Update category
 * @description Modify category name
 */
export const patchCategoryHandlers = factory.createHandlers(
  zValidator("param", patchCategoryParamsSchema),
  zValidator("json", patchCategoryBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateCategory);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
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
  },
);
