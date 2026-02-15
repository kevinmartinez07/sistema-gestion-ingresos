import { Card } from '@/components/ui';
import { MovementFiltersProps } from '@/types/movement.types';

export function MovementFilters({
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
}: MovementFiltersProps) {
  return (
    <Card className='mb-6'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 relative'>
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
            placeholder='Buscar por concepto...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='input w-full pl-10'
          />
        </div>
        <div className='md:w-48'>
          <select
            value={filterType}
            onChange={(e) =>
              onFilterChange(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')
            }
            className='select w-full'
          >
            <option value='ALL'>Todos</option>
            <option value='INCOME'>Ingresos</option>
            <option value='EXPENSE'>Egresos</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
