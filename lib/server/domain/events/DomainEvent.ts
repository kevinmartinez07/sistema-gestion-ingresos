/**
 * Domain Event Base
 * Clase base para todos los eventos de dominio
 */

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  protected constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract eventName(): string;
}

/**
 * Domain Event Handler
 * Interface para manejar eventos de dominio
 */
export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): void | Promise<void>;
}

/**
 * Domain Event Dispatcher
 * Despacha eventos a sus handlers
 */
export class DomainEventDispatcher {
  private static handlers: Map<string, DomainEventHandler<DomainEvent>[]> =
    new Map();

  static register<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler as DomainEventHandler<DomainEvent>);
    this.handlers.set(eventName, handlers);
  }

  static async dispatch(event: DomainEvent): Promise<void> {
    const eventName = event.eventName();
    const handlers = this.handlers.get(eventName) || [];

    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error handling event ${eventName}:`, error);
      }
    }
  }

  static clearHandlers(): void {
    this.handlers.clear();
  }
}
