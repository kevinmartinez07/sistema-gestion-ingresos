import { DomainEvent } from './DomainEvent';

/**
 * User Created Event
 * Se dispara cuando se crea un nuevo usuario
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'user.created';
  }
}

/**
 * User Role Changed Event
 * Se dispara cuando cambia el rol de un usuario
 */
export class UserRoleChangedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousRole: string,
    public readonly newRole: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'user.role.changed';
  }
}

/**
 * User Name Updated Event
 * Se dispara cuando se actualiza el nombre de un usuario
 */
export class UserNameUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousName: string,
    public readonly newName: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'user.name.updated';
  }
}

/**
 * User Phone Updated Event
 * Se dispara cuando se actualiza el teléfono de un usuario
 */
export class UserPhoneUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly phone: string | undefined
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'user.phone.updated';
  }
}

/**
 * User Deleted Event
 * Se dispara cuando se elimina un usuario
 */
export class UserDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'user.deleted';
  }
}
