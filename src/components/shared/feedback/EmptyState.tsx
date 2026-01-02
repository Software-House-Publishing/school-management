import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** Icon to display (defaults to Search icon) */
  icon?: ReactNode;
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button or element */
  action?: ReactNode;
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'py-6',
    icon: 'w-8 h-8 mb-2',
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    container: 'py-12',
    icon: 'w-12 h-12 mb-4',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'w-16 h-16 mb-6',
    title: 'text-xl',
    description: 'text-base',
  },
};

/**
 * Empty state component for when there's no data to display.
 * Use in tables, lists, and content areas.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Users className="w-12 h-12" />}
 *   title="No students found"
 *   description="Get started by adding your first student"
 *   action={<Button>Add Student</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizes.container,
      className
    )}>
      <div className={cn('text-gray-300', sizes.icon)}>
        {icon || <Search className="w-full h-full" />}
      </div>
      <h3 className={cn('font-medium text-gray-900', sizes.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn('mt-1 text-gray-500', sizes.description)}>
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
