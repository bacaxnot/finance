import { User } from "./aggregate.user";
import { UserId } from "./value-object.user-id";

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: UserId): Promise<User | null>;
}
