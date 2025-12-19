import { Hono } from "hono";
import { deleteAccountHandlers } from "~/controllers/accounts/delete-account";
import { getAccountsHandlers } from "~/controllers/accounts/get-accounts";
import { patchAccountHandlers } from "~/controllers/accounts/patch-account";
import { putAccountHandlers } from "~/controllers/accounts/put-account";

/**
 * @name Accounts
 * @description Endpoints for managing financial accounts
 */
export const accountsApp = new Hono()
  .get("/", ...getAccountsHandlers)
  .put("/:id", ...putAccountHandlers)
  .patch("/:id", ...patchAccountHandlers)
  .delete("/:id", ...deleteAccountHandlers);

export type AppType = typeof accountsApp;
