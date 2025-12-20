import { spawnSync } from "node:child_process";
import { db } from "@repo/db";
import { sql } from "@repo/db/orm";

/**
 * Reset database by dropping schema and optionally recreating it
 * WARNING: This will delete ALL data in the database
 *
 * Usage:
 *   bun scripts/reset-db.ts          # Reset + push schema
 *   bun scripts/reset-db.ts --no-push  # Reset only (skip push)
 */
async function resetDb() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const skipPush = args.includes("--no-push");

  console.log("🔄 Resetting database...");

  try {
    // Step 1: Drop entire public schema
    console.log("  → Dropping public schema...");

    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);

    console.log("  ✓ Public schema reset");

    // Early return if --no-push
    if (skipPush) {
      console.log("\n✅ Database reset complete!");
      console.log(
        "  → Next: Run 'bun --cwd packages/db db push' to recreate schema",
      );
      console.log("  → Then: Run 'bun scripts/seed.ts' to add seed data");
      return;
    }

    // Step 2: Recreate schema
    console.log("\n  → Recreating schema...");

    const result = spawnSync("bun", ["--cwd", "packages/db", "db", "push"], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`Schema push failed with exit code ${result.status}`);
    }

    console.log("\n✅ Database reset complete!");
    console.log("  → Next: Run 'bun scripts/seed.ts' to add seed data");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

resetDb();
