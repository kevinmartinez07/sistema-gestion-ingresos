import { Money } from '../../../lib/server/domain/value-objects/Money';

describe('Money Value Object', () => {
  describe('Creation and validation', () => {
    it('should create valid money amount', () => {
      const money = Money.create(100.50);
      expect(money.amount).toBe(100.50);
    });

    it('should round to 2 decimal places', () => {
      const money = Money.create(100.555);
      expect(money.amount).toBe(100.56);
    });

    it('should accept minimum amount', () => {
      const money = Money.create(0.01);
      expect(money.amount).toBe(0.01);
    });

    it('should accept maximum amount', () => {
      const money = Money.create(999999999.99);
      expect(money.amount).toBe(999999999.99);
    });

    it('should throw error for zero amount', () => {
      expect(() => Money.create(0)).toThrow('Amount must be greater than 0');
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.create(-10)).toThrow('Amount must be greater than 0');
    });

    it('should throw error for amount exceeding maximum', () => {
      expect(() => Money.create(1000000000)).toThrow(
        'Amount must be less than or equal to 999999999.99'
      );
    });

    it('should throw error for non-numeric value', () => {
      expect(() => Money.create('100' as any)).toThrow(
        'El monto debe ser un número válido'
      );
    });

    it('should throw error for NaN', () => {
      expect(() => Money.create(NaN)).toThrow(
        'El monto debe ser un número válido'
      );
    });
  });

  describe('Arithmetic operations', () => {
    it('should add two money amounts', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      const result = money1.add(money2);
      
      expect(result.amount).toBe(150);
    });

    it('should subtract two money amounts', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(70);
    });

    it('should throw error when subtraction results in negative', () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      
      expect(() => money1.subtract(money2)).toThrow(
        'El resultado de la resta no puede ser negativo'
      );
    });

    it('should multiply money by factor', () => {
      const money = Money.create(50);
      const result = money.multiply(3);
      
      expect(result.amount).toBe(150);
    });

    it('should multiply money by decimal factor', () => {
      const money = Money.create(100);
      const result = money.multiply(0.5);
      
      expect(result.amount).toBe(50);
    });

    it('should throw error when multiplying by non-number', () => {
      const money = Money.create(100);
      
      expect(() => money.multiply('2' as any)).toThrow(
        'El factor debe ser un número válido'
      );
    });

    it('should handle decimal precision in operations', () => {
      const money1 = Money.create(10.10);
      const money2 = Money.create(20.20);
      const result = money1.add(money2);
      
      expect(result.amount).toBe(30.30);
    });
  });

  describe('Comparison methods', () => {
    it('should compare if amount is greater than other', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isGreaterThan(money1)).toBe(false);
    });

    it('should compare if amount is less than other', () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      
      expect(money1.isLessThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(false);
    });

    it('should check equality between amounts', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      const money3 = Money.create(50);
      
      expect(money1.equals(money2)).toBe(true);
      expect(money1.equals(money3)).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should convert to string with 2 decimals', () => {
      const money = Money.create(100.5);
      expect(money.toString()).toBe('100.50');
    });

    it('should convert to JSON as number', () => {
      const money = Money.create(100.50);
      expect(money.toJSON()).toBe(100.50);
    });
  });

  describe('Immutability', () => {
    it('should not mutate original money in operations', () => {
      const original = Money.create(100);
      const added = original.add(Money.create(50));
      
      expect(original.amount).toBe(100);
      expect(added.amount).toBe(150);
    });

    it('should not mutate when subtracting', () => {
      const original = Money.create(100);
      const subtracted = original.subtract(Money.create(30));
      
      expect(original.amount).toBe(100);
      expect(subtracted.amount).toBe(70);
    });

    it('should not mutate when multiplying', () => {
      const original = Money.create(50);
      const multiplied = original.multiply(2);
      
      expect(original.amount).toBe(50);
      expect(multiplied.amount).toBe(100);
    });
  });
});
