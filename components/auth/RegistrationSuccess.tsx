import { Card } from '@/components/ui';
import Link from 'next/link';

interface RegistrationSuccessProps {
  email: string;
}

export default function RegistrationSuccess({
  email,
}: RegistrationSuccessProps) {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full'>
        <Card className='p-8 text-center'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-green-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            ¡Cuenta creada con éxito!
          </h2>
          <p className='text-gray-600 mb-6'>
            Tu cuenta <strong>{email}</strong> ha sido registrada correctamente.
          </p>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <p className='text-sm text-blue-800'>
              Ya puedes iniciar sesión con tu email y contraseña.
            </p>
          </div>
          <Link
            href='/login'
            className='inline-block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium'
          >
            Ir al login
          </Link>
        </Card>
      </div>
    </main>
  );
}
