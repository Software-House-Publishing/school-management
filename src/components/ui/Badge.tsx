import { ReactNode } from 'react';
import { cn } from '@/utils';
import {
  getStudentStatusClasses,
  getTeacherStatusClasses,
  getEmploymentTypeClasses,
  getRoleBadgeClasses,
  getStudentStatusLabel,
  getTeacherStatusLabel,
  getEmploymentTypeLabel,
  formatRole,
} from '@/utils/formatters';

// ============================================================
// BASE BADGE
// ============================================================

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        variant === 'outline' && 'border',
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================================
// STATUS BADGES
// ============================================================

export interface StatusBadgeProps {
  status: string;
  type: 'student' | 'teacher' | 'employment';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type, size = 'sm' }: StatusBadgeProps) {
  let classes: string;
  let label: string;

  switch (type) {
    case 'student':
      classes = getStudentStatusClasses(status);
      label = getStudentStatusLabel(status);
      break;
    case 'teacher':
      classes = getTeacherStatusClasses(status);
      label = getTeacherStatusLabel(status);
      break;
    case 'employment':
      classes = getEmploymentTypeClasses(status);
      label = getEmploymentTypeLabel(status);
      break;
    default:
      classes = 'bg-slate-100 text-slate-700';
      label = status;
  }

  return (
    <Badge className={classes} size={size}>
      {label}
    </Badge>
  );
}

// ============================================================
// ROLE BADGE
// ============================================================

export interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  return (
    <Badge className={getRoleBadgeClasses(role)} variant="outline" size={size}>
      {formatRole(role)}
    </Badge>
  );
}

// ============================================================
// ACTIVE STATUS INDICATOR
// ============================================================

export interface ActiveStatusProps {
  isActive: boolean;
  showLabel?: boolean;
}

export function ActiveStatus({ isActive, showLabel = true }: ActiveStatusProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'h-2 w-2 rounded-full mr-1.5',
          isActive
            ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]'
            : 'bg-red-400'
        )}
      />
      {showLabel && (
        <span
          className={cn(
            'text-xs font-medium',
            isActive ? 'text-green-700' : 'text-red-600'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  );
}
