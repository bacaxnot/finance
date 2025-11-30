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
      UserId.generate(),
      new PersonName(firstName),
      new PersonName(lastName),
      new Date(),
      new Date()
    );
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.toString(),
      firstName: this.firstName.toString(),
      lastName: this.lastName.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
