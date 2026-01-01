import { InferDependencies } from "../../../../../di/autoregister";

import type { User, UserPrimitives } from "../domain/user";
import { UserDoesNotExistError } from "../domain/user-does-not-exist-error";
import { UserId } from "../domain/user-id";
import { UserRepository } from "../domain/user-repository";

@InferDependencies()
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
