import { db } from "@repo/db";
import { eq } from "@repo/db/orm";
import { users } from "@repo/db/schema";
import { User } from "../domain/user";
import type { UserId } from "../domain/user-id";
import type { UserRepository } from "../domain/user-repository";

export class UserRepositoryPostgres implements UserRepository {
  async save(user: User): Promise<void> {
    const primitives = user.toPrimitives();

    await db
      .insert(users)
      .values({
        id: primitives.id,
        firstName: primitives.firstName,
        lastName: primitives.lastName,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: primitives.firstName,
          lastName: primitives.lastName,
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async search(id: UserId): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];

    return User.fromPrimitives({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
