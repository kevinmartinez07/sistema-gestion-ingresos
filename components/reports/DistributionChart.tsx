import { Card, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { DistributionChartProps } from '@/types/report.types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#ef4444'];

export function DistributionChart({
  totalIncome,
  totalExpense,
}: DistributionChartProps) {
  const balanceChartData = [
    { name: 'Ingresos', value: totalIncome },
    { name: 'Egresos', value: totalExpense },
  ];

  const hasData = totalIncome + totalExpense > 0;

  return (
    <Card>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <span className='bg-brand-100 rounded-full p-2 mr-3'>
          <svg
            className='w-5 h-5 text-brand-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
            />
          </svg>
        </span>
        Distribución de Movimientos
      </h3>
      {hasData ? (
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={balanceChartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
            >
              {balanceChartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) =>
                value ? formatCurrency(value) : formatCurrency(0)
              }
            />
          </PieChart>
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
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            }
            title='No hay datos disponibles'
            description='Agrega movimientos para ver gráficas'
          />
        </div>
      )}
    </Card>
  );
}
