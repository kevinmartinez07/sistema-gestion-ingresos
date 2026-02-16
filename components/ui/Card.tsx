import {
  CardHeaderProps,
  CardProps,
  StatCardProps,
} from '@/lib/client/types/ui.types';
import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
  hover = false,
  interactive = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'card',
        hover && 'card-hover',
        interactive && 'card-interactive',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  iconBgColor = 'bg-brand-100',
  valueColor = 'text-ui-text',
  description,
  trend,
  className,
}: StatCardProps) {
  const trendObj =
    typeof trend === 'string'
      ? { value: 0, isPositive: trend === 'positive' }
      : trend;

  return (
    <Card padding='md' className={cn('stat-card', className)}>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <p className='text-xs sm:text-sm font-medium opacity-90 mb-1 sm:mb-2'>
            {label}
          </p>
          <p
            className={cn(
              'text-2xl sm:text-3xl font-bold truncate',
              valueColor
            )}
          >
            {value}
          </p>
          {description && (
            <p className='text-xs opacity-80 mt-1'>{description}</p>
          )}
          {trendObj && trendObj.value > 0 && (
            <div className='flex items-center gap-1 mt-2'>
              <span
                className={cn(
                  'text-xs font-medium',
                  trendObj.isPositive ? 'text-success-600' : 'text-danger-600'
                )}
              >
                {trendObj.isPositive ? '↑' : '↓'} {Math.abs(trendObj.value)}%
              </span>
              <span className='text-xs opacity-70'>vs último período</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('stat-card-icon', iconBgColor)}>{icon}</div>
        )}
      </div>
    </Card>
  );
}

export function CardHeader({
  title,
  description,
  icon,
  action,
}: CardHeaderProps) {
  return (
    <div className='flex items-start justify-between mb-6'>
      <div className='flex items-center gap-3'>
        {icon && <div className='stat-card-icon bg-brand-100'>{icon}</div>}
        <div>
          <h3 className='text-lg font-semibold text-ui-text'>{title}</h3>
          {description && (
            <p className='text-sm text-ui-text-muted mt-0.5'>{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
