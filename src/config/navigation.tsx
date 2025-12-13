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
  BookCheck
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
    id: 'settings',
    label: 'Settings',
    href: '/school-admin/settings',
    icon: <Settings size={18} />,
    section: 'secondary'
  },
];


export const managerNavItems = adminNavItems;

// Admin navigation items
export const directorNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/system-admin/dashboard',
    icon: <Home size={18} />,
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
    id: 'courses',
    label: 'Courses',
    href: '/system-admin/courses',
    icon: <BookOpen size={18} />,
    section: 'primary'
  },
  {
    id: 'finance',
    label: 'Finance',
    href: '/system-admin/finance',
    icon: <Wallet size={18} />,
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
    id: 'settings',
    label: 'Settings',
    href: '/system-admin/settings',
    icon: <Settings size={18} />,
    section: 'secondary'
  }
];

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
    id: 'courses',
    label: 'My Courses',
    href: '/student/courses',
    icon: <BookOpen size={18} />,
    section: 'primary'
  },
  {
    id: 'exams',
    label: 'Exams',
    href: '/student/exams',
    icon: <FileText size={18} />,
    section: 'primary'
  },
  {
    id: 'fees',
    label: 'Fees',
    href: '/student/fees',
    icon: <Wallet size={18} />,
    section: 'primary'
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
    id: 'exams',
    label: 'Exams',
    href: '/teacher/exams',
    icon: <FileText size={18} />,
    section: 'primary'
  },
  {
    id: 'announcements',
    label: 'Announcements',
    href: '/teacher/announcements',
    icon: <BarChart3 size={18} />,
    section: 'primary'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/teacher/profile',
    icon: <Settings size={18} />,
    section: 'secondary'
  }
];