import type { Context, Next } from "hono";
import { auth } from "~/lib/auth";

const STARTS_WITH_PUBLIC = ["/public", "/auth"];
const EXACT_MATCH_PUBLIC = ["/openapi.json", "/docs"];

function isPublicPath(path: string) {
  if (STARTS_WITH_PUBLIC.some((startsWith) => path.startsWith(startsWith)))
    return true;
  if (EXACT_MATCH_PUBLIC.some((exactMatch) => path === exactMatch)) return true;
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
