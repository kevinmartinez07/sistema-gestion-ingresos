/**
 * Value Object: Concept
 * Representa el concepto/descripción de un movimiento
 */

export class Concept {
  private readonly _value: string;
  private static readonly MAX_LENGTH = 200;

  private constructor(value: string) {
    this._value = value;
  }

  static create(concept: string): Concept {
    if (
      concept === null ||
      concept === undefined ||
      typeof concept !== 'string'
    ) {
      throw new Error('El concepto debe ser un texto válido');
    }

    const trimmedConcept = concept.trim();

    if (trimmedConcept.length > Concept.MAX_LENGTH) {
      throw new Error(
        `El concepto no puede exceder ${Concept.MAX_LENGTH} caracteres`
      );
    }

    return new Concept(trimmedConcept);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Concept): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
