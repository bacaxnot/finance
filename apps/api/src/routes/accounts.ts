import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getAccountsController } from "~/controllers/accounts/get-accounts";
import {
	putAccountController,
	putAccountSchema,
} from "~/controllers/accounts/put-account";

export const accountsApp = new Hono()
	.get("/", getAccountsController)
	.put("/", zValidator("json", putAccountSchema), putAccountController);
