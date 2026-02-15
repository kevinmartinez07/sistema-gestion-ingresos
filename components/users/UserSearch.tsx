import { Card } from '@/components/ui';
import { UserSearchProps } from '@/types/user.types';

export function UserSearch({ searchTerm, onSearchChange }: UserSearchProps) {
  return (
    <Card className='mb-6'>
      <div className='relative'>
        <svg
          className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
        <input
          type='text'
          placeholder='Buscar por nombre, correo o teléfono...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='input w-full pl-10'
        />
      </div>
    </Card>
  );
}
