import { Card, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { MonthlyChartProps } from '@/types/report.types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <span className='bg-accent-100 rounded-full p-2 mr-3'>
          <svg
            className='w-5 h-5 text-accent-600'
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
        </span>
        Movimientos por Mes
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip
              formatter={(value: number | undefined) =>
                value ? formatCurrency(value) : formatCurrency(0)
              }
            />
            <Legend />
            <Bar dataKey='income' fill='#10b981' name='Ingresos' />
            <Bar dataKey='expense' fill='#ef4444' name='Egresos' />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className='h-[300px] flex items-center justify-center'>
          <EmptyState
            icon={
              <svg
                className='w-16 h-16'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            }
            title='No hay datos disponibles'
            description='Agrega movimientos para ver tendencias'
          />
        </div>
      )}
    </Card>
  );
}
