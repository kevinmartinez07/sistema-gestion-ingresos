/**
 * Value Object: Money
 * Representa una cantidad monetaria con validación y operaciones
 */

export class Money {
  private readonly _amount: number;
  private static readonly MAX_AMOUNT = 999999999.99;
  private static readonly DECIMALS = 2;

  private constructor(amount: number) {
    this._amount = amount;
  }

  static create(amount: number): Money {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('El monto debe ser un número válido');
    }

    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }

    if (amount > Money.MAX_AMOUNT) {
      throw new Error(`El monto no puede ser mayor a ${Money.MAX_AMOUNT}`);
    }

    // Redondear a 2 decimales
    const rounded = Math.round(amount * 100) / 100;

    return new Money(rounded);
  }

  get amount(): number {
    return this._amount;
  }

  add(other: Money): Money {
    return Money.create(this._amount + other._amount);
  }

  subtract(other: Money): Money {
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error('El resultado de la resta no puede ser negativo');
    }
    return Money.create(result);
  }

  multiply(factor: number): Money {
    if (typeof factor !== 'number' || isNaN(factor)) {
      throw new Error('El factor debe ser un número válido');
    }
    return Money.create(this._amount * factor);
  }

  isGreaterThan(other: Money): boolean {
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    return this._amount < other._amount;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  toString(): string {
    return this._amount.toFixed(Money.DECIMALS);
  }

  toJSON(): number {
    return this._amount;
  }
}
