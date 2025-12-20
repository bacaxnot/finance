import { AggregateRoot } from "../../_shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../_shared/domain/primitives";
import { UserId } from "../../users/domain/user-id";
import { CategoryId } from "./category-id";
import { CategoryName } from "./category-name";

export type CategoryPrimitives = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class Category extends AggregateRoot {
  private constructor(
    private readonly id: CategoryId,
    private readonly userId: UserId,
    private name: CategoryName,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    userId: string;
    name: string;
  }): Category {
    const now = dateToPrimitive(new Date());
    return Category.fromPrimitives({
      id: params.id,
      userId: params.userId,
      name: params.name,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrimitives(primitives: CategoryPrimitives): Category {
    return new Category(
      new CategoryId(primitives.id),
      new UserId(primitives.userId),
      new CategoryName(primitives.name),
      dateFromPrimitive(primitives.createdAt),
      dateFromPrimitive(primitives.updatedAt),
    );
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  update(name: string): void {
    this.name = new CategoryName(name);
    this.updatedAt = new Date();
  }

  toPrimitives(): CategoryPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      name: this.name.value,
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
