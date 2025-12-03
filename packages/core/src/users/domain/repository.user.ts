import { User } from "./aggregate.user";

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: string): Promise<User | null>;
}
