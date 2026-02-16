import { BadgeProps } from '@/lib/client/types/ui.types';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    default: 'badge bg-ui-bg-muted text-ui-text',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className='icon-sm'>{icon}</span>}
      {children}
    </span>
  );
}
