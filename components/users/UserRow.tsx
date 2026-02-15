import { Badge, Button, TableCell, TableRow } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import { UserRowProps } from '@/types/user.types';
import Image from 'next/image';

export function UserRow({
  user,
  onEdit,
  onDelete,
  currentUserId,
}: UserRowProps) {
  return (
    <TableRow>
      <TableCell className='min-w-[200px]'>
        <div className='flex items-center gap-3'>
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'Usuario'}
              width={32}
              height={32}
              className='h-8 w-8 rounded-full flex-shrink-0'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0'>
              <span className='text-white font-semibold text-sm'>
                {(user.name || user.email)?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className='font-medium text-gray-900 truncate'>
            {user.name || 'Sin nombre'}
          </div>
        </div>
      </TableCell>
      <TableCell className='text-gray-500 min-w-[200px] truncate'>
        {user.email}
      </TableCell>
      <TableCell className='text-gray-500 min-w-[120px]'>
        {user.phone || '-'}
      </TableCell>
      <TableCell className='min-w-[120px]'>
        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
          {user.role === 'ADMIN' ? (
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
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
              Admin
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
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              Usuario
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell className='text-gray-500 min-w-[180px]'>
        {formatDateTime(user.createdAt)}
      </TableCell>
      <TableCell className='min-w-[200px]'>
        <div className='flex gap-2'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => onEdit(user)}
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
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            }
          >
            <span className='hidden sm:inline'>Editar</span>
            <span className='sm:hidden'>Edit</span>
          </Button>
          {currentUserId !== user.id && (
            <Button
              variant='danger'
              size='sm'
              onClick={() => onDelete(user)}
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
              <span className='sm:hidden'>Del</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
