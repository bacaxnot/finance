import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	getAccountsController,
	getAccountsSchema,
} from "~/controllers/accounts/get-accounts";
import {
	putAccountController,
	putAccountSchema,
} from "~/controllers/accounts/put-account";

export const accountsApp = new Hono()
	.get("/", zValidator("query", getAccountsSchema), getAccountsController)
	.put("/", zValidator("json", putAccountSchema), putAccountController);
