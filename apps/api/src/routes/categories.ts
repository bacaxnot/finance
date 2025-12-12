import { CreateCategory } from "@repo/core/categories/application/create-category";
import { DeleteCategoryUseCase } from "@repo/core/categories/application/delete-category";
import { ListCategoriesByUser } from "@repo/core/categories/application/list-categories-by-user";
import { UpdateCategoryUseCase } from "@repo/core/categories/application/update-category";
import type { Hono } from "hono";
import { Hono as HonoApp } from "hono";
import { container } from "~/di";
import { executeWithErrorHandling } from "~/lib/execute-with-error-handling";
import { badRequest, created, json, noContent } from "~/lib/http-response";

const categories = new HonoApp();

// POST /categories - Create category
categories.post("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(CreateCategory);

    const body = await c.req.json();

    await useCase.execute({
      id: body.id,
      userId: body.userId, // TODO: Get from auth middleware
      name: body.name,
    });

    return created(c);
  });
});

// PATCH /categories/:id - Update category
categories.patch("/:id", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(UpdateCategoryUseCase);

    const categoryId = c.req.param("id");
    const body = await c.req.json();

    await useCase.execute({
      userId: body.userId, // TODO: Get from auth middleware
      categoryId,
      name: body.name,
    });

    return noContent(c);
  });
});

// DELETE /categories/:id - Delete category
categories.delete("/:id", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(DeleteCategoryUseCase);

    const categoryId = c.req.param("id");
    const body = await c.req.json();

    await useCase.execute({
      userId: body.userId, // TODO: Get from auth middleware
      categoryId,
    });

    return noContent(c);
  });
});

// GET /categories - List categories by user
categories.get("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(ListCategoriesByUser);

    const userId = c.req.query("userId"); // TODO: Get from auth middleware

    if (!userId) {
      return badRequest(c, "userId query parameter is required");
    }

    const categories = await useCase.execute({ userId });

    return json(c, { data: categories });
  });
});

export const register = (app: Hono) => {
  app.route("/categories", categories);
};
