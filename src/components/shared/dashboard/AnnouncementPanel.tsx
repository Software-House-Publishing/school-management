import { useState, ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Megaphone, GraduationCap, BookOpen, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Priority levels for announcements
 */
export type AnnouncementPriority = 'urgent' | 'important' | 'normal' | 'info';

/**
 * Announcement item structure
 */
export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  dateLabel: string;
  priority?: AnnouncementPriority;
  scope?: string;
  author?: string;
  courseName?: string;
}

/**
 * Tab configuration for filtering
 */
export interface AnnouncementTab {
  id: string;
  label: string;
  icon?: React.ElementType;
}

/**
 * Props for the AnnouncementPanel component
 */
export interface AnnouncementPanelProps {
  /** List of announcements */
  items: AnnouncementItem[];
  /** Tabs for filtering (optional) */
  tabs?: AnnouncementTab[];
  /** Filter function for tabs */
  filterFn?: (item: AnnouncementItem, activeTab: string) => boolean;
  /** Maximum items to show */
  maxItems?: number;
  /** View all handler */
  onViewAll?: () => void;
  /** Custom title */
  title?: string;
  /** Custom subtitle */
  subtitle?: string;
  /** Icon variant */
  iconVariant?: 'megaphone' | 'bell';
  /** Additional className */
  className?: string;
}

const priorityClasses: Record<AnnouncementPriority, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-100',
  important: 'bg-amber-50 text-amber-700 border-amber-100',
  normal: 'bg-gray-50 text-gray-600 border-gray-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
};

/**
 * Priority badge component
 */
function PriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
      priorityClasses[priority]
    )}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

/**
 * Announcement panel with optional tab filtering.
 * Used on dashboards to show relevant announcements.
 *
 * @example
 * ```tsx
 * // Simple list
 * <AnnouncementPanel
 *   items={announcements}
 *   maxItems={5}
 *   onViewAll={() => navigate('/announcements')}
 * />
 *
 * // With tabs
 * <AnnouncementPanel
 *   items={announcements}
 *   tabs={[
 *     { id: 'university', label: 'University', icon: GraduationCap },
 *     { id: 'course', label: 'My Courses', icon: BookOpen }
 *   ]}
 *   filterFn={(item, tab) => item.scope === tab}
 * />
 * ```
 */
export function AnnouncementPanel({
  items,
  tabs,
  filterFn,
  maxItems = 5,
  onViewAll,
  title = 'Announcements',
  subtitle = 'Latest updates',
  iconVariant = 'megaphone',
  className,
}: AnnouncementPanelProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '');

  const Icon = iconVariant === 'bell' ? Bell : Megaphone;
  const iconBg = iconVariant === 'bell'
    ? 'bg-indigo-50 text-indigo-600 ring-indigo-100'
    : 'bg-indigo-50 text-indigo-700 ring-indigo-100';

  const filteredItems = filterFn && activeTab
    ? items.filter(item => filterFn(item, activeTab)).slice(0, maxItems)
    : items.slice(0, maxItems);

  return (
    <Card className={cn('rounded-2xl border shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1',
            iconBg
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="inline-flex rounded-2xl bg-gray-100 p-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {TabIcon && <TabIcon className="h-4 w-4" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="px-6">
        <div className="divide-y">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-sm text-gray-600 text-center">
              No announcements.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      {item.priority && item.priority !== 'normal' && (
                        <PriorityBadge priority={item.priority} />
                      )}
                      {item.scope && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize">
                          {item.scope}
                        </span>
                      )}
                      {item.courseName && (
                        <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {item.courseName}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {item.body}
                    </p>
                    {item.author && (
                      <p className="mt-2 text-xs text-gray-400">From: {item.author}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    {item.dateLabel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      {onViewAll && (
        <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-gray-600">
          <span>Check regularly for updates</span>
          <button
            type="button"
            onClick={onViewAll}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            View all
          </button>
        </div>
      )}
    </Card>
  );
}

export default AnnouncementPanel;
