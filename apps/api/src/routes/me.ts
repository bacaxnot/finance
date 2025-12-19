import { Hono } from "hono";
import { getMeHandlers } from "~/controllers/me/get-me";
import { patchMeHandlers } from "~/controllers/me/patch-me";

export const meApp = new Hono()
  .get("/", ...getMeHandlers)
  .patch("/", ...patchMeHandlers);

export type AppType = typeof meApp;
