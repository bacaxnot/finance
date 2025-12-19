import { defineConfig } from "@bacaxnot/hono-auto-docs";

export default defineConfig({
  tsConfigPath: "./tsconfig.json",
  appPath: "src/index.ts",
  openApi: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description:
        "API for managing personal finance accounts, transactions, and categories",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  outputs: {
    openApiJson: "./openapi.json",
  },
});
