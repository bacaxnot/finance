import { Hono } from "hono";
import { registerRoutes } from "~/lib/register-routes";

const app = new Hono();

// Root endpoint
app.get("/", (c) => {
	return c.text("Finance API");
});

// Auto-discover all resource routes
registerRoutes(app, `${__dirname}/routes/**/*.ts`);

export default app;
