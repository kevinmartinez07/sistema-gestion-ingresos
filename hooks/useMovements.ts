/**
 * Custom hook para gestionar movimientos
 * Encapsula toda la lógica de estado y operaciones CRUD
 */

import {
  CreateMovementDTO,
  MovementFilters,
  movementsService,
  MovementStats,
} from '@/lib/client/services/movements.service';
import { MovementResponseDTO } from '@/types/movement.types';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseMovementsOptions {
  autoFetch?: boolean;
  filters?: MovementFilters;
}

export function useMovements(options: UseMovementsOptions = {}) {
  const { autoFetch = true, filters } = options;

  const [movements, setMovements] = useState<MovementResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener movimientos del servidor
   */
  const fetchMovements = useCallback(
    async (customFilters?: MovementFilters) => {
      setLoading(true);
      setError(null);

      try {
        const data = await movementsService.getMovements(
          customFilters || filters
        );
        setMovements(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar movimientos';
        setError(message);
        console.error('Error fetching movements:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  /**
   * Crear nuevo movimiento
   */
  const createMovement = useCallback(async (data: CreateMovementDTO) => {
    setLoading(true);
    setError(null);

    try {
      const newMovement = await movementsService.createMovement(data);
      setMovements((prev) => [newMovement, ...prev]);
      return { success: true, data: newMovement };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear movimiento';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar movimiento
   */
  const deleteMovement = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await movementsService.deleteMovement(id);
      setMovements((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar movimiento';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Estadísticas calculadas
   */
  const stats: MovementStats = useMemo(() => {
    return movementsService.calculateStats(movements);
  }, [movements]);

  /**
   * Fetch automático al montar
   */
  useEffect(() => {
    if (autoFetch) {
      fetchMovements();
    }
  }, [autoFetch, fetchMovements]);

  return {
    movements,
    loading,
    error,
    stats,
    fetchMovements,
    createMovement,
    deleteMovement,
    refetch: fetchMovements,
  };
}
