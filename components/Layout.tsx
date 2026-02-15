import { authClient } from '@/lib/auth/client';
import { LayoutProps } from '@/types/layout.types';
import { ExtendedUser } from '@/types/user.types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as ExtendedUser | undefined;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const isActive = (path: string) => router.pathname === path;

  const navButtonClass = (path: string) =>
    `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
      isActive(path)
        ? 'bg-brand-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
    }`;

  return (
    <div className='flex h-screen bg-white overflow-hidden'>
      <aside className='w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col shadow-xl'>
        <div className='p-6'>
          <Link href='/'>
            <div className='bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg p-4 text-center shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200'>
              <div className='text-2xl font-bold text-white'>PYG</div>
              <div className='text-xs text-white opacity-80 mt-1'>
                Sistema de Gestión
              </div>
            </div>
          </Link>
        </div>

        <nav className='flex-1 p-4 space-y-3'>
          <Link href='/movements' className={navButtonClass('/movements')}>
            <svg
              className='w-5 h-5'
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
            <span>Ingresos y egresos</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <>
              <Link href='/users' className={navButtonClass('/users')}>
                <svg
                  className='w-5 h-5'
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
                <span>Usuarios</span>
              </Link>
              <Link href='/reports' className={navButtonClass('/reports')}>
                <svg
                  className='w-5 h-5'
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
                <span>Reportes</span>
              </Link>
            </>
          )}
        </nav>

        {session && user && (
          <div className='p-4 border-t border-gray-700 bg-gray-900'>
            <div className='flex items-center gap-3 mb-3 text-white'>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Usuario'}
                  width={40}
                  height={40}
                  className='w-10 h-10 rounded-full border-2 border-brand-500'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-lg font-bold'>
                  {(user.name || user.email)?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate text-sm'>
                  {user.name || user.email}
                </div>
                <div className='text-gray-400 text-xs flex items-center gap-1'>
                  {user.role === 'ADMIN' ? (
                    <>
                      <svg
                        className='w-3 h-3'
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
                      Admin
                    </>
                  ) : (
                    <>
                      <svg
                        className='w-3 h-3'
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
                      Usuario
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        {router.pathname !== '/' && (
          <header className='bg-gradient-to-r from-brand-600 to-brand-700 shadow-lg py-6 flex-shrink-0'>
            <h1 className='text-2xl font-bold text-center text-white'>
              Sistema de gestión de ingresos y egresos
            </h1>
          </header>
        )}

        <main className='flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100'>
          {children}
        </main>
      </div>
    </div>
  );
}
