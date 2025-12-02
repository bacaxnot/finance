import { v7 as uuidv7, validate as uuidValidate } from "uuid";

export class UserId {
  private constructor(private readonly value: string) {
    if (!uuidValidate(value)) {
      throw new Error("Invalid UUID format");
    }
  }

  static generate(): UserId {
    return new UserId(uuidv7());
  }

  static from(value: string): UserId {
    return new UserId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
