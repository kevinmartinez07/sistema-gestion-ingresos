/** Delete movement command */
import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { Result } from '../../../shared/Result';
import { DeleteMovementRequest } from '../dtos/DeleteMovementRequest';

export class DeleteMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(input: DeleteMovementRequest): Promise<Result<void>> {
    if (!input.id?.trim()) {
      return Result.fail<void>('Movement ID is required');
    }

    try {
      const movement = await this.movementRepository.findById(input.id);

      if (!movement) {
        return Result.fail<void>('Movimiento no encontrado');
      }

      await this.movementRepository.delete(input.id);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail<void>((error as Error).message);
    }
  }
}
