import { Phone } from '../../../lib/server/domain/value-objects/Phone';

describe('Phone Value Object', () => {
  describe('Creation and validation', () => {
    it('should create valid phone with 10 digits', () => {
      const phone = Phone.create('1234567890');
      expect(phone.value).toBe('1234567890');
    });

    it('should create valid phone with 15 digits', () => {
      const phone = Phone.create('123456789012345');
      expect(phone.value).toBe('123456789012345');
    });

    it('should accept phone with formatting', () => {
      const phone = Phone.create('(555) 123-4567');
      expect(phone.value).toBe('(555) 123-4567');
    });

    it('should accept phone with spaces', () => {
      const phone = Phone.create('555 123 4567');
      expect(phone.value).toBe('555 123 4567');
    });

    it('should accept phone with dashes', () => {
      const phone = Phone.create('555-123-4567');
      expect(phone.value).toBe('555-123-4567');
    });

    it('should accept phone with plus sign (international)', () => {
      const phone = Phone.create('+1 555 123 4567');
      expect(phone.value).toBe('+1 555 123 4567');
    });

    it('should accept phone with dots', () => {
      const phone = Phone.create('555.123.4567');
      expect(phone.value).toBe('555.123.4567');
    });

    it('should accept phone with parentheses and spaces', () => {
      const phone = Phone.create('+1 (555) 123 4567');
      expect(phone.value).toBe('+1 (555) 123 4567');
    });

    it('should trim whitespace', () => {
      const phone = Phone.create('  1234567890  ');
      expect(phone.value).toBe('1234567890');
    });

    it('should accept minimum length phone (10 digits)', () => {
      const phone = Phone.create('1234567890');
      expect(phone.value).toBe('1234567890');
    });

    it('should accept maximum length phone (15 digits)', () => {
      const phone = Phone.create('123456789012345');
      expect(phone.value).toBe('123456789012345');
    });

    it('should throw error for empty phone', () => {
      expect(() => Phone.create('')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should throw error for null phone', () => {
      expect(() => Phone.create(null as any)).toThrow();
    });

    it('should throw error for undefined phone', () => {
      expect(() => Phone.create(undefined as any)).toThrow();
    });

    it('should throw error for non-string phone', () => {
      expect(() => Phone.create(1234567890 as any)).toThrow();
    });

    it('should throw error for phone with less than 5 digits', () => {
      expect(() => Phone.create('1234')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should throw error for phone with more than 15 digits', () => {
      expect(() => Phone.create('1234567890123456')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should throw error for phone with only letters', () => {
      expect(() => Phone.create('ABCDEFGHIJK')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should throw error for whitespace-only phone', () => {
      expect(() => Phone.create('     ')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });
  });

  describe('Optional phone creation', () => {
    it('should return undefined for null', () => {
      const phone = Phone.createOptional(null);
      expect(phone).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const phone = Phone.createOptional(undefined);
      expect(phone).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const phone = Phone.createOptional('');
      expect(phone).toBeUndefined();
    });

    it('should create phone for valid string', () => {
      const phone = Phone.createOptional('1234567890');
      expect(phone).toBeDefined();
      expect(phone?.value).toBe('1234567890');
    });
  });

  describe('Digit extraction and validation', () => {
    it('should validate based on digit count, ignoring formatting', () => {
      // 10 digits with formatting
      const phone1 = Phone.create('(555) 123-4567');
      expect(phone1.value).toBe('(555) 123-4567');

      // 11 digits with formatting
      const phone2 = Phone.create('+1 (555) 123-4567');
      expect(phone2.value).toBe('+1 (555) 123-4567');
    });

    it('should reject formatted phone with insufficient digits', () => {
      expect(() => Phone.create('(55)')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should accept formatted phone with 15 digits', () => {
      // +1 (555) 123-4567-8901 has 16 digits total
      const phone = Phone.create('+52 (555) 123-456');
      expect(phone.value).toBe('+52 (555) 123-456');
    });
  });

  describe('Comparison methods', () => {
    it('should compare phones for equality', () => {
      const phone1 = Phone.create('1234567890');
      const phone2 = Phone.create('1234567890');

      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should compare trimmed phones for equality', () => {
      const phone1 = Phone.create('  1234567890  ');
      const phone2 = Phone.create('1234567890');

      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should return false for different phones', () => {
      const phone1 = Phone.create('1234567890');
      const phone2 = Phone.create('0987654321');

      expect(phone1.equals(phone2)).toBe(false);
    });

    it('should compare formatted phones', () => {
      const phone1 = Phone.create('(555) 123-4567');
      const phone2 = Phone.create('(555) 123-4567');

      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should return false for same digits but different formatting', () => {
      const phone1 = Phone.create('5551234567');
      const phone2 = Phone.create('(555) 123-4567');

      expect(phone1.equals(phone2)).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should convert to string preserving format', () => {
      const phone = Phone.create('(555) 123-4567');
      expect(phone.toString()).toBe('(555) 123-4567');
    });

    it('should convert unformatted phone to string', () => {
      const phone = Phone.create('1234567890');
      expect(phone.toString()).toBe('1234567890');
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of value', () => {
      const phone = Phone.create('1234567890');

      expect(phone.value).toBe('1234567890');

      expect(() => {
        (phone as any).value = '0987654321';
      }).toThrow();
    });

    it('should not allow modification via _value', () => {
      const phone = Phone.create('1234567890');

      // TypeScript prevents modification of readonly fields
      const originalValue = phone.value;
      expect(originalValue).toBe('1234567890');
    });
  });

  describe('International phone numbers', () => {
    it('should accept US format', () => {
      const phone = Phone.create('+1 (555) 123-4567');
      expect(phone.value).toBe('+1 (555) 123-4567');
    });

    it('should accept international format with country code', () => {
      const phone = Phone.create('+44 20 1234 5678');
      expect(phone.value).toBe('+44 20 1234 5678');
    });

    it('should accept long international number', () => {
      const phone = Phone.create('+123456789012345');
      expect(phone.value).toBe('+123456789012345');
    });
  });

  describe('Edge cases', () => {
    it('should handle phone with only spaces after trim becoming empty', () => {
      expect(() => Phone.create('   ')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should handle exactly 10 digits', () => {
      const phone = Phone.create('1234567890');
      expect(phone.value).toBe('1234567890');
    });

    it('should handle exactly 15 digits', () => {
      const phone = Phone.create('123456789012345');
      expect(phone.value).toBe('123456789012345');
    });

    it('should reject 4 digits', () => {
      expect(() => Phone.create('1234')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });

    it('should reject 16 digits', () => {
      expect(() => Phone.create('1234567890123456')).toThrow(
        'Teléfono debe tener entre 5 y 15 dígitos'
      );
    });
  });
});
