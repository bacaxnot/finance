import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../shared/domain/primitives";
import { UserFirstName } from "./user-first-name";
import { UserId } from "./user-id";
import { UserLastName } from "./user-last-name";

export type UserPrimitives = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

export class User extends AggregateRoot {
  private constructor(
    private readonly id: UserId,
    private firstName: UserFirstName,
    private lastName: UserLastName,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    firstName: string;
    lastName: string;
  }): User {
    const now = dateToPrimitive(new Date());
    return User.fromPrimitives({
      id: params.id,
      firstName: params.firstName,
      lastName: params.lastName,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrimitives(primitives: UserPrimitives): User {
    return new User(
      new UserId(primitives.id),
      new UserFirstName(primitives.firstName),
      new UserLastName(primitives.lastName),
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt),
    );
  }

  getFullName(): string {
    return `${this.firstName.value} ${this.lastName.value}`;
  }

  update(params: { firstName?: string; lastName?: string }): void {
    const now = new Date();
    if (params.firstName) {
      this.firstName = new UserFirstName(params.firstName);
      this.updatedAt = now;
    }
    if (params.lastName) {
      this.lastName = new UserLastName(params.lastName);
      this.updatedAt = now;
    }
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
