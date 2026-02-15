import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
    DistributionChart,
    MonthlyChart,
    RecentMovementsTable,
    ReportStats,
} from '@/components/reports';
import { AlertModal, Button } from '@/components/ui';
import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import { get } from '@/lib/utils/fetch';
import { MovementResponseDTO } from '@/types/movement.types';
import { BalanceResponseDTO } from '@/types/report.types';
import { ExtendedUser } from '@/types/user.types';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function ReportsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user as ExtendedUser | undefined;

  const [balance, setBalance] = useState<BalanceResponseDTO | null>(null);
  const [movements, setMovements] = useState<MovementResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
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
      fetchReportData();
    }
  }, [session, currentUser]);

  const fetchReportData = async () => {
    try {
      const data = await get<{
        success: boolean;
        data: { balance: BalanceResponseDTO; movements: MovementResponseDTO[] };
      }>('/api/reports');

      if (data.success) {
        setBalance(data.data.balance);
        setMovements(data.data.movements);
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[fetchReportData]', parsedError.message, error);
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

  const downloadCSV = async () => {
    try {
      const res = await fetch('/api/reports?format=csv');

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-movimientos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setAlertModal({
        isOpen: true,
        type: 'success',
        title: 'Descarga completa',
        message: 'El reporte CSV se ha descargado correctamente.',
      });
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[downloadCSV]', parsedError.message, error);
      setAlertModal({
        isOpen: true,
        type: parsedError.type,
        title: parsedError.title,
        message: parsedError.message,
      });
    }
  };

  // Calcular datos para gráficos
  const monthlyData = useMemo(() => {
    const movementsByMonth = movements.reduce(
      (acc, movement) => {
        const date = new Date(movement.date);
        const month = date.toLocaleDateString('es-ES', {
          month: 'short',
          year: 'numeric',
        });

        if (!acc[month]) {
          acc[month] = { month, income: 0, expense: 0 };
        }

        if (movement.type === 'INCOME') {
          acc[month].income += movement.amount;
        } else {
          acc[month].expense += movement.amount;
        }

        return acc;
      },
      {} as Record<string, { month: string; income: number; expense: number }>
    );

    return Object.values(movementsByMonth).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [movements]);

  // Calcular promedios
  const avgIncome = useMemo(() => {
    const incomeMovements = movements.filter((m) => m.type === 'INCOME');
    return incomeMovements.length > 0 && balance
      ? balance.totalIncome / incomeMovements.length
      : 0;
  }, [movements, balance]);

  const avgExpense = useMemo(() => {
    const expenseMovements = movements.filter((m) => m.type === 'EXPENSE');
    return expenseMovements.length > 0 && balance
      ? balance.totalExpense / expenseMovements.length
      : 0;
  }, [movements, balance]);

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (!session || currentUser?.role !== 'ADMIN') return null;

  return (
    <Layout>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 pb-2 border-b-4 border-success-500 inline-block'>
              Reportes Financieros
            </h1>
            <p className='text-gray-600 mt-2 text-sm sm:text-base'>
              Análisis detallado de ingresos y egresos
            </p>
          </div>
          <Button
            onClick={downloadCSV}
            variant='success'
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
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            }
          >
            <span className='hidden sm:inline'>Descargar reporte</span>
            <span className='sm:hidden'>Descargar</span>
          </Button>
        </div>

        {balance && (
          <ReportStats
            balance={balance}
            movementsCount={movements.length}
            avgIncome={avgIncome}
            avgExpense={avgExpense}
          />
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8'>
          <DistributionChart
            totalIncome={balance?.totalIncome || 0}
            totalExpense={balance?.totalExpense || 0}
          />

          <MonthlyChart data={monthlyData} />
        </div>

        <RecentMovementsTable movements={movements} />

        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
        />
      </div>
    </Layout>
  );
}
