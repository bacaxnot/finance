import { describe, test, expect, afterEach } from "bun:test";
import { eq } from "@repo/db/orm";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { User } from "../domain/aggregate.user";
import { UserRepositoryPostgres } from "./repository.user.postgres";

const skipIntegration = !process.env.RUN_INTEGRATION_TESTS;

describe.skipIf(skipIntegration)("UserRepositoryPostgres - Integration", () => {
  const repository = new UserRepositoryPostgres();
  const createdUserIds: string[] = [];

  afterEach(async () => {
    for (const id of createdUserIds) {
      await db.delete(users).where(eq(users.id, id));
    }
    createdUserIds.length = 0;
  });

  test("save creates a new user in the database", async () => {
    const user = User.create("John", "Doe");
    const primitives = user.toPrimitives();
    createdUserIds.push(primitives.id);

    await repository.save(user);

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, primitives.id))
      .limit(1);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(primitives.id);
    expect(result[0].firstName).toBe("John");
    expect(result[0].lastName).toBe("Doe");
  });

  test("save updates an existing user in the database", async () => {
    const user = User.create("Jane", "Smith");
    const primitives = user.toPrimitives();
    createdUserIds.push(primitives.id);

    await repository.save(user);

    const updatedUser = User.fromPrimitives({
      ...primitives,
      firstName: "Janet",
      lastName: "Johnson",
      updatedAt: new Date(),
    });

    await repository.save(updatedUser);

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, primitives.id))
      .limit(1);

    expect(result.length).toBe(1);
    expect(result[0].firstName).toBe("Janet");
    expect(result[0].lastName).toBe("Johnson");
  });

  test("find returns a user by id", async () => {
    const user = User.create("Alice", "Brown");
    const primitives = user.toPrimitives();
    createdUserIds.push(primitives.id);

    await repository.save(user);

    const foundUser = await repository.find(primitives.id);
    const foundPrimitives = foundUser.toPrimitives();

    expect(foundPrimitives.id).toBe(primitives.id);
    expect(foundPrimitives.firstName).toBe("Alice");
    expect(foundPrimitives.lastName).toBe("Brown");
    expect(foundUser.getFullName()).toBe("Alice Brown");
  });

  test("find throws error when user is not found", async () => {
    const nonExistentId = "00000000-0000-7000-8000-000000000000";

    try {
      await repository.find(nonExistentId);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(`User with id ${nonExistentId} not found`);
    }
  });
});
