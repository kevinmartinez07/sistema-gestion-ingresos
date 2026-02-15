import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertModal, ConfirmModal } from '@/components/ui';
import {
  UserEditForm,
  UserSearch,
  UserStats,
  UserTable,
} from '@/components/users';
import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import { del, get } from '@/lib/utils/fetch';
import { ExtendedUser, UserResponseDTO } from '@/types/user.types';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function UsersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user as ExtendedUser | undefined;

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserResponseDTO | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponseDTO | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    } else if (!isPending && currentUser?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, isPending, currentUser, router]);

  useEffect(() => {
    if (session && currentUser?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session, currentUser]);

  // Filtrar usuarios por búsqueda
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  // Estadísticas
  const stats = useMemo(() => {
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const userCount = users.filter((u) => u.role === 'USER').length;
    return {
      total: users.length,
      admins: adminCount,
      regularUsers: userCount,
    };
  }, [users]);

  const fetchUsers = async () => {
    try {
      const data = await get<{ success: boolean; data: UserResponseDTO[] }>(
        '/api/users'
      );

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[fetchUsers]', parsedError.message, error);
      setAlertModal({
        isOpen: true,
        type: parsedError.type,
        title: parsedError.title,
        message: parsedError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserResponseDTO) => {
    setEditingUser(user);
  };

  const handleDelete = (user: UserResponseDTO) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      const data = await del<{ success: boolean }>(
        `/api/users/${deletingUser.id}`
      );

      if (data.success) {
        await fetchUsers();
        setDeletingUser(null);
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: '¡Éxito!',
          message: 'Usuario eliminado correctamente',
        });
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[confirmDelete]', parsedError.message, error);
      setAlertModal({
        isOpen: true,
        type: parsedError.type,
        title: parsedError.title,
        message: parsedError.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = async () => {
    await fetchUsers();
    setEditingUser(null);
    setAlertModal({
      isOpen: true,
      type: 'success',
      title: '¡Éxito!',
      message: 'El usuario se ha actualizado correctamente',
    });
  };

  const handleFormError = (error: string) => {
    setAlertModal({
      isOpen: true,
      type: 'error',
      title: 'Error',
      message: error,
    });
  };

  const handleFormClose = () => {
    setEditingUser(null);
  };

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4'>
          <header className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 pb-2 border-b-4 border-accent-500 inline-block'>
              Gestión de Usuarios
            </h1>
            <p className='text-gray-600 mt-2'>
              Administrar usuarios del sistema
            </p>
          </header>

          <UserStats
            total={stats.total}
            admins={stats.admins}
            regularUsers={stats.regularUsers}
          />

          <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <UserEditForm
            user={editingUser}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />

          <ConfirmModal
            isOpen={!!deletingUser}
            onClose={() => !isDeleting && setDeletingUser(null)}
            type='danger'
            title='Confirmar Eliminación'
            message={`¿Estás seguro de que deseas eliminar al usuario "${deletingUser?.name || deletingUser?.email}"? Esta acción no se puede deshacer.`}
            confirmText='Eliminar'
            cancelText='Cancelar'
            onConfirm={confirmDelete}
            loading={isDeleting}
          />

          <AlertModal
            isOpen={alertModal.isOpen}
            onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
            type={alertModal.type}
            title={alertModal.title}
            message={alertModal.message}
          />

          <UserTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={currentUser?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
