import { Movement } from '../../../../domain/entities/Movement';
import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { GetMovementsRequest } from '../dtos/GetMovementsRequest';
import { GetMovementsResponse } from '../dtos/GetMovementsResponse';

type MovementWithUser = Movement & {
  user?: { id: string; name: string; email: string };
};

/**
 * Query: Obtener movimientos
 * Responsabilidad: Consultar movimientos con filtros opcionales
 */
export class GetMovementsUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(query?: GetMovementsRequest): Promise<GetMovementsResponse[]> {
    const movements = (await this.movementRepository.findAll(
      query
    )) as MovementWithUser[];

    return movements.map((movement) => ({
      id: movement.id,
      type: movement.type,
      amount: movement.amount,
      concept: movement.concept,
      date: movement.date,
      userId: movement.userId,
      user: movement.user,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    }));
  }

  async getById(id: string): Promise<GetMovementsResponse | null> {
    const movement = (await this.movementRepository.findById(
      id
    )) as MovementWithUser | null;

    if (!movement) return null;

    return {
      id: movement.id,
      type: movement.type,
      amount: movement.amount,
      concept: movement.concept,
      date: movement.date,
      userId: movement.userId,
      user: movement.user,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }
}
