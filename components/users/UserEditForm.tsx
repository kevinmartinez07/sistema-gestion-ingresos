import { Button, Modal } from '@/components/ui';
import { parseHttpError } from '@/lib/utils/errors';
import { put } from '@/lib/utils/fetch';
import { UserEditFormProps } from '@/types/user.types';
import { useEffect, useState } from 'react';

export function UserEditForm({
  user,
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

    setSubmitting(true);

    try {
      const data = await put<{ success: boolean }>(`/api/users/${user.id}`, {
        name: formData.name,
        role: formData.role,
        phone: formData.phone || undefined,
      });

      if (data.success) {
        setFormData({ name: '', role: 'USER', phone: '' });
        await onSuccess();
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
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as 'ADMIN' | 'USER',
              })
            }
            className='select'
            disabled={submitting}
          >
            <option value='ADMIN'>Administrador</option>
            <option value='USER'>Usuario</option>
          </select>
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
