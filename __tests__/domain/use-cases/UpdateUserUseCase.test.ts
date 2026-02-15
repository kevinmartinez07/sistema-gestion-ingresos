import { NotFoundError } from '@/lib/server/application/errors/AppErrors';
import { IUserRepository } from '@/lib/server/application/repositories/IUserRepository';
import { UpdateUserUseCase } from '@/lib/server/application/use-cases/users/commands/UpdateUserUseCase';
import { UpdateUserRequest } from '@/lib/server/application/use-cases/users/dtos/UpdateUserRequest';
import { User } from '@/lib/server/domain/entities/User';
import { Role } from '@/lib/server/domain/value-objects/Role';

// Mock del repositorio
class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    // Crear usuario de prueba
    const testUser = new User(
      'user-123',
      'John Doe',
      'john@example.com',
      true,
      'USER' as Role,
      new Date('2026-01-01'),
      new Date('2026-01-01'),
      undefined,
      '1234567890'
    );
    this.users.set(testUser.id, testUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, data: any): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new NotFoundError('User not found');

    if (data.name !== undefined) user.name = data.name;
    if (data.role !== undefined) user.role = data.role;
    if (data.phone !== undefined) user.phone = data.phone;
    user.updatedAt = new Date();

    this.users.set(id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async count(): Promise<number> {
    return this.users.size;
  }
}

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UpdateUserUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should update user name successfully', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'Jane Doe',
      };

      const result = await useCase.execute(request);

      expect(result.name).toBe('Jane Doe');
      expect(result.id).toBe('user-123');
    });

    it('should update user role successfully', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        role: 'ADMIN' as Role,
      };

      const result = await useCase.execute(request);

      expect(result.role).toBe('ADMIN');
      expect(result.id).toBe('user-123');
    });

    it('should update user phone successfully', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        phone: '9876543210',
      };

      const result = await useCase.execute(request);

      expect(result.phone).toBe('9876543210');
      expect(result.id).toBe('user-123');
    });

    it('should update multiple fields at once', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'Jane Smith',
        role: 'ADMIN' as Role,
        phone: '5555555555',
      };

      const result = await useCase.execute(request);

      expect(result.name).toBe('Jane Smith');
      expect(result.role).toBe('ADMIN');
      expect(result.phone).toBe('5555555555');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const request: UpdateUserRequest = {
        id: 'non-existent-user',
        name: 'Jane Doe',
      };

      await expect(useCase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(useCase.execute(request)).rejects.toThrow('User not found');
    });

    it('should throw error when name is empty', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: '',
      };

      await expect(useCase.execute(request)).rejects.toThrow(
        'Name cannot be empty'
      );
    });

    it('should throw error when name is only whitespace', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: '   ',
      };

      await expect(useCase.execute(request)).rejects.toThrow(
        'Name cannot be empty'
      );
    });

    it('should not update fields that are undefined', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'Updated Name',
        // role and phone are undefined, should not change
      };

      const result = await useCase.execute(request);

      expect(result.name).toBe('Updated Name');
      expect(result.role).toBe('USER'); // Original role
      expect(result.phone).toBe('1234567890'); // Original phone
    });

    it('should update updatedAt timestamp', async () => {
      const originalUser = await mockRepository.findById('user-123');
      const originalUpdatedAt = originalUser?.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'New Name',
      };

      const result = await useCase.execute(request);

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt!.getTime()
      );
    });

    it('should preserve unchanged fields', async () => {
      const originalUser = await mockRepository.findById('user-123');

      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'New Name',
      };

      const result = await useCase.execute(request);

      expect(result.email).toBe(originalUser?.email);
      expect(result.emailVerified).toBe(originalUser?.emailVerified);
      expect(result.createdAt).toEqual(originalUser?.createdAt);
    });

    it('should keep phone when not specified in request', async () => {
      const request: UpdateUserRequest = {
        id: 'user-123',
        name: 'New Name',
        // phone not specified, should remain unchanged
      };

      const result = await useCase.execute(request);

      expect(result.phone).toBe('1234567890'); // Original phone
      expect(result.name).toBe('New Name');
    });
  });
});
