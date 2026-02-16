/** Create movement command */
import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { Result } from '../../../shared/Result';
import { CreateMovementRequest } from '../dtos/CreateMovementRequest';
import { CreateMovementResponse } from '../dtos/CreateMovementResponse';

export class CreateMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    input: CreateMovementRequest
  ): Promise<Result<CreateMovementResponse>> {
    try {
      const movement = await this.movementRepository.create(input);

      const response: CreateMovementResponse = {
        id: movement.id,
        type: movement.type,
        amount: movement.amount,
        concept: movement.concept,
        date: movement.date,
        userId: movement.userId,
        createdAt: movement.createdAt,
        updatedAt: movement.updatedAt,
      };

      return Result.ok(response);
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }
}
