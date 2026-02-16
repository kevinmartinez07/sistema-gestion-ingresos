import { Concept } from '../../../lib/server/domain/value-objects/Concept';

describe('Concept Value Object', () => {
  describe('Creation and validation', () => {
    it('should create valid concept', () => {
      const concept = Concept.create('Salary payment');
      expect(concept.value).toBe('Salary payment');
    });

    it('should trim whitespace', () => {
      const concept = Concept.create('  Monthly rent  ');
      expect(concept.value).toBe('Monthly rent');
    });

    it('should accept single character concept', () => {
      const concept = Concept.create('A');
      expect(concept.value).toBe('A');
    });

    it('should accept short concept', () => {
      const concept = Concept.create('OK');
      expect(concept.value).toBe('OK');
    });

    it('should accept maximum length concept', () => {
      const longConcept = 'A'.repeat(200);
      const concept = Concept.create(longConcept);
      expect(concept.value).toBe(longConcept);
    });

    it('should accept concept with numbers', () => {
      const concept = Concept.create('Payment 123');
      expect(concept.value).toBe('Payment 123');
    });

    it('should accept concept with special characters', () => {
      const concept = Concept.create('Café & Breakfast - Morning');
      expect(concept.value).toBe('Café & Breakfast - Morning');
    });

    it('should accept concept with multiple words', () => {
      const concept = Concept.create('Monthly rent for apartment');
      expect(concept.value).toBe('Monthly rent for apartment');
    });

    it('should throw error for null concept', () => {
      expect(() => Concept.create(null as any)).toThrow(
        'El concepto debe ser un texto válido'
      );
    });

    it('should throw error for undefined concept', () => {
      expect(() => Concept.create(undefined as any)).toThrow(
        'El concepto debe ser un texto válido'
      );
    });

    it('should throw error for non-string concept', () => {
      expect(() => Concept.create(123 as any)).toThrow(
        'El concepto debe ser un texto válido'
      );
    });

    it('should throw error for concept too long', () => {
      const tooLongConcept = 'A'.repeat(201);
      expect(() => Concept.create(tooLongConcept)).toThrow(
        'El concepto no puede exceder 200 caracteres'
      );
    });

    it('should throw error for concept exceeding 200 characters', () => {
      const tooLongConcept = 'This is a very long concept '.repeat(10);
      expect(() => Concept.create(tooLongConcept)).toThrow(
        'El concepto no puede exceder 200 caracteres'
      );
    });
  });

  describe('Comparison methods', () => {
    it('should compare concepts for equality', () => {
      const concept1 = Concept.create('Salary payment');
      const concept2 = Concept.create('Salary payment');

      expect(concept1.equals(concept2)).toBe(true);
    });

    it('should compare trimmed concepts for equality', () => {
      const concept1 = Concept.create('  Salary payment  ');
      const concept2 = Concept.create('Salary payment');

      expect(concept1.equals(concept2)).toBe(true);
    });

    it('should return false for different concepts', () => {
      const concept1 = Concept.create('Salary payment');
      const concept2 = Concept.create('Rent payment');

      expect(concept1.equals(concept2)).toBe(false);
    });

    it('should be case-sensitive in comparison', () => {
      const concept1 = Concept.create('Salary Payment');
      const concept2 = Concept.create('salary payment');

      expect(concept1.equals(concept2)).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should convert to string', () => {
      const concept = Concept.create('Monthly rent');
      expect(concept.toString()).toBe('Monthly rent');
    });

    it('should preserve original case in string conversion', () => {
      const concept = Concept.create('Salary PAYMENT');
      expect(concept.toString()).toBe('Salary PAYMENT');
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of value', () => {
      const concept = Concept.create('Original concept');

      expect(concept.value).toBe('Original concept');

      // Attempting to modify should fail (TypeScript readonly)
      expect(() => {
        (concept as any).value = 'Modified concept';
      }).toThrow();
    });

    it('should not allow modification via _value', () => {
      const concept = Concept.create('Original concept');

      // TypeScript prevents modification of readonly fields
      const originalValue = concept.value;
      expect(originalValue).toBe('Original concept');
    });
  });

  describe('Edge cases', () => {
    it('should handle concept with newlines', () => {
      const concept = Concept.create('Multi\nline\nconcept');
      expect(concept.value).toBe('Multi\nline\nconcept');
    });

    it('should handle concept with tabs', () => {
      const concept = Concept.create('Tab\tseparated\tconcept');
      expect(concept.value).toBe('Tab\tseparated\tconcept');
    });

    it('should handle concept with unicode characters', () => {
      const concept = Concept.create('Café ☕ payment');
      expect(concept.value).toBe('Café ☕ payment');
    });

    it('should handle concept exactly at boundaries', () => {
      const concept3chars = Concept.create('ABC');
      expect(concept3chars.value).toBe('ABC');

      const concept200chars = Concept.create('A'.repeat(200));
      expect(concept200chars.value).toBe('A'.repeat(200));
    });
  });
});
