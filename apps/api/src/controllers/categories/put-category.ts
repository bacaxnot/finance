import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { CreateCategory } from "@repo/core/ledger/categories/application/create-category";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putCategoryParamsSchema = z.object({
  id: z.uuid(),
});

export const putCategoryBodySchema = z.object({
  name: z.string().min(1),
});

/**
 * @summary Upsert category
 * @description Add new category with specific ID
 */
export const putCategoryHandlers = factory.createHandlers(
  zValidator("param", putCategoryParamsSchema),
  zValidator("json", putCategoryBodySchema),
  async (c) => {
    try {
      const useCase = container.get(CreateCategory);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute({
        id: params.id,
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
  },
);
