import { Hono } from "hono";
import { deleteTransactionHandlers } from "~/controllers/transactions/delete-transaction";
import { getTransactionsHandlers } from "~/controllers/transactions/get-transactions";
import { patchTransactionHandlers } from "~/controllers/transactions/patch-transaction";
import { putTransactionHandlers } from "~/controllers/transactions/put-transaction";

export const transactionsApp = new Hono()
  .get("/", ...getTransactionsHandlers)
  .put("/", ...putTransactionHandlers)
  .patch("/:id", ...patchTransactionHandlers)
  .delete("/:id", ...deleteTransactionHandlers);

export type AppType = typeof transactionsApp;
