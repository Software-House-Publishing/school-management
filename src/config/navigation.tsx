import React from 'react';
import {
  Home,
  Users,
  BookOpen,
  Wallet,
  FileText,
  Settings,
  BarChart3,
  BellPlus,
  UserCog,
  BookCheck,
  QrCode,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  UserCircle,
  Calendar,
  Bell,
  Building2,
  Shield,
  KeyRound,
  Megaphone,
  Plug,
  ScrollText,
  Wrench,
  HeadphonesIcon,
  Activity,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import { NavItem } from '@/components/shared/Sidebar';

// For school admin & manager
export const adminNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/school-admin/dashboard',
    icon: <Home size={18} />,
    section: 'primary',
  },
  {
    id: 'students',
    label: 'Students',
    href: '/school-admin/students',
    icon: <Users size={18} />,
    section: 'primary',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    href: '/school-admin/teachers',
    icon: <UserCog size={18} />,
    section: 'primary',
  },
  {
    id: 'courses',
    label: 'Courses',
    href: '/school-admin/courses',
    icon: <BookOpen size={18} />,
    section: 'primary',
  },
  {
    id: 'announcements',
    label: 'Announcements',
    href: '/school-admin/announcements',
    icon: <BellPlus size={18} />,
    section: 'primary',
  },
  {
    id: 'exams',
    label: 'Exams/Quizzes',
    href: '/school-admin/exams',
    icon: <BookCheck size={18} />,
    section: 'primary',
  },
  {
    id: 'finance',
    label: 'Finance',
    href: '/school-admin/finance',
    icon: <Wallet size={18} />,
    section: 'primary'
  },
  {
    id: 'invoices',
    label: 'Invoices',
    href: '/school-admin/invoices',
    icon: <FileText size={18} />,
    section: 'primary',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/school-admin/reports',
    icon: <BarChart3 size={18} />,
    section: 'primary',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/school-admin/calendar',
    icon: <Calendar size={18} />,
    section: 'primary',
  },
  {
    id: 'timetable-planner',
    label: 'Timetable Planner',
    href: '/school-admin/timetable-dashboard',
    icon: <LayoutGrid size={18} />,
    section: 'primary',
  },
  {
    id: 'teacher-availability',
    label: 'Teacher Availability',
    href: '/school-admin/teacher-availability',
    icon: <CalendarDays size={18} />,
    section: 'primary',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/school-admin/notifications',
    icon: <Bell size={18} />,
    section: 'secondary'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/school-admin/settings',
    icon: <Settings size={18} />,
    section: 'secondary'
  },
];


export const managerNavItems = adminNavItems;

// System Admin navigation items
export const systemAdminNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/system-admin/dashboard',
    icon: <Home size={18} />,
    section: 'primary'
  },
  {
    id: 'schools',
    label: 'Schools',
    href: '/system-admin/schools',
    icon: <Building2 size={18} />,
    section: 'primary'
  },
  {
    id: 'school-admins',
    label: 'School Admins',
    href: '/system-admin/school-admins',
    icon: <UserCog size={18} />,
    section: 'primary'
  },
  {
    id: 'users',
    label: 'Users',
    href: '/system-admin/users',
    icon: <Users size={18} />,
    section: 'primary'
  },
  {
    id: 'roles-permissions',
    label: 'Roles & Permissions',
    href: '/system-admin/roles',
    icon: <KeyRound size={18} />,
    section: 'primary'
  },
  {
    id: 'announcements',
    label: 'Announcements',
    href: '/system-admin/announcements',
    icon: <Megaphone size={18} />,
    section: 'primary'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/system-admin/reports',
    icon: <BarChart3 size={18} />,
    section: 'primary'
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/system-admin/integrations',
    icon: <Plug size={18} />,
    section: 'primary'
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    href: '/system-admin/audit-logs',
    icon: <ScrollText size={18} />,
    section: 'primary'
  },
  {
    id: 'settings',
    label: 'System Settings',
    href: '/system-admin/settings',
    icon: <Wrench size={18} />,
    section: 'secondary'
  },
  {
    id: 'support',
    label: 'Support Center',
    href: '/system-admin/support',
    icon: <HeadphonesIcon size={18} />,
    section: 'secondary'
  },
  {
    id: 'security',
    label: 'Security',
    href: '/system-admin/security',
    icon: <Shield size={18} />,
    section: 'secondary'
  },
  {
    id: 'system-health',
    label: 'System Health',
    href: '/system-admin/health',
    icon: <Activity size={18} />,
    section: 'secondary'
  }
];

// Keep backward compatibility alias
export const directorNavItems = systemAdminNavItems;

// Student navigation items
export const studentNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/student/dashboard',
    icon: <Home size={18} />,
    section: 'primary'
  },
  {
    id: 'qr-virtual-id',
    label: 'QR Virtual ID',
    href: '/student/qr-id',
    icon: <QrCode size={18} />,
    section: 'primary'
  },
  {
    id: 'grades',
    label: 'Grades',
    href: '/student/grades',
    icon: <GraduationCap size={18} />,
    section: 'primary'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    href: '/student/schedule',
    icon: <CalendarDays size={18} />,
    section: 'primary'
  },
  {
    id: 'courses',
    label: 'Courses',
    href: '/student/courses',
    icon: <BookOpen size={18} />,
    section: 'primary'
  },
  {
    id: 'advisor',
    label: 'Advisor',
    href: '/student/advisor',
    icon: <UserCircle size={18} />,
    section: 'primary'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    href: '/student/assignments',
    icon: <ClipboardList size={18} />,
    section: 'primary'
  },
  {
    id: 'exams',
    label: 'Exams',
    href: '/student/exams',
    icon: <BookCheck size={18} />,
    section: 'primary'
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '/student/fees',
    icon: <Wallet size={18} />,
    section: 'primary'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/student/calendar',
    icon: <Calendar size={18} />,
    section: 'primary'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/student/notifications',
    icon: <Bell size={18} />,
    section: 'secondary'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/student/profile',
    icon: <Settings size={18} />,
    section: 'secondary'
  }
];

// Teacher navigation items
export const teacherNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/teacher/dashboard',
    icon: <Home size={18} />,
    section: 'primary'
  },
  {
    id: 'courses',
    label: 'My Courses',
    href: '/teacher/courses',
    icon: <BookOpen size={18} />,
    section: 'primary'
  },
  {
    id: 'students',
    label: 'Students',
    href: '/teacher/students',
    icon: <Users size={18} />,
    section: 'primary'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    href: '/teacher/schedule',
    icon: <CalendarDays size={18} />,
    section: 'primary'
  },
  {
    id: 'exams',
    label: 'Exams',
    href: '/teacher/exams',
    icon: <BookCheck size={18} />,
    section: 'primary'
  },
  {
    id: 'announcements',
    label: 'Announcements',
    href: '/teacher/announcements',
    icon: <BellPlus size={18} />,
    section: 'primary'
  },
  {
    id: 'availability',
    label: 'My Availability',
    href: '/teacher/availability',
    icon: <Clock size={18} />,
    section: 'primary'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/teacher/notifications',
    icon: <Bell size={18} />,
    section: 'secondary'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/teacher/profile',
    icon: <UserCircle size={18} />,
    section: 'secondary'
  }
];