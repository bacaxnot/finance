import type { Context, Next } from "hono";
import { auth } from "~/lib/auth";

function isPublicPath(path: string) {
  if (path.startsWith("/public")) return true;
  if (path.startsWith("/auth")) return true;
  return false;
}

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  // Allow auth endpoints and public paths
  if (isPublicPath(c.req.path)) {
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
