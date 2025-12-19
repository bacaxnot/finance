import { Hono } from "hono";
import { deleteCategoryHandlers } from "~/controllers/categories/delete-category";
import { getCategoriesHandlers } from "~/controllers/categories/get-categories";
import { patchCategoryHandlers } from "~/controllers/categories/patch-category";
import { putCategoryHandlers } from "~/controllers/categories/put-category";

export const categoriesApp = new Hono()
  .get("/", ...getCategoriesHandlers)
  .put("/", ...putCategoryHandlers)
  .patch("/:id", ...patchCategoryHandlers)
  .delete("/:id", ...deleteCategoryHandlers);

export type AppType = typeof categoriesApp;
