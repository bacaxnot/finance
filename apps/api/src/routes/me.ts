import { Hono } from "hono";
import { getMeController } from "~/controllers/me/get-me";
import { patchMeHandlers } from "~/controllers/me/patch-me";

export const meApp = new Hono()
  .get("/", getMeController)
  .patch("/", ...patchMeHandlers);

export type AppType = typeof meApp;
