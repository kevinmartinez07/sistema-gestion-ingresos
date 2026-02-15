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
import { UserTableProps } from '@/types/user.types';
import { UserRow } from './UserRow';

export function UserTable({
  users,
  searchTerm,
  onEdit,
  onDelete,
  currentUserId,
}: UserTableProps) {
  return (
    <Card padding='none' className='overflow-hidden'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Usuario</TableHead>
              <TableHead className='whitespace-nowrap'>Correo</TableHead>
              <TableHead className='whitespace-nowrap'>Teléfono</TableHead>
              <TableHead className='whitespace-nowrap'>Rol</TableHead>
              <TableHead className='whitespace-nowrap'>Registro</TableHead>
              <TableHead className='whitespace-nowrap'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='p-0'>
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
                          d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                        />
                      </svg>
                    }
                    title='No se encontraron usuarios'
                    description={
                      searchTerm
                        ? 'Intenta ajustar tu búsqueda'
                        : 'No hay usuarios registrados'
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
