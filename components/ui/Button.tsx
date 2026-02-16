import { ButtonProps } from '@/lib/client/types/ui.types';
import { cn } from '@/lib/utils';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      className={cn(
        'btn',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className='spinner' />}
      {!loading && icon && iconPosition === 'left' && (
        <span className='inline-flex items-center'>{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className='inline-flex items-center'>{icon}</span>
      )}
    </button>
  );
}
