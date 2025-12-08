import { InvalidArgumentException } from "~/_shared/domain/exceptions";

const MAX_NAME_LENGTH = 100;
export class PersonName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidCharacters(value);
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureIsNotEmpty(value: string): void {
    if (value && value.trim() !== "") return;
    throw new InvalidArgumentException("Name cannot be empty");
  }

  private ensureHasValidCharacters(value: string): void {
    // Allow letters (including accented), spaces, hyphens, and apostrophes
    // Handles international names: "María", "O'Brien", "Jean-Claude", etc.
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (nameRegex.test(value)) return;
    throw new InvalidArgumentException("Name contains invalid characters");
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_NAME_LENGTH) return;
    throw new InvalidArgumentException(
      `Name is too long (max ${MAX_NAME_LENGTH} characters)`
    );
  }

  equals(other: PersonName): boolean {
    return this.value === other.value;
  }
}
