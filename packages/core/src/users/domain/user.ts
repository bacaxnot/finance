import { AggregateRoot } from "~/_shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "~/_shared/domain/primitives";
import { PersonName } from "./person-name";
import { UserId } from "./user-id";

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
    private firstName: PersonName,
    private lastName: PersonName,
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
      new PersonName(primitives.firstName),
      new PersonName(primitives.lastName),
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
      this.firstName = new PersonName(params.firstName);
      this.updatedAt = now;
    }
    if (params.lastName) {
      this.lastName = new PersonName(params.lastName);
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
