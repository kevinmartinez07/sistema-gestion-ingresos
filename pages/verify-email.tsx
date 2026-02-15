import { parseHttpError } from '@/lib/utils/errors';
import { post } from '@/lib/utils/fetch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;

      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no encontrado');
        return;
      }

      try {
        const data = await post<{ success: boolean }>(
          '/api/auth/verify-email',
          { token }
        );

        if (data.success) {
          setStatus('success');
          setMessage('Email verificado correctamente');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (error) {
        const parsedError = parseHttpError(error);
        // eslint-disable-next-line no-console
        console.error('[verifyEmail]', parsedError.message, error);
        setStatus('error');
        setMessage(parsedError.message);
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router, router.isReady, router.query]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
          {status === 'loading' && (
            <>
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-brand-500 mx-auto mb-4'></div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Verificando tu email...
              </h1>
              <p className='text-gray-600'>Por favor espera un momento</p>
            </>
          )}

          {status === 'success' && (
            <>
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
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                ¡Email verificado!
              </h1>
              <p className='text-gray-600 mb-6'>{message}</p>
              <p className='text-sm text-gray-500'>
                Redirigiendo al login en 3 segundos...
              </p>
              <Link
                href='/login'
                className='inline-block mt-4 text-brand-600 hover:text-brand-700 font-medium'
              >
                Ir al login ahora →
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-red-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Error en la verificación
              </h1>
              <p className='text-gray-600 mb-6'>{message}</p>
              <div className='space-y-3'>
                <Link
                  href='/register'
                  className='block w-full py-3 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium'
                >
                  Volver a registrarse
                </Link>
                <Link
                  href='/login'
                  className='block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                >
                  Ir al login
                </Link>
              </div>
            </>
          )}
        </div>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            ¿Problemas?{' '}
            <Link
              href='/register'
              className='text-brand-600 hover:text-brand-700 font-medium'
            >
              Contacta soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
