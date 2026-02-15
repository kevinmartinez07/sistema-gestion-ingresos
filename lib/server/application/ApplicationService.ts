// Repositorios
import { PrismaMovementRepository } from '../infrastructure/repositories/PrismaMovementRepository';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';

// Commands - Movements
import { CreateMovementUseCase } from './use-cases/movements/commands/CreateMovementUseCase';
import { DeleteMovementUseCase } from './use-cases/movements/commands/DeleteMovementUseCase';

// Queries - Movements
import { GetBalanceUseCase } from './use-cases/movements/queries/GetBalanceUseCase';
import { GetMovementsUseCase } from './use-cases/movements/queries/GetMovementsUseCase';

// Commands - Users
import { DeleteUserUseCase } from './use-cases/users/commands/DeleteUserUseCase';
import { UpdateUserUseCase } from './use-cases/users/commands/UpdateUserUseCase';

// Queries - Users
import { GetUsersUseCase } from './use-cases/users/queries/GetUsersUseCase';

/**
 * Servicio central de aplicación con patrón CQRS
 * Separa Commands (escritura) de Queries (lectura)
 */
class ApplicationService {
  // Repositorios Singleton
  private readonly movementRepository = new PrismaMovementRepository();
  private readonly userRepository = new PrismaUserRepository();

  // Commands - Movements
  public readonly createMovement = new CreateMovementUseCase(
    this.movementRepository
  );
  public readonly deleteMovement = new DeleteMovementUseCase(
    this.movementRepository
  );

  // Queries - Movements
  public readonly getMovements = new GetMovementsUseCase(
    this.movementRepository
  );
  public readonly getBalance = new GetBalanceUseCase(this.movementRepository);

  // Commands - Users
  public readonly updateUser = new UpdateUserUseCase(this.userRepository);
  public readonly deleteUser = new DeleteUserUseCase(this.userRepository);

  // Queries - Users
  public readonly getUsers = new GetUsersUseCase(this.userRepository);
}

// Export singleton instance
export const appService = new ApplicationService();
