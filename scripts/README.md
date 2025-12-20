# Database Scripts

Utility scripts for managing your local development database.

## Prerequisites

1. **Database running:** Start PostgreSQL via `docker compose up -d`
2. **Environment variables:** Bun automatically loads the root `.env` file for all workspaces

## Available Scripts

### `reset-db.ts`

Drops the entire `public` schema and recreates it via Drizzle push. This removes all tables, types, functions, and other database objects, then rebuilds the schema.

**Warning:** This deletes ALL data in your database.

**Why drop the schema?** More maintainable than listing individual tables - automatically handles any future schema changes.

```bash
# Default: Reset + push schema (fully handled)
bun scripts/reset-db.ts

# Skip schema push (manual control)
bun scripts/reset-db.ts --no-push
```

### `seed.ts`

Ensures schema is up to date, then populates the database with development data. Uses Better Auth's `signUpEmail` API to create users properly.

```bash
# Default: Push schema + seed data
bun scripts/seed.ts

# Skip schema push (manual control)
bun scripts/seed.ts --no-push
```

**Seed data includes (satirical Elon Musk theme):**
- 1 user account (elon@musk.com / melapelaconcanela) - created via Better Auth API
- 4 accounts (Tesla Stock Portfolio, X Corp Acquisition Fund, Dogecoin Wallet, Mars Colonization Fund)
- 7 categories (Rocket Fuel & SpaceX, Company Acquisitions, Memes & Shitposting, SEC Fines, Cybertruck Repairs, Flamethrower Sales, Twitter/X Blue)
- 14 satirical transactions including Twitter acquisition, SEC fines, Dogecoin pumps, and more!

**Why use Better Auth API?** Ensures password hashing and user creation follows the same flow as real signups.

## Common Workflows

### Fresh start (new developer or corrupted data)

**Simplest approach:**
```bash
# Just seed - it ensures schema is up to date automatically!
bun scripts/seed.ts
```

**Full reset + seed:**
```bash
# Reset drops + recreates schema, then seed adds data
bun scripts/reset-db.ts && bun scripts/seed.ts
```

**When to use each:**
- Use **seed only** if you just want fresh data (keeps existing data if any)
- Use **reset + seed** for a completely clean slate (drops everything first)

### Manual control (advanced)

```bash
# Reset without schema push
bun scripts/reset-db.ts --no-push

# Seed without schema push
bun scripts/seed.ts --no-push

# Manually push schema when needed
bun --cwd packages/db db push
```

## Development Credentials

After seeding, you can log in with:

- **Email:** elon@musk.com
- **Password:** melapelaconcanela

## Modifying Seed Data

Edit `scripts/seed.ts` to customize:
- User credentials (update `seedEmail`, `seedPassword`, `seedName` variables)
- Number/types of accounts (add/remove from `accountsData` array)
- Categories (add/remove from `categoriesData` array)
- Transaction history (add/remove from `transactionsData` array)

**All logs are dynamic** - they automatically reflect the number of items you add/remove!

**Note:** Current seed data is satirically themed around Elon Musk's ventures (Tesla, SpaceX, Twitter/X, etc.) with humorous transactions like SEC fines and Dogecoin pumps. Feel free to replace with serious data for your needs!

All seed data uses predictable UUIDs generated via `@repo/core/utils`.
