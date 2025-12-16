import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  deleteCategoryBodySchema,
  deleteCategoryController,
  deleteCategoryParamsSchema,
} from "~/controllers/categories/delete-category";
import {
  getCategoriesController,
  getCategoriesSchema,
} from "~/controllers/categories/get-categories";
import {
  patchCategoryBodySchema,
  patchCategoryController,
  patchCategoryParamsSchema,
} from "~/controllers/categories/patch-category";
import {
  putCategoryController,
  putCategorySchema,
} from "~/controllers/categories/put-category";

export const categoriesApp = new Hono()
  .get("/", zValidator("query", getCategoriesSchema), getCategoriesController)
  .put("/", zValidator("json", putCategorySchema), putCategoryController)
  .patch(
    "/:id",
    zValidator("param", patchCategoryParamsSchema),
    zValidator("json", patchCategoryBodySchema),
    patchCategoryController,
  )
  .delete(
    "/:id",
    zValidator("param", deleteCategoryParamsSchema),
    zValidator("json", deleteCategoryBodySchema),
    deleteCategoryController,
  );
