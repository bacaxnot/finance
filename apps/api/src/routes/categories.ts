import { Hono } from "hono";
import { deleteCategoryHandlers } from "~/controllers/categories/delete-category";
import { getCategoriesHandlers } from "~/controllers/categories/get-categories";
import { patchCategoryHandlers } from "~/controllers/categories/patch-category";
import { putCategoryHandlers } from "~/controllers/categories/put-category";

/**
 * @name Transaction Categories
 * @description Endpoints for managing transaction categories
 */
export const categoriesApp = new Hono()
  .get("/", ...getCategoriesHandlers)
  .put("/:id", ...putCategoryHandlers)
  .patch("/:id", ...patchCategoryHandlers)
  .delete("/:id", ...deleteCategoryHandlers);

export type AppType = typeof categoriesApp;
