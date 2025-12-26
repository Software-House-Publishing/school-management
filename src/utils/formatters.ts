/**
 * Consolidated helper functions for formatting and styling
 */

// ============================================================
// NAME FORMATTERS
// ============================================================

export function fullName(entity: { firstName: string; lastName: string }): string {
  return `${entity.firstName} ${entity.lastName}`;
}

export function getInitials(entity: { firstName: string; lastName: string }): string {
  return `${entity.firstName[0] || ''}${entity.lastName[0] || ''}`.toUpperCase();
}

// ============================================================
// STATUS BADGE CLASSES
// ============================================================

export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'withdrawn';
export type TeacherStatus = 'active' | 'on_leave' | 'resigned';
export type EmploymentType = 'full_time' | 'part_time' | 'visiting';
export type UserRole = 'system_administrator' | 'school_administrator' | 'teacher' | 'student' | 'finance_officer' | 'manager';

export function getStudentStatusClasses(status: StudentStatus | string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'graduated':
      return 'bg-blue-100 text-blue-800';
    case 'transferred':
      return 'bg-yellow-100 text-yellow-800';
    case 'withdrawn':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

export function getTeacherStatusClasses(status: TeacherStatus | string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'on_leave':
      return 'bg-amber-100 text-amber-800';
    case 'resigned':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

export function getEmploymentTypeClasses(type: EmploymentType | string): string {
  switch (type) {
    case 'full_time':
      return 'bg-blue-100 text-blue-800';
    case 'part_time':
      return 'bg-purple-100 text-purple-800';
    case 'visiting':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function getRoleBadgeClasses(role: UserRole | string): string {
  switch (role) {
    case 'system_administrator':
      return 'bg-red-100/50 text-red-700 border-red-200';
    case 'school_administrator':
      return 'bg-purple-100/50 text-purple-700 border-purple-200';
    case 'teacher':
      return 'bg-blue-100/50 text-blue-700 border-blue-200';
    case 'student':
      return 'bg-green-100/50 text-green-700 border-green-200';
    case 'finance_officer':
      return 'bg-yellow-100/50 text-yellow-700 border-yellow-200';
    case 'manager':
      return 'bg-orange-100/50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100/50 text-gray-700 border-gray-200';
  }
}

// ============================================================
// STATUS LABELS
// ============================================================

export function getStudentStatusLabel(status: StudentStatus | string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'graduated':
      return 'Graduated';
    case 'transferred':
      return 'Transferred';
    case 'withdrawn':
      return 'Withdrawn';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getTeacherStatusLabel(status: TeacherStatus | string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'on_leave':
      return 'On Leave';
    case 'resigned':
      return 'Resigned';
    default:
      return status;
  }
}

export function getEmploymentTypeLabel(type: EmploymentType | string): string {
  switch (type) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'visiting':
      return 'Visiting';
    default:
      return type;
  }
}

export function formatRole(role: UserRole | string): string {
  switch (role) {
    case 'system_administrator':
      return 'System Admin';
    case 'school_administrator':
      return 'School Admin';
    case 'teacher':
      return 'Teacher';
    case 'student':
      return 'Student';
    case 'finance_officer':
      return 'Finance';
    case 'manager':
      return 'Manager';
    default:
      return role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

// ============================================================
// DATE FORMATTERS
// ============================================================

export function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================
// NUMBER FORMATTERS
// ============================================================

export function formatCurrency(amount: number | undefined, currency = 'USD'): string {
  if (amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined) return '-';
  return `${value.toFixed(1)}%`;
}

// ============================================================
// STRING FORMATTERS
// ============================================================

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
