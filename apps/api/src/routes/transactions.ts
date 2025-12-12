import { CreateTransactionUseCase } from "@repo/core/transactions/application/create-transaction";
import { DeleteTransactionUseCase } from "@repo/core/transactions/application/delete-transaction";
import { ListTransactionsByAccount } from "@repo/core/transactions/application/list-transactions-by-account";
import { ListTransactionsByUser } from "@repo/core/transactions/application/list-transactions-by-user";
import { UpdateTransactionUseCase } from "@repo/core/transactions/application/update-transaction";
import type { Hono } from "hono";
import { Hono as HonoApp } from "hono";
import { container } from "~/di";
import { executeWithErrorHandling } from "~/lib/execute-with-error-handling";
import { badRequest, created, json, noContent } from "~/lib/http-response";

const transactions = new HonoApp();

// POST /transactions - Create transaction
transactions.post("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(CreateTransactionUseCase);

    const body = await c.req.json();

    await useCase.execute({
      id: body.id,
      userId: body.userId, // TODO: Get from auth middleware
      accountId: body.accountId,
      categoryId: body.categoryId || null,
      amount: body.amount,
      currency: body.currency,
      direction: body.direction,
      description: body.description,
      transactionDate: body.transactionDate,
      notes: body.notes || null,
    });

    return created(c);
  });
});

// PATCH /transactions/:id - Update transaction
transactions.patch("/:id", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(UpdateTransactionUseCase);

    const id = c.req.param("id");
    const body = await c.req.json();

    await useCase.execute({
      id,
      amount: body.amount,
      currency: body.currency,
      direction: body.direction,
      description: body.description,
      transactionDate: body.transactionDate,
      notes: body.notes,
      categoryId: body.categoryId,
    });

    return noContent(c);
  });
});

// DELETE /transactions/:id - Delete transaction
transactions.delete("/:id", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(DeleteTransactionUseCase);

    const id = c.req.param("id");

    await useCase.execute({ id });

    return noContent(c);
  });
});

// GET /transactions?accountId=... - List transactions by account
// GET /transactions?userId=... - List transactions by user
transactions.get("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const accountId = c.req.query("accountId");
    const userId = c.req.query("userId");

    if (accountId) {
      const useCase = container.get(ListTransactionsByAccount);
      const transactions = await useCase.execute({ accountId });
      return json(c, { data: transactions });
    }

    if (userId) {
      const useCase = container.get(ListTransactionsByUser);
      const transactions = await useCase.execute({ userId });
      return json(c, { data: transactions });
    }

    return badRequest(
      c,
      "Either accountId or userId query parameter is required",
    );
  });
});

export const register = (app: Hono) => {
  app.route("/transactions", transactions);
};
