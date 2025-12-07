import { UserId } from "~/users/domain/value-object.user-id";
import { CategoryId } from "./value-object.category-id";
import { CategoryName } from "./value-object.category-name";

export type CategoryPrimitives = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Category {
  private constructor(
    private readonly id: CategoryId,
    private readonly userId: UserId,
    private name: CategoryName,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(userId: string, name: string): Category {
    return new Category(
      new CategoryId(),
      new UserId(userId),
      new CategoryName(name),
      new Date(),
      new Date()
    );
  }

  static fromPrimitives(primitives: CategoryPrimitives): Category {
    return new Category(
      new CategoryId(primitives.id),
      new UserId(primitives.userId),
      new CategoryName(primitives.name),
      primitives.createdAt,
      primitives.updatedAt
    );
  }

  toPrimitives(): CategoryPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      name: this.name.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
