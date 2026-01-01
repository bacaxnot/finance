import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DeleteCategory } from "@repo/core/ledger/categories/application/delete-category.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const deleteCategoryParamsSchema = z.object({
  id: z.uuid(),
});

/**
 * @summary Delete category
 * @description Remove specific category
 */
export const deleteCategoryHandlers = factory.createHandlers(
  zValidator("param", deleteCategoryParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteCategory);
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
  },
);
