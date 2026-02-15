import { IMovementRepository } from '@/lib/server/application/repositories/IMovementRepository';
import { CreateMovementUseCase } from '@/lib/server/application/use-cases/movements/commands/CreateMovementUseCase';
import { CreateMovementRequest } from '@/lib/server/application/use-cases/movements/dtos/CreateMovementRequest';
import { Movement } from '@/lib/server/domain/entities/Movement';

// Mock del repositorio
class MockMovementRepository implements Partial<IMovementRepository> {
  async create(data: CreateMovementRequest): Promise<Movement> {
    return new Movement(
      'generated-id',
      data.type,
      data.amount,
      data.concept,
      data.date,
      data.userId,
      new Date(),
      new Date()
    );
  }
}

describe('CreateMovementUseCase', () => {
  let useCase: CreateMovementUseCase;
  let mockRepository: IMovementRepository;

  beforeEach(() => {
    mockRepository = new MockMovementRepository() as IMovementRepository;
    useCase = new CreateMovementUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a movement successfully with valid data', async () => {
      const validData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 1500,
        concept: 'Test income',
        date: new Date('2026-02-14'),
        userId: 'user-123',
      };

      const result = await useCase.execute(validData);

      expect(result.id).toBe('generated-id');
      expect(result.type).toBe('INCOME');
      expect(result.amount).toBe(1500);
      expect(result.concept).toBe('Test income');
      expect(result.userId).toBe('user-123');
    });

    it('should throw error when amount is zero', async () => {
      const invalidData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 0,
        concept: 'Test',
        date: new Date('2026-02-14'),
        userId: 'user-123',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow(
        'Amount must be greater than 0'
      );
    });

    it('should throw error when amount is negative', async () => {
      const invalidData: CreateMovementRequest = {
        type: 'INCOME',
        amount: -100,
        concept: 'Test',
        date: new Date('2026-02-14'),
        userId: 'user-123',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow(
        'Amount must be greater than 0'
      );
    });

    it('should throw error when concept is empty', async () => {
      const invalidData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 1000,
        concept: '',
        date: new Date('2026-02-14'),
        userId: 'user-123',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow(
        'Concept cannot be empty'
      );
    });

    it('should throw error when concept contains only whitespace', async () => {
      const invalidData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 1000,
        concept: '   ',
        date: new Date('2026-02-14'),
        userId: 'user-123',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow(
        'Concept cannot be empty'
      );
    });

    it('should throw error when date is in the future', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 1000,
        concept: 'Test',
        date: futureDate,
        userId: 'user-123',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow(
        'Date cannot be in the future'
      );
    });

    it('should accept date from the past', async () => {
      const pastDate = new Date('2020-01-01');

      const validData: CreateMovementRequest = {
        type: 'INCOME',
        amount: 1000,
        concept: 'Old income',
        date: pastDate,
        userId: 'user-123',
      };

      const result = await useCase.execute(validData);

      expect(result.date).toEqual(pastDate);
    });

    it("should accept today's date", async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const validData: CreateMovementRequest = {
        type: 'EXPENSE',
        amount: 500,
        concept: 'Today expense',
        date: today,
        userId: 'user-123',
      };

      const result = await useCase.execute(validData);

      expect(result.type).toBe('EXPENSE');
    });
  });
});
