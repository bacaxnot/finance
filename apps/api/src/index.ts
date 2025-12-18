import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { auth } from "~/lib/auth";
import { authMiddleware } from "~/middlewares/auth-middleware";
import { corsMiddleware } from "~/middlewares/cors-middleware";
import { accountsApp } from "~/routes/accounts";
import { categoriesApp } from "~/routes/categories";
import { transactionsApp } from "~/routes/transactions";
import type { AppVariables } from "~/types/app";

export const app = new Hono<{ Variables: AppVariables }>()
	// CORS - must be before routes
	.use("*", corsMiddleware)
	// Auth middleware - adds user/session to context and enforces authentication
	.use("*", authMiddleware)
	// Better Auth routes (handles /auth/* including sign-up, sign-in, etc)
	.on(["POST", "GET"], "/auth/*", (c) => {
		return auth.handler(c.req.raw);
	})
	// API Documentation
	.get("/openapi.json", async (c) => {
		const file = Bun.file("./openapi.json");
		return c.json(await file.json());
	})
	.get("/docs", Scalar({ url: "/openapi.json" }))
	// Domain routes (all protected by default)
	.route("/accounts", accountsApp)
	.route("/transactions", transactionsApp)
	.route("/categories", categoriesApp);

export default {
  port: 8000,
  fetch: app.fetch,
};
