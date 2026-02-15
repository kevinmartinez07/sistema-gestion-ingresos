import { Badge, Button, TableCell, TableRow } from '@/components/ui';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { MovementRowProps } from '@/types/movement.types';

export function MovementRow({ movement, isAdmin, onDelete }: MovementRowProps) {
  return (
    <TableRow>
      <TableCell className='min-w-[120px]'>
        <Badge variant={movement.type === 'INCOME' ? 'success' : 'danger'}>
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
        <div className='font-medium text-gray-900'>{movement.concept}</div>
      </TableCell>
      <TableCell className='min-w-[120px]'>
        <div
          className={`font-semibold ${
            movement.type === 'INCOME' ? 'text-success-600' : 'text-danger-600'
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
      {isAdmin && (
        <TableCell className='min-w-[120px]'>
          <Button
            variant='danger'
            size='sm'
            onClick={() => onDelete(movement.id)}
            icon={
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
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            }
          >
            <span className='hidden sm:inline'>Eliminar</span>
            <span className='sm:hidden'>×</span>
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
