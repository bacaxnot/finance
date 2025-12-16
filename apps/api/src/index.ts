import { Hono } from "hono";
import { accountsApp } from "~/routes/accounts";
import { categoriesApp } from "~/routes/categories";
import { transactionsApp } from "~/routes/transactions";

// Chain everything for proper type inference
export const app = new Hono()
  .route("/accounts", accountsApp)
  .route("/transactions", transactionsApp)
  .route("/categories", categoriesApp);

export default {
  port: 8000,
  fetch: app.fetch,
};
