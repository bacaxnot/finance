import { User } from "./user";
import { UserId } from "./user-id";

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: UserId): Promise<User | null>;
}
