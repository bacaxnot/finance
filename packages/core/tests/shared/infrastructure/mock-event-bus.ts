import { expect, jest } from "bun:test";
import type { DomainEvent } from "../../../src/shared/domain/domain-event";
import type { EventBus } from "../../../src/shared/domain/event-bus";

export class MockEventBus implements EventBus {
  private readonly mockPublish = jest.fn();

  async publish(events: DomainEvent[]): Promise<void> {
    expect(this.mockPublish).toHaveBeenCalledWith(events);
  }

  shouldPublish(events: DomainEvent[]): void {
    this.mockPublish(events);
  }
}
