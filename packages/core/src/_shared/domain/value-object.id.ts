import { v7 as uuidv7, validate as uuidValidate } from "uuid";
import { InvalidArgumentException } from "./exceptions";

export class Id {
  public readonly value: string;

  constructor(value?: string) {
    if (value == undefined) {
      this.value = this.generate();
    } else {
      this.ensureIsValidUuid(value);
      this.value = value;
    }
  }

  private generate(): string {
    return uuidv7();
  }

  private ensureIsValidUuid(value: string): void {
    if (uuidValidate(value)) return;
    throw new InvalidArgumentException("Invalid UUID format");
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }
}
