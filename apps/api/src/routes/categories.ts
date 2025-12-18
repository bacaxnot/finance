import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  deleteCategoryController,
  deleteCategoryParamsSchema,
} from "~/controllers/categories/delete-category";
import { getCategoriesController } from "~/controllers/categories/get-categories";
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
  .get("/", getCategoriesController)
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
    deleteCategoryController,
  );

export type AppType = typeof categoriesApp;
