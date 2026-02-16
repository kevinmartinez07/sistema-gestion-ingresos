import {
  DomainEventDispatcher,
  MovementCreatedEvent,
  MovementUpdatedEvent,
} from '../events';
import { Concept } from '../value-objects/Concept';
import { Money } from '../value-objects/Money';
import { MovementType as MovementTypeVO } from '../value-objects/MovementType';

export type MovementType = 'INCOME' | 'EXPENSE';

export class Movement {
  private readonly _type: MovementTypeVO;
  private _amount: Money;
  private _concept: Concept;

  constructor(
    public readonly id: string,
    typeValue: MovementType,
    amountValue: number,
    conceptValue: string,
    public date: Date,
    public readonly userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this._type = MovementTypeVO.fromString(typeValue);
    this._amount = Money.create(amountValue);
    this._concept = Concept.create(conceptValue);
  }

  /**
   * Factory method para crear un movimiento con validación completa
   */
  static create(props: {
    id: string;
    type: MovementType;
    amount: number;
    concept: string;
    date: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Movement {
    const movement = new Movement(
      props.id,
      props.type,
      props.amount,
      props.concept,
      props.date,
      props.userId,
      props.createdAt,
      props.updatedAt
    );

    DomainEventDispatcher.dispatch(
      new MovementCreatedEvent(
        movement.id,
        movement.type,
        movement.amount,
        movement.concept,
        movement.userId,
        movement.date
      )
    );

    return movement;
  }

  get type(): MovementType {
    return this._type.value as MovementType;
  }

  get amount(): number {
    return this._amount.amount;
  }

  set amount(value: number) {
    this._amount = Money.create(value);
  }

  get concept(): string {
    return this._concept.value;
  }

  set concept(value: string) {
    this._concept = Concept.create(value);
  }

  get typeVO(): MovementTypeVO {
    return this._type;
  }

  get amountVO(): Money {
    return this._amount;
  }

  get conceptVO(): Concept {
    return this._concept;
  }

  isIncome(): boolean {
    return this._type.isIncome();
  }

  isExpense(): boolean {
    return this._type.isExpense();
  }

  getSignedAmount(): number {
    return this.isIncome() ? this.amount : -this.amount;
  }

  updateAmount(newAmount: number): void {
    this._amount = Money.create(newAmount);
    this.updatedAt = new Date();

    DomainEventDispatcher.dispatch(
      new MovementUpdatedEvent(this.id, this.type, this.amount, this.concept)
    );
  }

  updateConcept(newConcept: string): void {
    this._concept = Concept.create(newConcept);
    this.updatedAt = new Date();

    DomainEventDispatcher.dispatch(
      new MovementUpdatedEvent(this.id, this.type, this.amount, this.concept)
    );
  }

  updateDate(newDate: Date): void {
    if (newDate > new Date()) {
      throw new Error('Date cannot be in the future');
    }
    this.date = newDate;
    this.updatedAt = new Date();
  }
}
