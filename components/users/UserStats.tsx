import { StatCard } from '@/components/ui';
import { UserStatsProps } from '@/lib/client/types/user.types';

export function UserStats({ total, admins, regularUsers }: UserStatsProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6'>
      <StatCard
        label='Total Usuarios'
        value={total.toString()}
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
              d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        }
        description='Usuarios registrados'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-brand-500 to-brand-600 text-white'
      />

      <StatCard
        label='Administradores'
        value={admins.toString()}
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
              d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
            />
          </svg>
        }
        description='Con permisos especiales'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-accent-500 to-accent-600 text-white'
      />

      <StatCard
        label='Usuarios Regulares'
        value={regularUsers.toString()}
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
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
        }
        description='Sin privilegios admin'
        iconBgColor='bg-white bg-opacity-20'
        valueColor='text-white'
        className='bg-gradient-to-br from-success-500 to-success-600 text-white'
      />
    </div>
  );
}
