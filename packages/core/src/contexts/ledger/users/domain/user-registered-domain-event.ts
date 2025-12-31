import { DomainEvent } from "../../../../shared/domain/domain-event";

export class UserRegisteredDomainEvent extends DomainEvent {
  static eventName = "toke.ledger.user.registered";

  constructor(
    private readonly id: string,
    private readonly firstName: string,
    private readonly lastName: string,
  ) {
    super(UserRegisteredDomainEvent.eventName, id);
  }

  toPrimitives() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
