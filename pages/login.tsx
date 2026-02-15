import LoadingSpinner from '@/components/LoadingSpinner';
import { Button, Card, PasswordInput } from '@/components/ui';
import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isPending && session) {
    router.push('/movements');
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: '/movements',
      });

      if (result.error) {
        const errorMessage = result.error.message || '';
        if (
          errorMessage.includes('email') &&
          (errorMessage.includes('verify') || errorMessage.includes('verified'))
        ) {
          setError(
            'Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
          );
        } else {
          setError('Credenciales incorrectas');
        }
        setLoading(false);
        return;
      }

      router.push('/movements');
    } catch (error) {
      const parsedError = parseHttpError(error);
      // eslint-disable-next-line no-console
      console.error('[handleSubmit]', parsedError.message, error);
      setError(parsedError.message);
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/movements',
    });
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link href='/'>
            <div className='flex justify-center mb-4 cursor-pointer'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4 shadow-lg'>
                <svg
                  className='w-12 h-12 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Bienvenido de nuevo
          </h1>
          <p className='text-gray-600'>Inicia sesión en tu cuenta</p>
        </div>

        <Card className='p-8'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Correo electrónico
              </label>
              <input
                type='email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='juan@ejemplo.com'
                disabled={loading}
              />
            </div>

            <PasswordInput
              label='Contraseña'
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              placeholder='••••••••'
              disabled={loading}
            />

            <Button
              type='submit'
              variant='primary'
              fullWidth
              size='lg'
              disabled={loading}
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              onClick={handleGitHubLogin}
              variant='secondary'
              fullWidth
              size='lg'
              className='mt-4 border-2'
              icon={
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              }
            >
              GitHub
            </Button>
          </div>

          <p className='mt-6 text-center text-sm text-gray-600'>
            ¿No tienes cuenta?{' '}
            <Link
              href='/register'
              className='text-blue-600 hover:text-blue-700 font-medium'
            >
              Regístrate gratis
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
