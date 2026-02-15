import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { CreateMovementRequest } from '../dtos/CreateMovementRequest';
import { CreateMovementResponse } from '../dtos/CreateMovementResponse';

/**
 * Command: Crear un nuevo movimiento
 * Responsabilidad: Validar y crear movimientos financieros
 */
export class CreateMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(input: CreateMovementRequest): Promise<CreateMovementResponse> {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!input.concept || input.concept.trim().length === 0) {
      throw new Error('Concept cannot be empty');
    }

    if (input.date > new Date()) {
      throw new Error('Date cannot be in the future');
    }

    const movement = await this.movementRepository.create(input);

    return {
      id: movement.id,
      type: movement.type,
      amount: movement.amount,
      concept: movement.concept,
      date: movement.date,
      userId: movement.userId,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }
}
