import { Movement } from '@/lib/server/domain/entities/Movement';

describe('Movement Entity', () => {
  const validMovementData = {
    id: 'test-id-123',
    type: 'INCOME' as const,
    amount: 1000,
    concept: 'Test income',
    date: new Date('2026-02-14'),
    userId: 'user-id-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Constructor and validation', () => {
    it('should create a valid Movement instance', () => {
      const movement = new Movement(
        validMovementData.id,
        validMovementData.type,
        validMovementData.amount,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(movement.id).toBe(validMovementData.id);
      expect(movement.type).toBe(validMovementData.type);
      expect(movement.amount).toBe(validMovementData.amount);
      expect(movement.concept).toBe(validMovementData.concept);
    });

    it('should throw error when amount is zero or negative', () => {
      expect(() => {
        new Movement(
          validMovementData.id,
          validMovementData.type,
          0,
          validMovementData.concept,
          validMovementData.date,
          validMovementData.userId,
          validMovementData.createdAt,
          validMovementData.updatedAt
        );
      }).toThrow('Amount must be greater than 0');

      expect(() => {
        new Movement(
          validMovementData.id,
          validMovementData.type,
          -100,
          validMovementData.concept,
          validMovementData.date,
          validMovementData.userId,
          validMovementData.createdAt,
          validMovementData.updatedAt
        );
      }).toThrow('Amount must be greater than 0');
    });

    it('should throw error when concept is empty', () => {
      expect(() => {
        new Movement(
          validMovementData.id,
          validMovementData.type,
          validMovementData.amount,
          '',
          validMovementData.date,
          validMovementData.userId,
          validMovementData.createdAt,
          validMovementData.updatedAt
        );
      }).toThrow('Concept cannot be empty');
    });

    it('should throw error when date is in the future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      expect(() => {
        new Movement(
          validMovementData.id,
          validMovementData.type,
          validMovementData.amount,
          validMovementData.concept,
          futureDate,
          validMovementData.userId,
          validMovementData.createdAt,
          validMovementData.updatedAt
        );
      }).toThrow('Date cannot be in the future');
    });
  });

  describe('Business methods', () => {
    it('should correctly identify income type', () => {
      const income = new Movement(
        validMovementData.id,
        'INCOME',
        validMovementData.amount,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(income.isIncome()).toBe(true);
      expect(income.isExpense()).toBe(false);
    });

    it('should correctly identify expense type', () => {
      const expense = new Movement(
        validMovementData.id,
        'EXPENSE',
        validMovementData.amount,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(expense.isIncome()).toBe(false);
      expect(expense.isExpense()).toBe(true);
    });

    it('should return correct signed amount for income', () => {
      const income = new Movement(
        validMovementData.id,
        'INCOME',
        1000,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(income.getSignedAmount()).toBe(1000);
    });

    it('should return correct signed amount for expense', () => {
      const expense = new Movement(
        validMovementData.id,
        'EXPENSE',
        1000,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(expense.getSignedAmount()).toBe(-1000);
    });

    it('should update amount correctly', () => {
      const movement = new Movement(
        validMovementData.id,
        validMovementData.type,
        1000,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      movement.updateAmount(2000);

      expect(movement.amount).toBe(2000);
    });

    it('should throw error when updating amount to invalid value', () => {
      const movement = new Movement(
        validMovementData.id,
        validMovementData.type,
        validMovementData.amount,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(() => {
        movement.updateAmount(0);
      }).toThrow('Amount must be greater than 0');
    });

    it('should update concept correctly', () => {
      const movement = new Movement(
        validMovementData.id,
        validMovementData.type,
        validMovementData.amount,
        'Old concept',
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      movement.updateConcept('New concept');

      expect(movement.concept).toBe('New concept');
    });

    it('should throw error when updating concept to empty', () => {
      const movement = new Movement(
        validMovementData.id,
        validMovementData.type,
        validMovementData.amount,
        validMovementData.concept,
        validMovementData.date,
        validMovementData.userId,
        validMovementData.createdAt,
        validMovementData.updatedAt
      );

      expect(() => {
        movement.updateConcept('');
      }).toThrow('Concept cannot be empty');
    });
  });
});
