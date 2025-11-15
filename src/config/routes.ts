import { UserRole } from '@/types/auth';

export interface RoutePermission {
  path: string;
  roles: UserRole[];
  redirectTo?: string;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Public routes
  { path: '/', roles: ['student', 'teacher', 'director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/about', roles: ['student', 'teacher', 'director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/contact', roles: ['student', 'teacher', 'director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/rules', roles: ['student', 'teacher', 'director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/login', roles: ['student', 'teacher', 'director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  
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
  
  // Admin portal - Director and Administrator
  { path: '/admin/*', roles: ['director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/admin/dashboard', roles: ['director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/admin/users', roles: ['director', 'administrator', 'manager', 'help_desk'] },
  { path: '/admin/courses', roles: ['director', 'administrator', 'manager', 'teacher'] },
  { path: '/admin/finance', roles: ['director', 'administrator', 'finance_officer'] },
  { path: '/admin/reports', roles: ['director', 'administrator', 'manager', 'finance_officer', 'help_desk'] },
  { path: '/admin/settings', roles: ['director', 'administrator'] },
];

export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'director':
    case 'administrator':
    case 'manager':
    case 'finance_officer':
    case 'help_desk':
      return '/admin/dashboard';
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