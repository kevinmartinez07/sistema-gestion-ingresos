import { NotFoundError } from '../../../errors/AppErrors';
import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { DeleteMovementRequest } from '../dtos/DeleteMovementRequest';

/**
 * Command: Eliminar un movimiento
 * Responsabilidad: Validar existencia y eliminar movimientos
 */
export class DeleteMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(input: DeleteMovementRequest): Promise<void> {
    const movement = await this.movementRepository.findById(input.id);

    if (!movement) {
      throw new NotFoundError('Movement not found');
    }

    await this.movementRepository.delete(input.id);
  }
}
