import { Card } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
          <Select
            value={filterType}
            onValueChange={(value) =>
              onFilterChange(value as 'ALL' | 'INCOME' | 'EXPENSE')
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                  <span>Todos</span>
                </div>
              </SelectItem>
              <SelectItem value='INCOME'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 11l5-5m0 0l5 5m-5-5v12'
                    />
                  </svg>
                  <span>Ingresos</span>
                </div>
              </SelectItem>
              <SelectItem value='EXPENSE'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 13l-5 5m0 0l-5-5m5 5V6'
                    />
                  </svg>
                  <span>Egresos</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
