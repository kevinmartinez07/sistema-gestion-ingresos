/**
 * Service para operaciones relacionadas con movimientos
 * Separa la lógica de API del componente
 */

import { MovementResponseDTO } from '@/lib/client/types/movement.types';
import { apiClient } from '../api/client';

export interface CreateMovementDTO {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  concept: string;
  date: string;
}

export interface MovementFilters {
  type?: 'INCOME' | 'EXPENSE';
  startDate?: string;
  endDate?: string;
}

export interface MovementStats {
  count: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

class MovementsService {
  /**
   * Obtener todos los movimientos con filtros opcionales
   */
  async getMovements(
    filters?: MovementFilters
  ): Promise<MovementResponseDTO[]> {
    const queryParams = new URLSearchParams();

    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);

    const query = queryParams.toString();
    const endpoint = `/movements${query ? `?${query}` : ''}`;

    const response = await apiClient.get<MovementResponseDTO[]>(endpoint);
    return response.data || [];
  }

  /**
   * Crear un nuevo movimiento
   */
  async createMovement(data: CreateMovementDTO): Promise<MovementResponseDTO> {
    const response = await apiClient.post<MovementResponseDTO>(
      '/movements',
      data
    );

    if (!response.data) {
      throw new Error('No data returned from server');
    }

    return response.data;
  }

  /**
   * Eliminar un movimiento por ID
   */
  async deleteMovement(id: string): Promise<void> {
    await apiClient.delete<void>(`/movements/${id}`);
  }

  /**
   * Calcular estadísticas localmente desde los movimientos
   */
  calculateStats(movements: MovementResponseDTO[]): MovementStats {
    const stats = movements.reduce(
      (acc, movement) => {
        acc.count++;
        if (movement.type === 'INCOME') {
          acc.totalIncome += Number(movement.amount);
        } else {
          acc.totalExpense += Number(movement.amount);
        }
        return acc;
      },
      { count: 0, totalIncome: 0, totalExpense: 0, balance: 0 }
    );

    stats.balance = stats.totalIncome - stats.totalExpense;
    return stats;
  }
}

export const movementsService = new MovementsService();
