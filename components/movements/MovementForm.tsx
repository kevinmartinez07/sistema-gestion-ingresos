import { Button } from '@/components/ui';
import { MovementFormData, MovementFormProps } from '@/types/movement.types';
import { useState } from 'react';

// Helper para obtener la fecha local en formato YYYY-MM-DD
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper para formatear número con separadores de miles
const formatNumberWithThousands = (value: string): string => {
  const cleanValue = value.replace(/[^\d.]/g, '');

  const parts = cleanValue.split('.');
  const [integerPart, decimal] = parts;
  const decimalPart = decimal !== undefined ? '.' + decimal : '';

  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return formatted + decimalPart;
};

export function MovementForm({
  onSubmit,
  onCancel,
  submitting: externalSubmitting,
}: MovementFormProps) {
  const [formData, setFormData] = useState<MovementFormData>({
    type: 'INCOME',
    amount: '',
    concept: '',
    date: getLocalDateString(),
  });
  const [displayAmount, setDisplayAmount] = useState('');
  const [internalSubmitting, setInternalSubmitting] = useState(false);

  const submitting = externalSubmitting ?? internalSubmitting;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    const cleanValue = input.replace(/\./g, '');

    if (cleanValue === '' || /^\d*[,.]?\d*$/.test(cleanValue)) {
      const normalizedValue = cleanValue.replace(',', '.');
      setFormData({ ...formData, amount: normalizedValue });
      setDisplayAmount(formatNumberWithThousands(cleanValue));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (externalSubmitting !== undefined) {
      await onSubmit(formData);
      setFormData({
        type: 'INCOME',
        amount: '',
        concept: '',
        date: getLocalDateString(),
      });
      setDisplayAmount('');
    } else {
      setInternalSubmitting(true);

      try {
        await onSubmit(formData);
        setFormData({
          type: 'INCOME',
          amount: '',
          concept: '',
          date: getLocalDateString(),
        });
        setDisplayAmount('');
      } finally {
        setInternalSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Tipo de Movimiento
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as 'INCOME' | 'EXPENSE',
            })
          }
          className='select'
          disabled={submitting}
        >
          <option value='INCOME'>Ingreso</option>
          <option value='EXPENSE'>Egreso</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Monto
        </label>
        <input
          type='text'
          required
          value={displayAmount}
          onChange={handleAmountChange}
          placeholder='0'
          className='input'
          disabled={submitting}
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Concepto
        </label>
        <input
          type='text'
          required
          value={formData.concept}
          onChange={(e) =>
            setFormData({ ...formData, concept: e.target.value })
          }
          placeholder='Descripción del movimiento'
          className='input'
          disabled={submitting}
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Fecha
        </label>
        <input
          type='date'
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className='input'
          disabled={submitting}
        />
      </div>
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
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
          Guardar
        </Button>
      </div>
    </form>
  );
}
