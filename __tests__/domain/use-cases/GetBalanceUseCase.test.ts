import { IMovementRepository } from '@/lib/server/application/repositories/IMovementRepository';
import { GetBalanceUseCase } from '@/lib/server/application/use-cases/movements/queries/GetBalanceUseCase';

// Mock del repositorio
class MockMovementRepository implements Partial<IMovementRepository> {
  private totalIncome: number;
  private totalExpense: number;

  constructor(totalIncome: number = 0, totalExpense: number = 0) {
    this.totalIncome = totalIncome;
    this.totalExpense = totalExpense;
  }

  async getTotalIncome(userId?: string): Promise<number> {
    return this.totalIncome;
  }

  async getTotalExpense(userId?: string): Promise<number> {
    return this.totalExpense;
  }
}

describe('GetBalanceUseCase', () => {
  describe('execute', () => {
    it('should calculate balance correctly with positive result', async () => {
      const mockRepository = new MockMovementRepository(
        10000,
        3000
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(10000);
      expect(result.value.totalExpense).toBe(3000);
      expect(result.value.balance).toBe(7000);
    });

    it('should calculate balance correctly with negative result', async () => {
      const mockRepository = new MockMovementRepository(
        2000,
        5000
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(2000);
      expect(result.value.totalExpense).toBe(5000);
      expect(result.value.balance).toBe(-3000);
    });

    it('should calculate balance correctly when both are zero', async () => {
      const mockRepository = new MockMovementRepository(
        0,
        0
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(0);
      expect(result.value.totalExpense).toBe(0);
      expect(result.value.balance).toBe(0);
    });

    it('should calculate balance correctly with only income', async () => {
      const mockRepository = new MockMovementRepository(
        5000,
        0
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(5000);
      expect(result.value.totalExpense).toBe(0);
      expect(result.value.balance).toBe(5000);
    });

    it('should calculate balance correctly with only expenses', async () => {
      const mockRepository = new MockMovementRepository(
        0,
        3000
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(0);
      expect(result.value.totalExpense).toBe(3000);
      expect(result.value.balance).toBe(-3000);
    });

    it('should calculate balance correctly with decimal values', async () => {
      const mockRepository = new MockMovementRepository(
        1500.75,
        750.25
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(1500.75);
      expect(result.value.totalExpense).toBe(750.25);
      expect(result.value.balance).toBeCloseTo(750.5, 2);
    });

    it('should calculate balance correctly with large numbers', async () => {
      const mockRepository = new MockMovementRepository(
        1000000.5,
        500000.25
      ) as unknown as IMovementRepository;
      const useCase = new GetBalanceUseCase(mockRepository);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalIncome).toBe(1000000.5);
      expect(result.value.totalExpense).toBe(500000.25);
      expect(result.value.balance).toBeCloseTo(500000.25, 2);
    });

    it('should pass userId parameter to repository when provided', async () => {
      const mockRepository = new MockMovementRepository(
        5000,
        2000
      ) as unknown as IMovementRepository;
      const getTotalIncomeSpy = jest.spyOn(mockRepository, 'getTotalIncome');
      const getTotalExpenseSpy = jest.spyOn(mockRepository, 'getTotalExpense');

      const useCase = new GetBalanceUseCase(mockRepository);
      const userId = 'user-123';

      await useCase.execute({ userId });

      expect(getTotalIncomeSpy).toHaveBeenCalledWith(userId);
      expect(getTotalExpenseSpy).toHaveBeenCalledWith(userId);
    });

    it('should call repository methods without userId when not provided', async () => {
      const mockRepository = new MockMovementRepository(
        5000,
        2000
      ) as unknown as IMovementRepository;
      const getTotalIncomeSpy = jest.spyOn(mockRepository, 'getTotalIncome');
      const getTotalExpenseSpy = jest.spyOn(mockRepository, 'getTotalExpense');

      const useCase = new GetBalanceUseCase(mockRepository);

      await useCase.execute();

      expect(getTotalIncomeSpy).toHaveBeenCalledWith(undefined);
      expect(getTotalExpenseSpy).toHaveBeenCalledWith(undefined);
    });
  });
});
