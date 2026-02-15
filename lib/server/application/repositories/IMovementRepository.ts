import { Movement } from '../../domain/entities/Movement';
import {
  CreateMovementData,
  MovementFilters,
  UpdateMovementData,
} from '../use-cases/movements/dtos/MovementRepositoryDTO';

export interface IMovementRepository {
  create(data: CreateMovementData): Promise<Movement>;
  findById(id: string): Promise<Movement | null>;
  findAll(filters?: MovementFilters): Promise<Movement[]>;
  update(id: string, data: UpdateMovementData): Promise<Movement>;
  delete(id: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
  getTotalBalance(userId?: string): Promise<number>;
  getTotalIncome(userId?: string): Promise<number>;
  getTotalExpense(userId?: string): Promise<number>;
}
