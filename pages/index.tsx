import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button, Card } from '@/components/ui';
import { authClient } from '@/lib/auth/client';
import { ExtendedUser } from '@/types/user.types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);

  const user = session?.user as ExtendedUser | undefined;

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  useEffect(() => {
    if (!isPending && session) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (!isPending && !session) {
      setLoading(false);
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return <LoadingSpinner />;
  }

  if (session) {
    return (
      <Layout>
        <div className='py-8'>
          <div className='max-w-7xl mx-auto px-4'>
            <header className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 pb-2 border-b-4 border-brand-500 inline-block'>
                ¡Bienvenido de nuevo!
              </h1>
              <p className='text-gray-600 mt-2'>
                Hola, {user?.name || user?.email}. ¿Qué deseas hacer hoy?
              </p>
            </header>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl'>
              <Card
                onClick={() => router.push('/movements')}
                interactive
                hover
                className='p-8 cursor-pointer'
              >
                <div className='bg-brand-500 bg-opacity-10 rounded-full p-5 w-fit mb-4 border border-brand-200'>
                  <svg
                    className='w-8 h-8 text-brand-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  Movimientos
                </h3>
                <p className='text-gray-600 text-sm'>
                  Registra y consulta ingresos y egresos
                </p>
              </Card>

              {user?.role === 'ADMIN' && (
                <Card
                  onClick={() => router.push('/users')}
                  interactive
                  hover
                  className='p-8 cursor-pointer'
                >
                  <div className='bg-accent-500 bg-opacity-10 rounded-full p-5 w-fit mb-4 border border-accent-200'>
                    <svg
                      className='w-8 h-8 text-accent-600'
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
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Usuarios
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Administra usuarios del sistema
                  </p>
                </Card>
              )}

              {user?.role === 'ADMIN' && (
                <Card
                  onClick={() => router.push('/reports')}
                  interactive
                  hover
                  className='p-8 cursor-pointer'
                >
                  <div className='bg-success-500 bg-opacity-10 rounded-full p-5 w-fit mb-4 border border-success-200'>
                    <svg
                      className='w-8 h-8 text-success-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Reportes
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Visualiza estadísticas y análisis
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <header className='absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600 to-purple-600 opacity-10'></header>

      <div className='relative min-h-screen flex items-center justify-center px-4 py-12'>
        <div className='max-w-md mx-auto'>
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
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
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>FinanzApp</h1>
            <p className='text-lg text-gray-600'>
              Sistema de Gestión de Ingresos y Egresos
            </p>
          </div>

          <div className='bg-white shadow-2xl rounded-2xl p-8 border border-gray-100'>
            <div className='space-y-6'>
              <div className='text-center'>
                <p className='text-gray-600 text-sm mb-6'>
                  Administra tus finanzas de forma profesional
                </p>
              </div>

              <div className='space-y-3'>
                <Button
                  onClick={() => router.push('/login')}
                  variant='primary'
                  fullWidth
                  size='lg'
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                >
                  Iniciar sesión
                </Button>

                <Button
                  onClick={() => router.push('/register')}
                  variant='secondary'
                  fullWidth
                  size='lg'
                  className='border-2 hover:bg-gray-50'
                >
                  Crear cuenta gratis
                </Button>
              </div>

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
                onClick={handleLogin}
                variant='secondary'
                fullWidth
                size='lg'
                className='border-2'
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

              <div className='border-t border-gray-200 pt-6'>
                <div className='grid grid-cols-3 gap-4 text-center'>
                  <div>
                    <svg
                      className='w-6 h-6 mx-auto text-blue-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    <div className='text-xs text-gray-600 mt-1'>Reportes</div>
                  </div>
                  <div>
                    <svg
                      className='w-6 h-6 mx-auto text-green-600'
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
                    <div className='text-xs text-gray-600 mt-1'>Ingresos</div>
                  </div>
                  <div>
                    <svg
                      className='w-6 h-6 mx-auto text-purple-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                      />
                    </svg>
                    <div className='text-xs text-gray-600 mt-1'>Análisis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
