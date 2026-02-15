import {
  MovementType,
  MovementTypeEnum,
} from '../../../lib/server/domain/value-objects/MovementType';

describe('MovementType Value Object', () => {
  describe('Factory methods', () => {
    it('should create INCOME type using factory', () => {
      const incomeType = MovementType.income();
      
      expect(incomeType.isIncome()).toBe(true);
      expect(incomeType.isExpense()).toBe(false);
      expect(incomeType.toString()).toBe('INCOME');
    });

    it('should create EXPENSE type using factory', () => {
      const expenseType = MovementType.expense();
      
      expect(expenseType.isExpense()).toBe(true);
      expect(expenseType.isIncome()).toBe(false);
      expect(expenseType.toString()).toBe('EXPENSE');
    });
  });

  describe('Creation from string', () => {
    it('should create INCOME from uppercase string', () => {
      const type = MovementType.fromString('INCOME');
      
      expect(type.isIncome()).toBe(true);
      expect(type.value).toBe(MovementTypeEnum.INCOME);
    });

    it('should create EXPENSE from uppercase string', () => {
      const type = MovementType.fromString('EXPENSE');
      
      expect(type.isExpense()).toBe(true);
      expect(type.value).toBe(MovementTypeEnum.EXPENSE);
    });

    it('should create INCOME from lowercase string', () => {
      const type = MovementType.fromString('income');
      
      expect(type.isIncome()).toBe(true);
    });

    it('should create EXPENSE from lowercase string', () => {
      const type = MovementType.fromString('expense');
      
      expect(type.isExpense()).toBe(true);
    });

    it('should create INCOME from mixed case string', () => {
      const type = MovementType.fromString('InCoMe');
      
      expect(type.isIncome()).toBe(true);
    });

    it('should throw error for invalid type string', () => {
      expect(() => MovementType.fromString('INVALID')).toThrow(
        'Tipo de movimiento inválido: INVALID. Debe ser INCOME o EXPENSE'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => MovementType.fromString('')).toThrow(
        'Tipo de movimiento inválido: . Debe ser INCOME o EXPENSE'
      );
    });

    it('should throw error for typo in string', () => {
      expect(() => MovementType.fromString('INCME')).toThrow(
        'Tipo de movimiento inválido'
      );
    });
  });

  describe('Type checking methods', () => {
    it('should correctly identify INCOME type', () => {
      const income = MovementType.income();
      
      expect(income.isIncome()).toBe(true);
      expect(income.isExpense()).toBe(false);
    });

    it('should correctly identify EXPENSE type', () => {
      const expense = MovementType.expense();
      
      expect(expense.isExpense()).toBe(true);
      expect(expense.isIncome()).toBe(false);
    });
  });

  describe('Comparison methods', () => {
    it('should compare same types as equal', () => {
      const income1 = MovementType.income();
      const income2 = MovementType.income();
      
      expect(income1.equals(income2)).toBe(true);
    });

    it('should compare different types as not equal', () => {
      const income = MovementType.income();
      const expense = MovementType.expense();
      
      expect(income.equals(expense)).toBe(false);
    });

    it('should compare types created from string', () => {
      const income1 = MovementType.income();
      const income2 = MovementType.fromString('INCOME');
      
      expect(income1.equals(income2)).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('should convert INCOME to string', () => {
      const income = MovementType.income();
      expect(income.toString()).toBe('INCOME');
    });

    it('should convert EXPENSE to string', () => {
      const expense = MovementType.expense();
      expect(expense.toString()).toBe('EXPENSE');
    });

    it('should return enum value', () => {
      const income = MovementType.income();
      expect(income.value).toBe(MovementTypeEnum.INCOME);
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of type', () => {
      const income = MovementType.income();
      
      expect(income.value).toBe(MovementTypeEnum.INCOME);
      
      expect(() => {
        (income as any).value = MovementTypeEnum.EXPENSE;
      }).toThrow();
    });
  });

  describe('Type safety', () => {
    it('should only allow valid enum values internally', () => {
      const income = MovementType.income();
      const expense = MovementType.expense();
      
      expect([income.value, expense.value]).toEqual([
        MovementTypeEnum.INCOME,
        MovementTypeEnum.EXPENSE,
      ]);
    });
  });
});
