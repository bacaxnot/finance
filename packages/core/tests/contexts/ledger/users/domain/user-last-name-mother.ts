/** biome-ignore-all lint/complexity/noStaticOnlyClass: object mother pattern */

import { faker } from "@faker-js/faker";
import { UserLastName } from "../../../../../src/contexts/ledger/users/domain/user-last-name";

export class UserLastNameMother {
  static create(value?: string): UserLastName {
    return new UserLastName(value ?? faker.person.lastName());
  }
}
