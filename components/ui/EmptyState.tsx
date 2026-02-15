import { EmptyStateProps } from '@/types/ui.types';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      {icon && <div className='w-16 h-16 text-ui-text-subtle mb-4'>{icon}</div>}
      <h3 className='text-lg font-semibold text-ui-text mb-1'>{title}</h3>
      {description && (
        <p className='text-sm text-ui-text-muted mb-4'>{description}</p>
      )}
      {action && <div className='mt-2'>{action}</div>}
    </div>
  );
}
