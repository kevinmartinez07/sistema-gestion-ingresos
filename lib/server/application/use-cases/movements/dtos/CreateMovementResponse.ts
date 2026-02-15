import { MovementType } from '../../../../domain/entities/Movement';

/**
 * Response DTO para crear un movimiento
 */
export interface CreateMovementResponse {
  id: string;
  type: MovementType;
  amount: number;
  concept: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
