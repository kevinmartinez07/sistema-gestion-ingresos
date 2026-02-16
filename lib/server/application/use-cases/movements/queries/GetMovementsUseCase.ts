import { Movement } from '../../../../domain/entities/Movement';
import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { Result } from '../../../shared/Result';
import { GetMovementsRequest } from '../dtos/GetMovementsRequest';
import { GetMovementsResponse } from '../dtos/GetMovementsResponse';

type MovementWithUser = Movement & {
  user?: { id: string; name: string; email: string };
};

/** Get movements query */
export class GetMovementsUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    query?: GetMovementsRequest
  ): Promise<Result<GetMovementsResponse[]>> {
    const movements = (await this.movementRepository.findAll(
      query
    )) as MovementWithUser[];

    const response = movements.map((movement) => ({
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

    return Result.ok(response);
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
