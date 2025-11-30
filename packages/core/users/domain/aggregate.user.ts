import { UserId } from "./value-object.user-id";
import { PersonName } from "./value-object.person-name";

export class User {
  private constructor(
    public readonly id: UserId,
    public firstName: PersonName,
    public lastName: PersonName,
    public readonly createdAt: Date,
    public updatedAt: Date
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
}
