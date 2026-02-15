/**
 * Value Object: Phone
 * Representa un número de teléfono válido
 */

export class Phone {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(phone: string): Phone {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Teléfono no puede estar vacío');
    }

    const trimmedPhone = phone.trim();

    // Remover caracteres no numéricos para validación
    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      throw new Error('Teléfono debe tener entre 10 y 15 dígitos');
    }

    return new Phone(trimmedPhone);
  }

  static createOptional(phone?: string | null): Phone | undefined {
    if (!phone) return undefined;
    return Phone.create(phone);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Phone): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
