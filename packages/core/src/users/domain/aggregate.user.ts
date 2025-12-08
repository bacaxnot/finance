import { UserId } from "./value-object.user-id";
import { PersonName } from "./value-object.person-name";

export type UserPrimitives = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(
    private readonly id: UserId,
    private firstName: PersonName,
    private lastName: PersonName,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(firstName: string, lastName: string): User {
    return new User(
      new UserId(),
      new PersonName(firstName),
      new PersonName(lastName),
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: UserPrimitives): User {
    return new User(
      new UserId(primitives.id),
      new PersonName(primitives.firstName),
      new PersonName(primitives.lastName),
      primitives.createdAt,
      primitives.updatedAt
    );
  }

  getFullName(): string {
    return `${this.firstName.value} ${this.lastName.value}`;
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
