import { ReactNode } from 'react';
import { Card } from './Card';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  optional?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  columns = 2,
  optional = false,
}: FormSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <Card padding="lg">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {title}
            {optional && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                (optional)
              </span>
            )}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div className={`grid gap-4 ${gridCols[columns]}`}>{children}</div>
      </section>
    </Card>
  );
}

// ============================================================
// INFO ITEM (for detail pages)
// ============================================================

export interface InfoItemProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoItem({ label, value, className = '' }: InfoItemProps) {
  return (
    <div className={className}>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">
        {value || '-'}
      </p>
    </div>
  );
}

// ============================================================
// DETAIL SECTION (for detail pages)
// ============================================================

export interface DetailSectionProps {
  title: string;
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function DetailSection({
  title,
  children,
  columns = 2,
}: DetailSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <Card padding="lg">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div className={`grid gap-4 ${gridCols[columns]}`}>{children}</div>
      </section>
    </Card>
  );
}
