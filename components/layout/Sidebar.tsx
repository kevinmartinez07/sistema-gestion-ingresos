import { ExtendedUser } from '@/lib/client/types/user.types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserProfile from './UserProfile';

interface SidebarProps {
  user?: ExtendedUser;
  sidebarOpen: boolean;
  logoutLoading: boolean;
  onCloseSidebar: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  user,
  sidebarOpen,
  logoutLoading,
  onCloseSidebar,
  onLogout,
}: SidebarProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const navButtonClass = (path: string) =>
    `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
      isActive(path)
        ? 'bg-brand-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
    }`;

  return (
    <aside
      className={`fixed lg:static w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col shadow-xl z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
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
        <Link
          href='/movements'
          className={navButtonClass('/movements')}
          onClick={onCloseSidebar}
        >
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
            <Link
              href='/users'
              className={navButtonClass('/users')}
              onClick={onCloseSidebar}
            >
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
            <Link
              href='/reports'
              className={navButtonClass('/reports')}
              onClick={onCloseSidebar}
            >
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

      {user && (
        <UserProfile
          user={user}
          logoutLoading={logoutLoading}
          onLogout={onLogout}
        />
      )}
    </aside>
  );
}
