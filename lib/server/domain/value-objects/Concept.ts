/**
 * Value Object: Concept
 * Representa el concepto/descripción de un movimiento
 */

export class Concept {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  private constructor(value: string) {
    this._value = value;
  }

  static create(concept: string): Concept {
    if (!concept || typeof concept !== 'string') {
      throw new Error('Concept cannot be empty');
    }

    const trimmedConcept = concept.trim();

    if (trimmedConcept.length < Concept.MIN_LENGTH) {
      throw new Error(
        `Concept must be at least ${Concept.MIN_LENGTH} characters`
      );
    }

    if (trimmedConcept.length > Concept.MAX_LENGTH) {
      throw new Error(`Concept cannot exceed ${Concept.MAX_LENGTH} characters`);
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
