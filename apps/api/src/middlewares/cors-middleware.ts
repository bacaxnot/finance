import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
  credentials: true,
});
