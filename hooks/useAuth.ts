/**
 * Custom hook para gestionar autenticación
 * Encapsula toda la lógica de sesión y usuario
 */

import { authClient } from '@/lib/auth/client';
import { useCallback, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'ADMIN' | 'USER';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener sesión actual
   */
  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await authClient.getSession();

      if (session && 'data' in session && session.data?.user) {
        const userData = session.data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image || undefined,
          role: (userData as any).role || 'USER',
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar sesión';
      setError(message);
      console.error('Error fetching session:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Iniciar sesión con GitHub
   */
  const signIn = useCallback(async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const signOut = useCallback(async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            window.location.href = '/';
          },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Verificadores de rol
   */
  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  /**
   * Fetch automático al montar
   */
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated,
    signIn,
    signOut,
    refetch: fetchSession,
  };
}
