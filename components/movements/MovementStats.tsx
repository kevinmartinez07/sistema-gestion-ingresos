import { StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { MovementStatsProps } from '@/types/movement.types';

export function MovementStats({
  totalIncome,
  totalExpense,
  balance,
  count,
}: MovementStatsProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
      <StatCard
        label='Total Ingresos'
        value={formatCurrency(totalIncome)}
        icon={
          <svg
            className='w-5 h-5 sm:w-6 sm:h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
            />
          </svg>
        }
        description='Entradas de dinero'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-success-500 to-success-600 text-white'
      />

      <StatCard
        label='Total Egresos'
        value={formatCurrency(totalExpense)}
        icon={
          <svg
            className='w-5 h-5 sm:w-6 sm:h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
            />
          </svg>
        }
        description='Salidas de dinero'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-danger-500 to-danger-600 text-white'
      />

      <StatCard
        label='Balance'
        value={formatCurrency(balance)}
        icon={
          <svg
            className='w-5 h-5 sm:w-6 sm:h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
        }
        description={balance >= 0 ? 'Positivo' : 'Negativo'}
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className={`bg-gradient-to-br ${balance >= 0 ? 'from-brand-500 to-brand-600' : 'from-warning-500 to-warning-600'} text-white`}
      />

      <StatCard
        label='Movimientos'
        value={count.toString()}
        icon={
          <svg
            className='w-5 h-5 sm:w-6 sm:h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            />
          </svg>
        }
        description='Total registrados'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-accent-500 to-accent-600 text-white'
      />
    </div>
  );
}
