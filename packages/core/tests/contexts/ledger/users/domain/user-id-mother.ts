/** biome-ignore-all lint/complexity/noStaticOnlyClass: object mother pattern */

import { faker } from "@faker-js/faker";
import { UserId } from "../../../../../src/contexts/ledger/users/domain/user-id";

export class UserIdMother {
  static create(value?: string): UserId {
    return new UserId(value ?? faker.string.uuid());
  }
}
