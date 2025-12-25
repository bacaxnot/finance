/** biome-ignore-all lint/complexity/noStaticOnlyClass: object mother pattern */

import {
  User,
  type UserPrimitives,
} from "../../../../../src/contexts/ledger/users/domain/user";
import { dateToPrimitive } from "../../../../../src/shared/domain/primitives";
import { UserFirstNameMother } from "./user-first-name-mother";
import { UserIdMother } from "./user-id-mother";
import { UserLastNameMother } from "./user-last-name-mother";

export class UserMother {
  static create(params?: Partial<UserPrimitives>): User {
    const primitives: UserPrimitives = {
      id: UserIdMother.create().value,
      firstName: UserFirstNameMother.create().value,
      lastName: UserLastNameMother.create().value,
      createdAt: dateToPrimitive(new Date()),
      updatedAt: dateToPrimitive(new Date()),
      ...params,
    };

    return User.fromPrimitives(primitives);
  }
}
