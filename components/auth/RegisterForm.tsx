import { Button, PasswordInput } from '@/components/ui';
import { RegisterFormData } from '@/lib/utils/auth-validation';
import { FormEvent } from 'react';

interface RegisterFormProps {
  form: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  githubLoading: boolean;
  error: string;
}

export default function RegisterForm({
  form,
  onChange,
  onSubmit,
  loading,
  githubLoading,
  error,
}: RegisterFormProps) {
  const isDisabled = loading || githubLoading;

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Nombre completo
        </label>
        <input
          type='text'
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='Juan Pérez'
          disabled={isDisabled}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Teléfono <span className='text-gray-500 text-xs'>(opcional)</span>
        </label>
        <input
          type='number'
          value={form.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='3001234567'
          disabled={isDisabled}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Correo electrónico
        </label>
        <input
          type='email'
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='juan@ejemplo.com'
          disabled={isDisabled}
        />
      </div>

      <PasswordInput
        label='Contraseña'
        value={form.password}
        onChange={(value) => onChange('password', value)}
        placeholder='••••••••'
        disabled={isDisabled}
      />

      <PasswordInput
        label='Confirmar contraseña'
        value={form.confirmPassword}
        onChange={(value) => onChange('confirmPassword', value)}
        placeholder='••••••••'
        disabled={isDisabled}
      />

      <Button
        type='submit'
        variant='primary'
        fullWidth
        size='lg'
        disabled={isDisabled}
        className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
      >
        {loading ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            Creando cuenta...
          </span>
        ) : (
          'Crear cuenta'
        )}
      </Button>
    </form>
  );
}
