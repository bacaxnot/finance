import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { User } from "../domain/aggregate.user";
import { eq } from "@repo/db/orm";
import { UserRepository } from "../domain/repository.user";

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

  async find(id: string): Promise<User> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`User with id ${id} not found`);
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
