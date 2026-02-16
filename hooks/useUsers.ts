/**
 * Custom hook para gestionar usuarios
 * Encapsula toda la lógica de estado y operaciones
 */

import {
    UpdateUserDTO,
    usersService,
    UserStats,
} from '@/lib/client/services/users.service';
import { UserResponseDTO } from '@/lib/client/types/user.types';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseUsersOptions {
  autoFetch?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { autoFetch = true } = options;

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener usuarios del servidor
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar usuario
   */
  const updateUser = useCallback(async (id: string, data: UpdateUserDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await usersService.updateUser(id, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user))
      );
      return { success: true, data: updatedUser };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Estadísticas calculadas
   */
  const stats: UserStats = useMemo(() => {
    return usersService.calculateStats(users);
  }, [users]);

  /**
   * Fetch automático al montar
   */
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    loading,
    error,
    stats,
    fetchUsers,
    updateUser,
    refetch: fetchUsers,
  };
}
