import { Hono } from "hono";
import { deleteTransactionHandlers } from "~/controllers/transactions/delete-transaction";
import { getTransactionsHandlers } from "~/controllers/transactions/get-transactions";
import { patchTransactionHandlers } from "~/controllers/transactions/patch-transaction";
import { putTransactionHandlers } from "~/controllers/transactions/put-transaction";

/**
 * @name Transactions
 * @description Endpoints for managing financial transactions
 */
export const transactionsApp = new Hono()
  .get("/", ...getTransactionsHandlers)
  .put("/:id", ...putTransactionHandlers)
  .patch("/:id", ...patchTransactionHandlers)
  .delete("/:id", ...deleteTransactionHandlers);

export type AppType = typeof transactionsApp;
