import { DomainEvent } from './DomainEvent';

/**
 * Movement Created Event
 * Se dispara cuando se crea un nuevo movimiento
 */
export class MovementCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly concept: string,
    public readonly userId: string,
    public readonly date: Date
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'movement.created';
  }
}

/**
 * Movement Updated Event
 * Se dispara cuando se actualiza un movimiento
 */
export class MovementUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly concept: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'movement.updated';
  }
}

/**
 * Movement Deleted Event
 * Se dispara cuando se elimina un movimiento
 */
export class MovementDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly amount: number
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'movement.deleted';
  }
}
