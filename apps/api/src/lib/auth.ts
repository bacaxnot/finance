import { UserId } from "@repo/core/users/domain/user-id";
import { db } from "@repo/db";
import {
  authAccount,
  authSession,
  authUser,
  authVerification,
} from "@repo/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: () => new UserId().value,
    },
  },
});

// Export type for client (future use)
export type AuthAPI = typeof auth;
