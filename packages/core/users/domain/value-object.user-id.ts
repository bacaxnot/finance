export class UserId {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.trim() === "") {
      throw new Error("User ID cannot be empty");
    }

    // UUID v4 validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error("User ID must be a valid UUID");
    }
  }
  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  static from(value: string): UserId {
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
