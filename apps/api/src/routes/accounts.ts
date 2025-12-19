import { Hono } from "hono";
import { getAccountsHandlers } from "~/controllers/accounts/get-accounts";
import { putAccountHandlers } from "~/controllers/accounts/put-account";

export const accountsApp = new Hono()
	.get("/", ...getAccountsHandlers)
	.put("/:id", ...putAccountHandlers);

export type AppType = typeof accountsApp;
