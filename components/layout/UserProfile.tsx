import { ExtendedUser } from '@/lib/client/types/user.types';
import Image from 'next/image';

interface UserProfileProps {
  user: ExtendedUser;
  logoutLoading: boolean;
  onLogout: () => void;
}

export default function UserProfile({
  user,
  logoutLoading,
  onLogout,
}: UserProfileProps) {
  return (
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
        onClick={onLogout}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors'
        disabled={logoutLoading}
      >
        {logoutLoading ? (
          <span className='inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white'></span>
        ) : (
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
        )}
        {logoutLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
    </div>
  );
}
