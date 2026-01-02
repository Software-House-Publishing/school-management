import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Priority levels for action items
 */
export type ActionPriority = 'high' | 'medium' | 'low';

/**
 * Action item structure
 */
export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  priority?: ActionPriority;
  dueDate?: string;
  icon?: React.ElementType;
  onClick?: () => void;
}

/**
 * Props for the ActionItemsCard component
 */
export interface ActionItemsCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Icon for the card header */
  icon?: React.ElementType;
  /** Icon background color */
  iconColor?: 'red' | 'amber' | 'blue' | 'purple' | 'gray';
  /** List of action items */
  items: ActionItem[];
  /** Maximum height for scrolling */
  maxHeight?: string;
  /** View all handler */
  onViewAll?: () => void;
  /** View all label */
  viewAllLabel?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

const priorityClasses: Record<ActionPriority, string> = {
  high: 'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-gray-50 text-gray-600 border-gray-100',
};

const iconColorClasses: Record<string, string> = {
  red: 'bg-red-50 text-red-600 ring-red-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  purple: 'bg-purple-50 text-purple-600 ring-purple-100',
  gray: 'bg-gray-50 text-gray-600 ring-gray-100',
};

/**
 * Action items card for displaying pending tasks, alerts, or approvals.
 *
 * @example
 * ```tsx
 * <ActionItemsCard
 *   title="Action Items"
 *   subtitle="5 tasks need attention"
 *   icon={AlertCircle}
 *   iconColor="red"
 *   items={[
 *     { id: '1', title: 'Grade pending', priority: 'high', description: 'CS101 Final' },
 *     { id: '2', title: 'Submit report', priority: 'medium', dueDate: 'Tomorrow' }
 *   ]}
 *   onViewAll={() => navigate('/tasks')}
 * />
 * ```
 */
export function ActionItemsCard({
  title,
  subtitle,
  icon: HeaderIcon = AlertCircle,
  iconColor = 'red',
  items,
  maxHeight = '320px',
  onViewAll,
  viewAllLabel = 'View all',
  emptyMessage = 'No pending items',
  className,
}: ActionItemsCardProps) {
  return (
    <Card className={cn('rounded-2xl border shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1',
            iconColorClasses[iconColor]
          )}>
            <HeaderIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y overflow-y-auto" style={{ maxHeight }}>
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-4 px-6 py-4',
                  item.onClick && 'hover:bg-gray-50 cursor-pointer'
                )}
                onClick={item.onClick}
              >
                {ItemIcon && (
                  <div className="mt-0.5">
                    <ItemIcon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    {item.priority && (
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full border font-medium',
                        priorityClasses[item.priority]
                      )}>
                        {item.priority}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  )}
                  {item.dueDate && (
                    <p className="mt-1 text-xs text-gray-500">Due: {item.dueDate}</p>
                  )}
                </div>
                {item.onClick && (
                  <button className="shrink-0 text-blue-600 hover:text-blue-700">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {onViewAll && items.length > 0 && (
        <div className="border-t px-6 py-3">
          <button
            onClick={onViewAll}
            className="w-full text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            {viewAllLabel} →
          </button>
        </div>
      )}
    </Card>
  );
}

export default ActionItemsCard;
