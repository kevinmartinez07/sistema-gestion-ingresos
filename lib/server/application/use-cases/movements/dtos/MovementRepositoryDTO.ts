import { MovementType } from '../../../../domain/entities/Movement';

export interface CreateMovementData {
  type: MovementType;
  amount: number;
  concept: string;
  date: Date;
  userId: string;
}

export interface UpdateMovementData {
  type?: MovementType;
  amount?: number;
  concept?: string;
  date?: Date;
}

export interface MovementFilters {
  userId?: string;
  type?: MovementType;
  startDate?: Date;
  endDate?: Date;
}
