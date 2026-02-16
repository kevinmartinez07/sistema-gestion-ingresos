import {
  Badge,
  Card,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { RecentMovementsTableProps } from '@/lib/client/types/report.types';
import { formatCurrency, formatDateShort } from '@/lib/format';

export function RecentMovementsTable({ movements }: RecentMovementsTableProps) {
  return (
    <Card padding='none' className='overflow-hidden'>
      <div className='px-4 sm:px-6 py-4 bg-ui-bg-subtle border-b border-ui-border'>
        <h3 className='text-base sm:text-lg font-semibold text-gray-900 flex items-center'>
          <svg
            className='w-5 h-5 mr-2 text-brand-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          Últimos 10 Movimientos
        </h3>
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Tipo</TableHead>
              <TableHead className='whitespace-nowrap'>Concepto</TableHead>
              <TableHead className='whitespace-nowrap'>Monto</TableHead>
              <TableHead className='whitespace-nowrap'>Fecha</TableHead>
              <TableHead className='whitespace-nowrap'>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='p-0'>
                  <EmptyState
                    icon={
                      <svg
                        className='w-12 h-12'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                        />
                      </svg>
                    }
                    title='No hay movimientos registrados'
                    description='Cuando agregues movimientos, aparecerán aquí'
                  />
                </TableCell>
              </TableRow>
            ) : (
              movements.slice(0, 10).map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className='min-w-[120px]'>
                    <Badge
                      variant={
                        movement.type === 'INCOME' ? 'success' : 'danger'
                      }
                    >
                      {movement.type === 'INCOME' ? (
                        <>
                          <svg
                            className='w-4 h-4'
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
                          Ingreso
                        </>
                      ) : (
                        <>
                          <svg
                            className='w-4 h-4'
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
                          Egreso
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className='min-w-[200px]'>
                    <div className='font-medium text-gray-900 truncate'>
                      {movement.concept}
                    </div>
                  </TableCell>
                  <TableCell className='min-w-[120px]'>
                    <div
                      className={`font-semibold ${
                        movement.type === 'INCOME'
                          ? 'text-success-600'
                          : 'text-danger-600'
                      }`}
                    >
                      {formatCurrency(movement.amount)}
                    </div>
                  </TableCell>
                  <TableCell className='text-gray-500 min-w-[120px]'>
                    {formatDateShort(movement.date)}
                  </TableCell>
                  <TableCell className='min-w-[180px]'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0'>
                        <span className='text-white font-semibold text-sm'>
                          {movement.user?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className='text-gray-700 font-medium truncate'>
                        {movement.user?.name || 'Desconocido'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
