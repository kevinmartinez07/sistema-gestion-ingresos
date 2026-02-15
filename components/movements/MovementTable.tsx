import {
  Card,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { MovementTableProps } from '@/types/movement.types';
import { MovementRow } from './MovementRow';

export function MovementTable({
  movements,
  isAdmin,
  searchTerm,
  onDelete,
}: MovementTableProps) {
  return (
    <Card padding='none' className='overflow-hidden'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Tipo</TableHead>
              <TableHead className='whitespace-nowrap'>Concepto</TableHead>
              <TableHead className='whitespace-nowrap'>Monto</TableHead>
              <TableHead className='whitespace-nowrap'>Fecha</TableHead>
              <TableHead className='whitespace-nowrap'>Usuario</TableHead>
              {isAdmin && (
                <TableHead className='whitespace-nowrap'>Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className='p-0'>
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
                    title='No se encontraron movimientos'
                    description={
                      searchTerm
                        ? 'Intenta ajustar tu búsqueda'
                        : 'Agrega tu primer movimiento'
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <MovementRow
                  key={movement.id}
                  movement={movement}
                  isAdmin={isAdmin}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
