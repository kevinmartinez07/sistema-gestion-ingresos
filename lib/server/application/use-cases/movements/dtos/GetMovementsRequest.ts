import { MovementType } from '../../../../domain/entities/Movement';

/**
 * Request DTO para obtener movimientos (Query)
 */
export interface GetMovementsRequest {
  userId?: string;
  type?: MovementType;
  startDate?: Date;
  endDate?: Date;
}
