/** biome-ignore-all lint/complexity/noStaticOnlyClass: object mother pattern */

import { faker } from "@faker-js/faker";
import { UserFirstName } from "../../../../../src/contexts/ledger/users/domain/user-first-name";

export class UserFirstNameMother {
  static create(value?: string): UserFirstName {
    return new UserFirstName(value ?? faker.person.firstName());
  }
}
