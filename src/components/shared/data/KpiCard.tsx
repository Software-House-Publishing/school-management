import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Color variants for KPI cards
 */
export type KpiCardColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'gray' | 'emerald';

/**
 * Trend direction for KPI values
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Props for the KpiCard component
 */
export interface KpiCardProps {
  /** Icon to display (Lucide icon component) */
  icon: React.ElementType;
  /** Label/title for the metric */
  label: string;
  /** The metric value to display */
  value: string | number;
  /** Optional subtext below the value */
  subtext?: string;
  /** Color theme for the card */
  color?: KpiCardColor;
  /** Optional trend indicator */
  trend?: {
    direction: TrendDirection;
    value: string;
    label?: string;
  };
  /** Click handler for the card */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Left border accent color */
  accentBorder?: boolean;
}

const colorClasses: Record<KpiCardColor, { icon: string; accent: string }> = {
  blue: {
    icon: 'bg-blue-50 text-blue-600 ring-blue-100',
    accent: 'border-l-blue-500',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    accent: 'border-l-emerald-500',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    accent: 'border-l-emerald-500',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-100',
    accent: 'border-l-amber-500',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600 ring-purple-100',
    accent: 'border-l-purple-500',
  },
  red: {
    icon: 'bg-red-50 text-red-600 ring-red-100',
    accent: 'border-l-red-500',
  },
  gray: {
    icon: 'bg-gray-50 text-gray-600 ring-gray-100',
    accent: 'border-l-gray-400',
  },
};

const trendClasses: Record<TrendDirection, string> = {
  up: 'bg-emerald-100 text-emerald-800',
  down: 'bg-rose-100 text-rose-800',
  neutral: 'bg-gray-100 text-gray-700',
};

/**
 * KPI (Key Performance Indicator) card for displaying metrics on dashboards.
 * Supports icons, trend indicators, and click actions.
 *
 * @example
 * ```tsx
 * <KpiCard
 *   icon={Users}
 *   label="Total Students"
 *   value={750}
 *   subtext="This semester"
 *   color="blue"
 *   trend={{ direction: 'up', value: '+5.2%', label: 'from last month' }}
 *   onClick={() => navigate('/students')}
 * />
 * ```
 */
export function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = 'blue',
  trend,
  onClick,
  className,
  accentBorder = false,
}: KpiCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        'rounded-2xl border shadow-sm p-5',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        accentBorder && `border-l-4 ${colors.accent}`,
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="mt-1 text-xs text-gray-500">{subtext}</p>}

          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trendClasses[trend.direction]
              )}>
                {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-xs text-gray-500">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1',
          colors.icon
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Grid container for multiple KPI cards
 */
export interface KpiCardsRowProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KpiCardsRow({ children, columns = 4, className }: KpiCardsRowProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {children}
    </div>
  );
}

export default KpiCard;
