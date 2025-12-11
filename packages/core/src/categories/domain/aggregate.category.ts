import { UserId } from "~/users/domain/value-object.user-id";
import { CategoryId } from "./value-object.category-id";
import { CategoryName } from "./value-object.category-name";
import { dateFromPrimitive, dateToPrimitive, Primitives } from "~/_shared/domain/primitives";
import { AggregateRoot } from "~/_shared/domain/aggregate-root";

export class Category extends AggregateRoot {
  constructor(
    public readonly id: CategoryId,
    public readonly userId: UserId,
    public name: CategoryName,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    super();
  }

  static create({
    id,
    userId,
    name,
  }: Omit<Primitives<Category>, "createdAt" | "updatedAt">): Category {
    return new Category(
      new CategoryId(id),
      new UserId(userId),
      new CategoryName(name),
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: Primitives<Category>): Category {
    return new Category(
      new CategoryId(primitives.id),
      new UserId(primitives.userId),
      new CategoryName(primitives.name),
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt)
    );
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  update(name: string): void {
    this.name = new CategoryName(name);
    this.updatedAt = new Date();
  }

  toPrimitives(): Primitives<Category> {
    return {
      id: this.id.value,
      userId: this.userId.value,
      name: this.name.value,
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
