import { UserRole } from '@/types/auth';

export interface RoutePermission {
  path: string;
  roles: UserRole[];
  redirectTo?: string;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Public routes
  { path: '/', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/about', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/pricing', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/contact', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/rules', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/login', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/register', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/forgot-password', roles: ['student', 'teacher', 'system_administrator', 'school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  
  // Student portal
  { path: '/student/*', roles: ['student'] },
  { path: '/student/dashboard', roles: ['student'] },
  { path: '/student/courses', roles: ['student'] },
  { path: '/student/exams', roles: ['student'] },
  { path: '/student/profile', roles: ['student'] },
  { path: '/student/fees', roles: ['student'] },
  
  // Teacher portal
  { path: '/teacher/*', roles: ['teacher'] },
  { path: '/teacher/dashboard', roles: ['teacher'] },
  { path: '/teacher/courses', roles: ['teacher'] },
  { path: '/teacher/students', roles: ['teacher'] },
  { path: '/teacher/exams', roles: ['teacher'] },
  { path: '/teacher/announcements', roles: ['teacher'] },
  
  // School Admin portal - School Administrator, Manager, etc.
  { path: '/school-admin/*', roles: ['school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/school-admin/dashboard', roles: ['school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/school-admin/students', roles: ['school_administrator', 'manager', 'help_desk'] },
  { path: '/school-admin/teachers', roles: ['school_administrator', 'manager'] },
  { path: '/school-admin/courses', roles: ['school_administrator', 'manager', 'teacher'] },
  { path: '/school-admin/finance', roles: ['school_administrator', 'finance_officer'] },
  { path: '/school-admin/reports', roles: ['school_administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/school-admin/settings', roles: ['school_administrator'] },
  { path: '/school-admin/invoices', roles: ['school_administrator', 'finance_officer'] },
  { path: '/school-admin/exams', roles: ['school_administrator', 'manager'] },
  { path: '/school-admin/announcements', roles: ['school_administrator', 'manager'] },

  // System Admin portal - System Administrator
  { path: '/system-admin/*', roles: ['system_administrator'] },
  { path: '/system-admin/dashboard', roles: ['system_administrator'] },
  { path: '/system-admin/users', roles: ['system_administrator'] },
  { path: '/system-admin/courses', roles: ['system_administrator'] },
  { path: '/system-admin/finance', roles: ['system_administrator'] },
  { path: '/system-admin/reports', roles: ['system_administrator'] },
  { path: '/system-admin/settings', roles: ['system_administrator'] },
];

export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'system_administrator':
      return '/system-admin/dashboard';
    case 'school_administrator':
    case 'manager':
    case 'finance_officer':
    case 'help_desk':
      return '/school-admin/dashboard';
    default:
      return '/';
  }
};

export const hasRouteAccess = (path: string, role: UserRole): boolean => {
  // Check for exact match first
  const exactMatch = ROUTE_PERMISSIONS.find(
    (route) => route.path === path && route.roles.includes(role)
  );
  
  if (exactMatch) return true;
  
  // Check for wildcard matches
  const wildcardMatches = ROUTE_PERMISSIONS.filter(
    (route) => route.path.endsWith('/*') && path.startsWith(route.path.replace('/*', ''))
  );
  
  return wildcardMatches.some((route) => route.roles.includes(role));
};