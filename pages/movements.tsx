import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  MovementFilters,
  MovementForm,
  MovementStats,
  MovementTable,
} from '@/components/movements';
import { AlertModal, Button, Modal } from '@/components/ui';
import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import { del, get, post } from '@/lib/utils/fetch';
import { MovementResponseDTO } from '@/types/movement.types';
import { ExtendedUser } from '@/types/user.types';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function MovementsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as ExtendedUser | undefined;

  const [movements, setMovements] = useState<MovementResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>(
    'ALL'
  );
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    movementId: string | null;
  }>({ isOpen: false, movementId: null });
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchMovements();
    }
  }, [session]);

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const matchesSearch = movement.concept
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || movement.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [movements, searchTerm, filterType]);

  const stats = useMemo(() => {
    const total = filteredMovements.reduce(
      (acc, mov) => {
        if (mov.type === 'INCOME') {
          acc.totalIncome += mov.amount;
        } else {
          acc.totalExpense += mov.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
    return {
      ...total,
      balance: total.totalIncome - total.totalExpense,
      count: filteredMovements.length,
    };
  }, [filteredMovements]);

  const fetchMovements = async () => {
    try {
      const data = await get<{ success: boolean; data: MovementResponseDTO[] }>(
        '/api/movements'
      );

      if (data.success) {
        setMovements(data.data);
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[fetchMovements]', parsedError.message, error);

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

  const handleSubmit = async (formData: {
    type: 'INCOME' | 'EXPENSE';
    amount: string;
    concept: string;
    date: string;
  }) => {
    setIsSubmitting(true);
    try {
      const [year, month, day] = formData.date.split('-');
      const localDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        12,
        0,
        0
      );

      const res = await post<{ success: boolean }>('/api/movements', {
        type: formData.type,
        concept: formData.concept,
        amount: parseFloat(formData.amount),
        date: localDate.toISOString(),
      });

      if (res.success) {
        await fetchMovements();
        setShowModal(false);
        setIsSubmitting(false);
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: '¡Éxito!',
          message: 'El movimiento se ha guardado correctamente',
        });
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[handleSubmit]', parsedError.message, error);
      setIsSubmitting(false);
      setAlertModal({
        isOpen: true,
        type: parsedError.type,
        title: parsedError.title,
        message: parsedError.message,
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmModal({ isOpen: true, movementId: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirmModal.movementId;
    if (!id) return;

    setIsDeleting(true);

    try {
      const data = await del<{ success: boolean }>(`/api/movements/${id}`);

      if (data.success) {
        await fetchMovements();
        setDeleteConfirmModal({ isOpen: false, movementId: null });
        setIsDeleting(false);
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: 'Eliminado',
          message: 'El movimiento se ha eliminado correctamente',
        });
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[confirmDelete]', parsedError.message, error);
      setIsDeleting(false);
      setAlertModal({
        isOpen: true,
        type: parsedError.type,
        title: parsedError.title,
        message: parsedError.message,
      });
    }
  };

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <Layout>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 pb-2 border-b-4 border-brand-500 inline-block'>
              Ingresos y egresos
            </h1>
          </div>
          {isAdmin && (
            <Button
              variant='primary'
              onClick={() => setShowModal(true)}
              icon={
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              }
            >
              <span className='hidden sm:inline'>Nuevo movimiento</span>
              <span className='sm:hidden'>Nuevo</span>
            </Button>
          )}
        </div>

        <MovementStats
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
          balance={stats.balance}
          count={stats.count}
        />

        <MovementFilters
          searchTerm={searchTerm}
          filterType={filterType}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
        />

        <MovementTable
          movements={filteredMovements}
          isAdmin={isAdmin}
          searchTerm={searchTerm}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => !isSubmitting && setShowModal(false)}
        title='Nuevo Movimiento'
        size='md'
        disableClose={isSubmitting}
      >
        <MovementForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() =>
          !isDeleting &&
          setDeleteConfirmModal({ isOpen: false, movementId: null })
        }
        title='Confirmar eliminación'
        size='sm'
        disableClose={isDeleting}
      >
        <div className='space-y-4'>
          <p className='text-gray-600'>
            ¿Estás seguro de eliminar este movimiento? Esta acción no se puede
            deshacer.
          </p>
          <div className='flex gap-3'>
            <Button
              variant='secondary'
              onClick={() =>
                setDeleteConfirmModal({ isOpen: false, movementId: null })
              }
              className='flex-1'
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant='danger'
              onClick={confirmDelete}
              className='flex-1'
              loading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </Layout>
  );
}
