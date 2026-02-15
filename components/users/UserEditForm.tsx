import { Button, Modal } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import { put } from '@/lib/utils/fetch';
import { UserEditFormProps } from '@/types/user.types';
import { useEffect, useState } from 'react';

export function UserEditForm({
  user,
  currentUserId,
  onClose,
  onSuccess,
  onError,
}: UserEditFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER' as 'ADMIN' | 'USER',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: user.role as 'ADMIN' | 'USER',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const isEditingSelf = currentUserId === user.id;
    const wasAdmin = user.role === 'ADMIN';
    const nowUser = formData.role === 'USER';
    const shouldLogout = isEditingSelf && wasAdmin && nowUser;

    setSubmitting(true);

    try {
      const data = await put<{ success: boolean }>(`/api/users/${user.id}`, {
        name: formData.name,
        role: formData.role,
        phone: formData.phone || undefined,
      });

      if (data.success) {
        setFormData({ name: '', role: 'USER', phone: '' });
        
        if (shouldLogout) {
          // Cerrar sesión si cambió su propio rol de ADMIN a USER
          await authClient.signOut();
          window.location.href = '/login';
        } else {
          await onSuccess();
        }
        
        setSubmitting(false);
      }
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[handleSubmit]', parsedError.message, error);
      setSubmitting(false);
      onError(parsedError.message);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setFormData({ name: '', role: 'USER', phone: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={!!user}
      onClose={handleClose}
      title='Editar Usuario'
      size='md'
      disableClose={submitting}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        {currentUserId === user?.id && user?.role === 'ADMIN' && formData.role === 'USER' && (
          <div className='bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm'>
            <div className='flex items-start gap-2'>
              <svg
                className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <div>
                <p className='font-semibold mb-1'>⚠️ Advertencia importante</p>
                <p>Estás cambiando tu propio rol de Administrador a Usuario. Tu sesión se cerrará automáticamente y perderás los privilegios de administrador.</p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nombre Completo
          </label>
          <input
            type='text'
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='input'
            disabled={submitting}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Rol
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                role: value as 'ADMIN' | 'USER',
              })
            }
            disabled={submitting}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ADMIN'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-brand-600'
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
                  <span>Administrador</span>
                </div>
              </SelectItem>
              <SelectItem value='USER'>
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
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  <span>Usuario</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Teléfono (opcional)
          </label>
          <input
            type='tel'
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder='Ej: 3001234567'
            className='input'
            disabled={submitting}
          />
        </div>
        <div className='flex gap-3 pt-4'>
          <Button
            type='button'
            variant='secondary'
            onClick={handleClose}
            className='flex-1'
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='primary'
            className='flex-1'
            loading={submitting}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
