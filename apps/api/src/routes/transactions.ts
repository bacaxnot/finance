import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	deleteTransactionController,
	deleteTransactionParamsSchema,
} from "~/controllers/transactions/delete-transaction";
import {
	getTransactionsController,
	getTransactionsSchema,
} from "~/controllers/transactions/get-transactions";
import {
	patchTransactionBodySchema,
	patchTransactionController,
	patchTransactionParamsSchema,
} from "~/controllers/transactions/patch-transaction";
import {
	putTransactionController,
	putTransactionSchema,
} from "~/controllers/transactions/put-transaction";

export const transactionsApp = new Hono()
	.get("/", zValidator("query", getTransactionsSchema), getTransactionsController)
	.put("/", zValidator("json", putTransactionSchema), putTransactionController)
	.patch(
		"/:id",
		zValidator("param", patchTransactionParamsSchema),
		zValidator("json", patchTransactionBodySchema),
		patchTransactionController,
	)
	.delete(
		"/:id",
		zValidator("param", deleteTransactionParamsSchema),
		deleteTransactionController,
	);

export type AppType = typeof transactionsApp;
