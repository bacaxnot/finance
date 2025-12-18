import { eq } from "@repo/db/orm";
import { users } from "@repo/db/schema";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "~/_shared/domain/primitives";
import { DrizzlePostgresRepository } from "~/_shared/infrastructure/drizzle-postgres-repository";
import { User } from "../domain/user";
import type { UserId } from "../domain/user-id";
import type { UserRepository } from "../domain/user-repository";

export class UserRepositoryPostgres
  extends DrizzlePostgresRepository<User>
  implements UserRepository
{
  async save(user: User): Promise<void> {
    const primitives = user.toPrimitives();

    await this.db
      .insert(users)
      .values({
        id: primitives.id,
        firstName: primitives.firstName,
        lastName: primitives.lastName,
        createdAt: dateFromPrimitive(primitives.createdAt),
        updatedAt: dateFromPrimitive(primitives.updatedAt),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: primitives.firstName,
          lastName: primitives.lastName,
          updatedAt: dateFromPrimitive(primitives.updatedAt),
        },
      });
  }

  async search(id: UserId): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id.value))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toAggregate(result[0]);
  }

  protected toAggregate(row: typeof users.$inferSelect): User {
    return User.fromPrimitives({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      createdAt: dateToPrimitive(row.createdAt),
      updatedAt: dateToPrimitive(row.updatedAt),
    });
  }
}
