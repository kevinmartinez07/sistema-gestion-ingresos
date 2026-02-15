/**
 * Value Object: MovementType
 * Representa el tipo de movimiento (INCOME o EXPENSE)
 */

export enum MovementTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class MovementType {
  private readonly _type: MovementTypeEnum;

  private constructor(type: MovementTypeEnum) {
    this._type = type;
  }

  static income(): MovementType {
    return new MovementType(MovementTypeEnum.INCOME);
  }

  static expense(): MovementType {
    return new MovementType(MovementTypeEnum.EXPENSE);
  }

  static fromString(type: string): MovementType {
    const upperType = type.toUpperCase();

    if (upperType === MovementTypeEnum.INCOME) {
      return MovementType.income();
    }

    if (upperType === MovementTypeEnum.EXPENSE) {
      return MovementType.expense();
    }

    throw new Error(
      `Tipo de movimiento inválido: ${type}. Debe ser INCOME o EXPENSE`
    );
  }

  isIncome(): boolean {
    return this._type === MovementTypeEnum.INCOME;
  }

  isExpense(): boolean {
    return this._type === MovementTypeEnum.EXPENSE;
  }

  equals(other: MovementType): boolean {
    return this._type === other._type;
  }

  toString(): string {
    return this._type;
  }

  get value(): MovementTypeEnum {
    return this._type;
  }
}
