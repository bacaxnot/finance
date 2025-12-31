import { spawnSync } from "node:child_process";
import { auth } from "@repo/auth";
import { generateUuid } from "@repo/core/utils";
import { db } from "@repo/db";
import { accounts, categories, transactions, users } from "@repo/db/schema";

/**
 * Seed database with development data
 *
 * Usage:
 *   bun scripts/seed.ts          # Push schema + seed data
 *   bun scripts/seed.ts --no-push  # Seed only (skip schema push)
 */
async function seed() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const pushSchema = !args.includes("--no-push");

  console.log("🌱 Seeding database...");

  try {
    // Step 0: Ensure schema is up to date (unless --no-push)

    if (pushSchema) {
      console.log("  → Ensuring schema is up to date...");

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

      console.log("");
    } else {
      console.log("  ⚠️  Skipping schema push (--no-push flag)");
      console.log("      Make sure your schema is up to date!\n");
    }
    // ====================
    // 1. Create Auth User (using Better Auth API)
    // ====================
    console.log("  → Creating auth user...");

    const seedEmail = "elon@musk.com";
    const seedPassword = "melapelaconcanela";
    const seedName = "Elon Musk";

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: seedEmail,
        password: seedPassword,
        name: seedName,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      throw new Error("Failed to create auth user");
    }

    const userId = signUpResult.user.id;

    console.log(`    ✓ Auth user created (${seedEmail} / ${seedPassword})`);

    // ====================
    // 2. Create Domain User
    // ====================
    console.log("  → Creating domain user...");

    await db.insert(users).values({
      id: userId,
      firstName: "Elon",
      lastName: "Musk",
    });

    console.log("    ✓ Domain user created");

    // ====================
    // 3. Create Accounts
    // ====================
    console.log("  → Creating accounts...");

    const bancoXimboId = generateUuid();
    const turboneaCapitalId = generateUuid();
    const svbId = generateUuid();
    const epalarepaId = generateUuid();

    const accountsData = [
      {
        id: bancoXimboId,
        userId,
        name: "Banco Mi Ximbo Intergaláctico",
        currency: "COP",
        initialBalance: "420690000.00",
        currentBalance: "420690000.00",
      },
      {
        id: turboneaCapitalId,
        userId,
        name: "Turbonea Capital Holdings",
        currency: "COP",
        initialBalance: "44000000000.00",
        currentBalance: "44000000000.00",
      },
      {
        id: svbId,
        userId,
        name: "Silicon Valley Bank",
        currency: "COP",
        initialBalance: "69420.00",
        currentBalance: "69420.00",
      },
      {
        id: epalarepaId,
        userId,
        name: "Epalarepa Bank",
        currency: "COP",
        initialBalance: "1000000000.00",
        currentBalance: "1000000000.00",
      },
    ];

    await db.insert(accounts).values(accountsData);

    console.log(`    ✓ ${accountsData.length} accounts created`);

    // ====================
    // 4. Create Categories
    // ====================
    console.log("  → Creating categories...");

    const rocketFuelId = generateUuid();
    const companyAcquisitionsId = generateUuid();
    const memesShitpostingId = generateUuid();
    const secFinesId = generateUuid();
    const cybertruckRepairsId = generateUuid();
    const flamethrowerSalesId = generateUuid();
    const twitterBlueId = generateUuid();

    const categoriesData = [
      { id: rocketFuelId, userId, name: "Combustible de Cohetes y SpaceX" },
      { id: companyAcquisitionsId, userId, name: "Adquisiciones de Empresas" },
      { id: memesShitpostingId, userId, name: "Memes y Shitposting" },
      { id: secFinesId, userId, name: "Multas de la SEC" },
      { id: cybertruckRepairsId, userId, name: "Reparaciones del Cybertruck" },
      { id: flamethrowerSalesId, userId, name: "Ventas de Lanzallamas" },
      { id: twitterBlueId, userId, name: "Twitter/X Blue" },
    ];

    await db.insert(categories).values(categoriesData);

    console.log(`    ✓ ${categoriesData.length} categories created`);

    // ====================
    // 5. Create Transactions
    // ====================
    console.log("  → Creating transactions...");

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 30); // Start 30 days ago

    const transactionsData = [
      // Twitter acquisition
      {
        id: generateUuid(),
        userId,
        accountId: turboneaCapitalId,
        categoryId: companyAcquisitionsId,
        amount: "44000000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Compré Twitter (ohsi ohsi)",
        transactionDate: new Date(baseDate.getTime()),
        notes: "Ahora se llama X porque sí",
      },
      // Flamethrower sales
      {
        id: generateUuid(),
        userId,
        accountId: svbId,
        categoryId: flamethrowerSalesId,
        amount: "10000000.00",
        currency: "COP",
        direction: "inbound" as const,
        description: "Ventas de Lanzallamas de Boring Company",
        transactionDate: new Date(baseDate.getTime() + 86400000), // +1 day
        notes: "Not a flamethrower",
      },
      // Dogecoin pump
      {
        id: generateUuid(),
        userId,
        accountId: svbId,
        categoryId: memesShitpostingId,
        amount: "420690.00",
        currency: "COP",
        direction: "inbound" as const,
        description: "Subida de Dogecoin por tweet",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 2), // +2 days
        notes: "To the moon! 🚀",
      },
      // SEC Fine
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: secFinesId,
        amount: "20000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Multa de la SEC por tweet de 'funding secured'",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 3), // +3 days
        notes: "Worth it",
      },
      // SpaceX Launch
      {
        id: generateUuid(),
        userId,
        accountId: epalarepaId,
        categoryId: rocketFuelId,
        amount: "62000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Lanzamiento de Falcon Heavy",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 5), // +5 days
        notes: "Starman sigue vibrando en el espacio",
      },
      // Cybertruck window repair
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: cybertruckRepairsId,
        amount: "500.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Reemplazo de ventana del Cybertruck",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 7), // +7 days
        notes: "El demo fue... genial",
      },
      // Twitter Blue revenue
      {
        id: generateUuid(),
        userId,
        accountId: turboneaCapitalId,
        categoryId: twitterBlueId,
        amount: "8.00",
        currency: "COP",
        direction: "inbound" as const,
        description: "Subscripción de Twitter Blue",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 10), // +10 days
        notes: "Modelo revolucionario de negocios",
      },
      // Meme investment
      {
        id: generateUuid(),
        userId,
        accountId: svbId,
        categoryId: memesShitpostingId,
        amount: "69420.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Compra de NFT de meme Doge",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 12), // +12 days
        notes: "Much wow, very invest",
      },
      // Starship test
      {
        id: generateUuid(),
        userId,
        accountId: epalarepaId,
        categoryId: rocketFuelId,
        amount: "90000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Vuelo de prueba de Starship (RUD)",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 15), // +15 days
        notes: "RUD is just a feature",
      },
      // Tesla stock sale
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: companyAcquisitionsId,
        amount: "5000000000.00",
        currency: "COP",
        direction: "inbound" as const,
        description: "Vendí acciones de Tesla para comprar Twitter",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 18), // +18 days
        notes: "La diversificación es para cobardes",
      },
      // Another SEC fine
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: secFinesId,
        amount: "40000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Multa de la SEC por manipulación del mercado",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 20), // +20 days
        notes: "They don't understand my genius",
      },
      // Boring Company tunnel
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: companyAcquisitionsId,
        amount: "10000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Expansión del Vegas Loop",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 22), // +22 days
        notes: "No es solo un túnel con luces RGB",
      },
      // X rebrand costs
      {
        id: generateUuid(),
        userId,
        accountId: turboneaCapitalId,
        categoryId: memesShitpostingId,
        amount: "20000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Cambio de marca de Twitter a X",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 25), // +25 days
        notes: "Best branding decision ever (trust me)",
      },
      // Neuralink investment
      {
        id: generateUuid(),
        userId,
        accountId: epalarepaId,
        categoryId: companyAcquisitionsId,
        amount: "100000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "I+D de Neuralink",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 28), // +28 days
        notes: "Pronto tuitearás con tu mente",
      },
      // Trump campaign donation
      {
        id: generateUuid(),
        userId,
        accountId: bancoXimboId,
        categoryId: memesShitpostingId,
        amount: "50000000.00",
        currency: "COP",
        direction: "outbound" as const,
        description: "Donación para Campaña de Trumpy",
        transactionDate: new Date(baseDate.getTime() + 86400000 * 29), // +29 days
        notes: "Make America Meme Again",
      },
    ];

    await db.insert(transactions).values(transactionsData);

    console.log(`    ✓ ${transactionsData.length} transactions created`);

    console.log("\n✅ Seeding complete!");
    console.log("\n📊 Summary:");
    console.log(`   • 1 user (${seedEmail} / ${seedPassword})`);
    console.log(
      `   • ${accountsData.length} accounts (${accountsData.map((a) => a.name).join(", ")})`,
    );
    console.log(`   • ${categoriesData.length} categories`);
    console.log(`   • ${transactionsData.length} transactions`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
