/**
 * Service para operaciones relacionadas con usuarios
 * Separa la lógica de API del componente
 */

import { UserResponseDTO } from '@/lib/client/types/user.types';
import { apiClient } from '../api/client';

export interface UpdateUserDTO {
  name?: string;
  role?: 'ADMIN' | 'USER';
  phone?: string;
}

export interface UserStats {
  total: number;
  admins: number;
  users: number;
}

class UsersService {
  /**
   * Obtener todos los usuarios
   */
  async getUsers(): Promise<UserResponseDTO[]> {
    const response = await apiClient.get<UserResponseDTO[]>('/users');
    return response.data || [];
  }

  /**
   * Actualizar un usuario por ID
   */
  async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const response = await apiClient.put<UserResponseDTO>(`/users/${id}`, data);

    if (!response.data) {
      throw new Error('No data returned from server');
    }

    return response.data;
  }

  /**
   * Eliminar un usuario por ID
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete<void>(`/users/${id}`);
  }

  /**
   * Calcular estadísticas de usuarios
   */
  calculateStats(users: UserResponseDTO[]): UserStats {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'ADMIN').length,
      users: users.filter((u) => u.role === 'USER').length,
    };
  }
}

export const usersService = new UsersService();
