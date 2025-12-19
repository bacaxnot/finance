import { defineConfig } from "@rcmade/hono-docs";

export default defineConfig({
  tsConfigPath: "./tsconfig.json",
  openApi: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description: "API for managing personal finance accounts, transactions, and categories",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  outputs: {
    openApiJson: "./openapi.json",
  },
  apis: [
    {
      name: "Accounts",
      apiPrefix: "/accounts",
      appTypePath: "src/routes/accounts.ts",
      api: [
        {
          api: "/",
          method: "get",
          summary: "List all accounts",
          description: "Retrieve all financial accounts for the authenticated user",
        },
        {
          api: "/",
          method: "put",
          summary: "Create account",
          description: "Create a new financial account",
        },
      ],
    },
    {
      name: "Transactions",
      apiPrefix: "/transactions",
      appTypePath: "src/routes/transactions.ts",
      api: [
        {
          api: "/",
          method: "get",
          summary: "List transactions",
          description:
            "Retrieve transactions for the authenticated user, optionally filtered by account",
        },
        {
          api: "/",
          method: "put",
          summary: "Create transaction",
          description: "Create a new transaction",
        },
        {
          api: "/{id}",
          method: "patch",
          summary: "Update transaction",
          description: "Update an existing transaction by ID",
        },
        {
          api: "/{id}",
          method: "delete",
          summary: "Delete transaction",
          description: "Delete a transaction by ID",
        },
      ],
    },
    {
      name: "Categories",
      apiPrefix: "/categories",
      appTypePath: "src/routes/categories.ts",
      api: [
        {
          api: "/",
          method: "get",
          summary: "List categories",
          description: "Retrieve all categories for the authenticated user",
        },
        {
          api: "/",
          method: "put",
          summary: "Create category",
          description: "Create a new transaction category",
        },
        {
          api: "/{id}",
          method: "patch",
          summary: "Update category",
          description: "Update an existing category by ID",
        },
        {
          api: "/{id}",
          method: "delete",
          summary: "Delete category",
          description: "Delete a category by ID",
        },
      ],
    },
    {
      name: "Me",
      apiPrefix: "/me",
      appTypePath: "src/routes/me.ts",
      api: [
        {
          api: "/",
          method: "get",
          summary: "Get current user",
          description: "Retrieve the authenticated user's profile information",
        },
        {
          api: "/",
          method: "patch",
          summary: "Update current user",
          description: "Update the authenticated user's first name and last name",
        },
      ],
    },
  ],
});
