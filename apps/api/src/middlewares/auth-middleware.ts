import type { Context, Next } from "hono";
import { auth } from "~/lib/auth";

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  // Allow auth endpoints and public paths
  if (c.req.path.startsWith("/auth") || c.req.path.startsWith("/public")) {
    return next();
  }

  // All other routes require authentication
  if (!session?.user) {
    return c.json(
      {
        error: {
          type: "Unauthorized",
          description: "Authentication required",
          data: {},
        },
      },
      401,
    );
  }

  await next();
};
