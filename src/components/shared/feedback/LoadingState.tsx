import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Props for the LoadingState component
 */
export interface LoadingStateProps {
  /** Loading variant */
  variant?: 'spinner' | 'skeleton-cards' | 'skeleton-table' | 'page';
  /** Message to display */
  message?: string;
  /** Number of skeleton items */
  count?: number;
  /** Number of table rows for skeleton */
  rows?: number;
  /** Additional className */
  className?: string;
}

/**
 * Skeleton card placeholder
 */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton table row placeholder
 */
function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-4 bg-gray-200 rounded ${i === 0 ? 'w-32' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Loading state component with multiple variants.
 *
 * @example
 * ```tsx
 * // Spinner
 * <LoadingState variant="spinner" message="Loading data..." />
 *
 * // Skeleton cards
 * <LoadingState variant="skeleton-cards" count={4} />
 *
 * // Skeleton table
 * <LoadingState variant="skeleton-table" rows={5} />
 * ```
 */
export function LoadingState({
  variant = 'spinner',
  message = 'Loading...',
  count = 4,
  rows = 5,
  className,
}: LoadingStateProps) {
  if (variant === 'skeleton-cards') {
    return (
      <div className={cn('grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return (
      <div className={cn('bg-white rounded-lg border overflow-hidden', className)}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[400px]', className)}>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}

export default LoadingState;
