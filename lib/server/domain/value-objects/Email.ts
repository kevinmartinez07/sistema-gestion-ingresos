/**
 * Value Object: Email
 * Representa un email válido con validación de formato
 */

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(email: string): Email {
    if (!email || typeof email !== 'string') {
      throw new Error('Email no puede estar vacío');
    }

    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Formato de email inválido');
    }

    if (trimmedEmail.length > 255) {
      throw new Error('Email demasiado largo (máximo 255 caracteres)');
    }

    return new Email(trimmedEmail);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
