import { Hono } from "hono";
import { getMeHandlers } from "~/controllers/me/get-me";
import { patchMeHandlers } from "~/controllers/me/patch-me";

/**
 * @name Me
 * @description Endpoints for managing the authenticated user's profile
 */
export const meApp = new Hono()
  .get("/", ...getMeHandlers)
  .patch("/", ...patchMeHandlers);

export type AppType = typeof meApp;
