import { NotFoundError } from '@/lib/server/application/errors/AppErrors';
import { IMovementRepository } from '@/lib/server/application/repositories/IMovementRepository';
import { DeleteMovementUseCase } from '@/lib/server/application/use-cases/movements/commands/DeleteMovementUseCase';
import { DeleteMovementRequest } from '@/lib/server/application/use-cases/movements/dtos/DeleteMovementRequest';
import { Movement } from '@/lib/server/domain/entities/Movement';

// Mock del repositorio
class MockMovementRepository implements IMovementRepository {
  private movements: Map<string, Movement> = new Map();

  constructor() {
    // Crear movimientos de prueba
    const movement1 = new Movement(
      'movement-123',
      'INCOME',
      1000,
      'Test income',
      new Date('2026-02-01'),
      'user-123',
      new Date('2026-02-01'),
      new Date('2026-02-01')
    );

    const movement2 = new Movement(
      'movement-456',
      'EXPENSE',
      500,
      'Test expense',
      new Date('2026-02-02'),
      'user-123',
      new Date('2026-02-02'),
      new Date('2026-02-02')
    );

    this.movements.set(movement1.id, movement1);
    this.movements.set(movement2.id, movement2);
  }

  async create(data: any): Promise<Movement> {
    throw new Error('Not implemented in this test');
  }

  async findById(id: string): Promise<Movement | null> {
    return this.movements.get(id) || null;
  }

  async findAll(filters?: any): Promise<Movement[]> {
    return Array.from(this.movements.values());
  }

  async update(id: string, data: any): Promise<Movement> {
    throw new Error('Not implemented in this test');
  }

  async delete(id: string): Promise<void> {
    this.movements.delete(id);
  }

  async countByUserId(userId: string): Promise<number> {
    return Array.from(this.movements.values()).filter(m => m.userId === userId).length;
  }

  async getTotalBalance(userId?: string): Promise<number> {
    return 0;
  }

  async getTotalIncome(userId?: string): Promise<number> {
    return 0;
  }

  async getTotalExpense(userId?: string): Promise<number> {
    return 0;
  }
}

describe('DeleteMovementUseCase', () => {
  let useCase: DeleteMovementUseCase;
  let mockRepository: IMovementRepository;

  beforeEach(() => {
    mockRepository = new MockMovementRepository();
    useCase = new DeleteMovementUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should delete movement successfully', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-123',
      };

      await useCase.execute(request);

      // Verify movement was deleted
      const deletedMovement = await mockRepository.findById('movement-123');
      expect(deletedMovement).toBeNull();
    });

    it('should throw NotFoundError when movement does not exist', async () => {
      const request: DeleteMovementRequest = {
        id: 'non-existent-movement',
      };

      await expect(useCase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(useCase.execute(request)).rejects.toThrow(
        'Movement not found'
      );
    });

    it('should delete income movement', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-123', // Income movement
      };

      await useCase.execute(request);

      const deletedMovement = await mockRepository.findById('movement-123');
      expect(deletedMovement).toBeNull();
    });

    it('should delete expense movement', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-456', // Expense movement
      };

      await useCase.execute(request);

      const deletedMovement = await mockRepository.findById('movement-456');
      expect(deletedMovement).toBeNull();
    });

    it('should not affect other movements when deleting one', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-123',
      };

      await useCase.execute(request);

      // Verify first movement was deleted
      const deletedMovement = await mockRepository.findById('movement-123');
      expect(deletedMovement).toBeNull();

      // Verify second movement still exists
      const existingMovement = await mockRepository.findById('movement-456');
      expect(existingMovement).toBeDefined();
      expect(existingMovement?.id).toBe('movement-456');
    });

    it('should throw error when trying to delete same movement twice', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-123',
      };

      // First deletion should succeed
      await useCase.execute(request);

      // Second deletion should fail
      await expect(useCase.execute(request)).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when deletion is successful (void return)', async () => {
      const request: DeleteMovementRequest = {
        id: 'movement-123',
      };

      const result = await useCase.execute(request);

      expect(result).toBeUndefined();
    });
  });

  describe('Validation', () => {
    it('should validate movement existence before deletion', async () => {
      const request: DeleteMovementRequest = {
        id: 'invalid-id',
      };

      await expect(useCase.execute(request)).rejects.toThrow(NotFoundError);
    });
  });
});
