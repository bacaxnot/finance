import type { User, UserPrimitives } from "../domain/user";
import { UserId } from "../domain/user-id";
import type { UserRepository } from "../domain/user-repository";

export class UserDoesNotExistError extends Error {
  constructor(userId: string) {
    super(`User with id ${userId} does not exist`);
    this.name = "UserDoesNotExistError";
  }
}

export class FindUser {
  constructor(private readonly repository: UserRepository) {}

  async execute(params: { userId: string }): Promise<UserPrimitives> {
    const userId = new UserId(params.userId);
    const user = await this.repository.search(userId);

    this.ensureUserExists(user, params.userId);

    return user.toPrimitives();
  }

  private ensureUserExists(
    user: User | null,
    userId: string,
  ): asserts user is User {
    if (user) return;
    throw new UserDoesNotExistError(userId);
  }
}
