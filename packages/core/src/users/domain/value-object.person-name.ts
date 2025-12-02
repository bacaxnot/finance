export class PersonName {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    // Allow letters (including accented), spaces, hyphens, and apostrophes
    // Handles international names: "María", "O'Brien", "Jean-Claude", etc.
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(value)) {
      throw new Error("Name contains invalid characters");
    }

    if (value.trim().length > 100) {
      throw new Error("Name is too long (max 100 characters)");
    }
  }

  equals(other: PersonName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
