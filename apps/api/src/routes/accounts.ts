import { CreateAccount } from "@repo/core/accounts/application/create-account";
import { ListAccountsByUser } from "@repo/core/accounts/application/list-accounts-by-user";
import type { Hono } from "hono";
import { Hono as HonoApp } from "hono";
import { container } from "~/di";
import { executeWithErrorHandling } from "~/lib/execute-with-error-handling";
import { badRequest, created, json } from "~/lib/http-response";

const accounts = new HonoApp();

// POST /accounts - Create account
accounts.post("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(CreateAccount);

    const body = await c.req.json();

    await useCase.execute({
      id: body.id,
      userId: body.userId, // TODO: Get from auth middleware
      name: body.name,
      currency: body.currency,
      initialBalance: body.initialBalance,
    });

    return created(c);
  });
});

// GET /accounts - List accounts by user
accounts.get("/", async (c) => {
  return executeWithErrorHandling(c, async () => {
    const useCase = container.get(ListAccountsByUser);

    const userId = c.req.query("userId"); // TODO: Get from auth middleware

    if (!userId) {
      return badRequest(c, "userId query parameter is required");
    }

    const accounts = await useCase.execute({ userId });

    return json(c, { data: accounts });
  });
});

export const register = (app: Hono) => {
  app.route("/accounts", accounts);
};
