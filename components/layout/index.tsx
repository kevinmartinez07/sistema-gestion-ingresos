import { authClient } from '@/lib/auth/client';
import { LayoutProps } from '@/lib/client/types/layout.types';
import { ExtendedUser } from '@/lib/client/types/user.types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as ExtendedUser | undefined;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authClient.signOut();
      router.push('/');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className='flex h-screen bg-white overflow-hidden'>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        logoutLoading={logoutLoading}
        onCloseSidebar={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <header className='bg-gradient-to-r from-brand-600 to-brand-700 shadow-lg py-4 lg:py-6 flex-shrink-0'>
          <div className='flex items-center gap-4 px-4 lg:px-0'>
            <button
              className='lg:hidden text-white'
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
            {router.pathname !== '/' && (
              <h1 className='text-lg lg:text-2xl font-bold text-white flex-1 text-center lg:text-center'>
                Sistema de gestión de ingresos y egresos
              </h1>
            )}
            <div className='lg:hidden w-6'></div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
