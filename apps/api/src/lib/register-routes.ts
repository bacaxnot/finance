import { glob } from "glob";
import type { Hono } from "hono";

export async function registerRoutes(app: Hono, globPattern: string) {
  const routeFiles = glob.sync(globPattern);

  for (const file of routeFiles) {
    const route = await import(file);
    if (route.register && typeof route.register === "function") {
      route.register(app);
    }
  }
}
