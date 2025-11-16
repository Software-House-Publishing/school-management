import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Wallet, 
  FileText, 
  Settings,
  BarChart3,
  LogOut
} from 'lucide-react';
import { NavItem } from '@/components/shared/Sidebar';

// Admin navigation items
export const adminNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home size={18} />,
    section: 'primary'
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: <Users size={18} />,
    section: 'primary'
  },
  {
    id: 'courses',
    label: 'Courses',
    href: '/admin/courses',
    icon: <BookOpen size={18} />,
    section: 'primary'
  },
  {
    id: 'finance',
    label: 'Finance',
    href: '/admin/finance',
    icon: <Wallet size={18} />,
    section: 'primary'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/admin/reports',
    icon: <BarChart3 size={18} />,
    section: 'primary'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
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