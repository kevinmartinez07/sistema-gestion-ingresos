import { MovementType } from '../../../../domain/entities/Movement';

/**
 * Response DTO para obtener movimientos
 */
export interface GetMovementsResponse {
  id: string;
  type: MovementType;
  amount: number;
  concept: string;
  date: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
