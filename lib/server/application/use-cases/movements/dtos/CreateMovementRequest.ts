import { MovementType } from '../../../../domain/entities/Movement';

/**
 * Request DTO para crear un movimiento (Command)
 */
export interface CreateMovementRequest {
  type: MovementType;
  amount: number;
  concept: string;
  date: Date;
  userId: string;
}
