import {
  AlertModalProps,
  ConfirmModalProps,
  ModalProps,
} from '@/lib/client/types/ui.types';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnBackdrop = true,
  disableClose = false,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !disableClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, disableClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4'>
      <div
        className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity animate-fade-in'
        onClick={closeOnBackdrop && !disableClose ? onClose : undefined}
      />

      <div
        className={cn(
          'relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full animate-scale-in max-h-[95vh] overflow-hidden flex flex-col',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 truncate pr-2'>
              {title}
            </h2>
            <button
              onClick={onClose}
              disabled={disableClose}
              className={cn(
                'text-gray-400 transition-colors flex-shrink-0',
                disableClose
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:text-gray-600'
              )}
            >
              <svg
                className='w-5 h-5 sm:w-6 sm:h-6'
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
            </button>
          </div>
        )}

        <div className='px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1'>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Aceptar',
}: AlertModalProps) {
  const icons = {
    success: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100'>
        <svg
          className='h-6 w-6 text-success-600'
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
    ),
    error: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100'>
        <svg
          className='h-6 w-6 text-danger-600'
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
    ),
    warning: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100'>
        <svg
          className='h-6 w-6 text-warning-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      </div>
    ),
    info: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-100'>
        <svg
          className='h-6 w-6 text-brand-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
    ),
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity animate-fade-in'
        onClick={onClose}
      />

      <div
        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-center'>
          {icons[type]}
          <h3 className='mt-4 text-lg font-semibold text-gray-900'>{title}</h3>
          <p className='mt-2 text-sm text-gray-600'>{message}</p>
          <button onClick={onClose} className='mt-6 w-full btn btn-primary'>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const icons = {
    warning: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100'>
        <svg
          className='h-6 w-6 text-warning-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      </div>
    ),
    danger: (
      <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100'>
        <svg
          className='h-6 w-6 text-danger-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      </div>
    ),
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity animate-fade-in'
        onClick={!loading ? onClose : undefined}
      />

      <div
        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-center'>
          {icons[type]}
          <h3 className='mt-4 text-lg font-semibold text-gray-900'>{title}</h3>
          <p className='mt-2 text-sm text-gray-600'>{message}</p>

          <div className='mt-6 flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-white',
                type === 'danger'
                  ? 'bg-danger-600 hover:bg-danger-700'
                  : 'bg-warning-600 hover:bg-warning-700',
                loading && 'opacity-50 cursor-not-allowed'
              )}
              disabled={loading}
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
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
                  Procesando...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
