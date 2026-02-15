import { Email } from '../../../lib/server/domain/value-objects/Email';

describe('Email Value Object', () => {
  describe('Creation and validation', () => {
    it('should create valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('User@EXAMPLE.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = Email.create('user@mail.example.com');
      expect(email.value).toBe('user@mail.example.com');
    });

    it('should accept email with numbers', () => {
      const email = Email.create('user123@example456.com');
      expect(email.value).toBe('user123@example456.com');
    });

    it('should accept email with dots in local part', () => {
      const email = Email.create('first.last@example.com');
      expect(email.value).toBe('first.last@example.com');
    });

    it('should accept email with hyphens', () => {
      const email = Email.create('user@my-example.com');
      expect(email.value).toBe('user@my-example.com');
    });

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow('Email no puede estar vacío');
    });

    it('should throw error for null email', () => {
      expect(() => Email.create(null as any)).toThrow(
        'Email no puede estar vacío'
      );
    });

    it('should throw error for undefined email', () => {
      expect(() => Email.create(undefined as any)).toThrow(
        'Email no puede estar vacío'
      );
    });

    it('should throw error for non-string email', () => {
      expect(() => Email.create(123 as any)).toThrow(
        'Email no puede estar vacío'
      );
    });

    it('should throw error for email without @', () => {
      expect(() => Email.create('userexample.com')).toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for email without domain', () => {
      expect(() => Email.create('user@')).toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for email without local part', () => {
      expect(() => Email.create('@example.com')).toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for email without TLD', () => {
      expect(() => Email.create('user@example')).toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for email with spaces', () => {
      expect(() => Email.create('user name@example.com')).toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for email exceeding 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(() => Email.create(longEmail)).toThrow(
        'Email demasiado largo (máximo 255 caracteres)'
      );
    });
  });

  describe('Comparison methods', () => {
    it('should compare emails for equality', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('user@example.com');
      
      expect(email1.equals(email2)).toBe(true);
    });

    it('should compare normalized emails for equality', () => {
      const email1 = Email.create('User@Example.COM');
      const email2 = Email.create('user@example.com');
      
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('user1@example.com');
      const email2 = Email.create('user2@example.com');
      
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should convert to string', () => {
      const email = Email.create('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of value', () => {
      const email = Email.create('user@example.com');
      
      expect(email.value).toBe('user@example.com');
      expect(() => {
        (email as any).value = 'changed@example.com';
      }).toThrow();
    });
  });
});
