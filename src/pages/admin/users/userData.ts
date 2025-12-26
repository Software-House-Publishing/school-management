import { UserRole } from '@/types/auth';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserEmployment {
  department?: string;
  position?: string;
  startDate?: string;
  employeeId?: string;
  contractType?: 'full-time' | 'part-time' | 'contract';
}

export interface UserPermissions {
  canManageUsers?: boolean;
  canManageFinance?: boolean;
  canManageCourses?: boolean;
  canManageReports?: boolean;
  canManageSettings?: boolean;
}

export interface UserActivity {
  lastLogin?: string;
  loginCount?: number;
  lastPasswordChange?: string;
  createdBy?: string;
}

export interface SystemUser {
  id: string;
  odooId: string; // Human-readable ID (USR-2024-001)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  schoolName?: string;
  schoolId?: string;
  address?: UserAddress;
  employment?: UserEmployment;
  permissions?: UserPermissions;
  activity?: UserActivity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: SystemUser[] = [
  {
    id: '1',
    odooId: 'USR-2024-001',
    firstName: 'Eleanor',
    lastName: 'Rigby',
    email: 'eleanor.rigby@classivo.edu',
    phone: '+1 555-0101',
    role: 'school_administrator',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    schoolName: "St. Mary's High School",
    schoolId: 'SCH-001',
    address: {
      street: '123 Education Lane',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'USA',
    },
    employment: {
      department: 'Administration',
      position: 'School Principal',
      startDate: '2020-08-15',
      employeeId: 'EMP-001',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: true,
      canManageFinance: true,
      canManageCourses: true,
      canManageReports: true,
      canManageSettings: true,
    },
    activity: {
      lastLogin: '2025-12-25T14:30:00Z',
      loginCount: 458,
      lastPasswordChange: '2025-10-01T09:00:00Z',
      createdBy: 'System Admin',
    },
    notes: 'Primary administrator for St. Mary\'s High School. Has full access to all school management features.',
    createdAt: '2020-08-15T10:00:00Z',
    updatedAt: '2025-12-25T14:30:00Z',
  },
  {
    id: '2',
    odooId: 'USR-2024-002',
    firstName: 'James',
    lastName: 'Cameron',
    email: 'james.cameron@classivo.edu',
    phone: '+1 555-0102',
    role: 'system_administrator',
    status: 'active',
    schoolName: 'Classivo Platform',
    address: {
      street: '456 Tech Boulevard',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
    },
    employment: {
      department: 'IT Operations',
      position: 'System Administrator',
      startDate: '2019-03-01',
      employeeId: 'SYS-001',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: true,
      canManageFinance: true,
      canManageCourses: true,
      canManageReports: true,
      canManageSettings: true,
    },
    activity: {
      lastLogin: '2025-12-26T08:15:00Z',
      loginCount: 1250,
      lastPasswordChange: '2025-11-15T10:00:00Z',
      createdBy: 'Root Admin',
    },
    notes: 'Platform-wide system administrator. Manages all schools and system configurations.',
    createdAt: '2019-03-01T09:00:00Z',
    updatedAt: '2025-12-26T08:15:00Z',
  },
  {
    id: '3',
    odooId: 'USR-2024-003',
    firstName: 'John',
    lastName: 'Nash',
    email: 'john.nash@classivo.edu',
    phone: '+1 555-0103',
    role: 'teacher',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    schoolName: 'Westover Academy',
    schoolId: 'SCH-002',
    address: {
      street: '789 Academic Drive',
      city: 'Princeton',
      state: 'NJ',
      postalCode: '08540',
      country: 'USA',
    },
    employment: {
      department: 'Mathematics',
      position: 'Senior Mathematics Teacher',
      startDate: '2021-09-01',
      employeeId: 'TCH-015',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: false,
      canManageFinance: false,
      canManageCourses: true,
      canManageReports: false,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-12-24T16:45:00Z',
      loginCount: 312,
      lastPasswordChange: '2025-09-01T08:00:00Z',
      createdBy: 'Eleanor Rigby',
    },
    notes: 'Teaches Advanced Mathematics and Calculus. Department head for Mathematics.',
    createdAt: '2021-09-01T08:00:00Z',
    updatedAt: '2025-12-24T16:45:00Z',
  },
  {
    id: '4',
    odooId: 'USR-2024-004',
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter.parker@classivo.edu',
    phone: '+1 555-0104',
    role: 'student',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    schoolName: 'Tech High',
    schoolId: 'SCH-003',
    address: {
      street: '20 Ingram Street',
      city: 'Queens',
      state: 'NY',
      postalCode: '11375',
      country: 'USA',
    },
    activity: {
      lastLogin: '2025-12-23T09:30:00Z',
      loginCount: 189,
      lastPasswordChange: '2025-08-20T14:00:00Z',
      createdBy: 'School Admin',
    },
    notes: 'Honor roll student. Active in science club and photography.',
    createdAt: '2024-03-10T11:45:00Z',
    updatedAt: '2025-12-23T09:30:00Z',
  },
  {
    id: '5',
    odooId: 'USR-2024-005',
    firstName: 'Gordon',
    lastName: 'Gekko',
    email: 'gordon.gekko@classivo.edu',
    phone: '+1 555-0105',
    role: 'finance_officer',
    status: 'inactive',
    schoolName: 'Scranton Branch',
    schoolId: 'SCH-004',
    address: {
      street: '1725 Slough Avenue',
      city: 'Scranton',
      state: 'PA',
      postalCode: '18503',
      country: 'USA',
    },
    employment: {
      department: 'Finance',
      position: 'Chief Financial Officer',
      startDate: '2022-01-15',
      employeeId: 'FIN-003',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: false,
      canManageFinance: true,
      canManageCourses: false,
      canManageReports: true,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-11-30T17:00:00Z',
      loginCount: 245,
      lastPasswordChange: '2025-06-15T11:00:00Z',
      createdBy: 'James Cameron',
    },
    notes: 'Currently on administrative leave. Account temporarily deactivated.',
    createdAt: '2022-01-15T09:00:00Z',
    updatedAt: '2025-11-30T17:00:00Z',
  },
  {
    id: '6',
    odooId: 'USR-2024-006',
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'michael.scott@classivo.edu',
    phone: '+1 555-0106',
    role: 'manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    schoolName: 'Scranton Branch',
    schoolId: 'SCH-004',
    address: {
      street: '1725 Slough Avenue',
      city: 'Scranton',
      state: 'PA',
      postalCode: '18503',
      country: 'USA',
    },
    employment: {
      department: 'Operations',
      position: 'Regional Manager',
      startDate: '2021-04-01',
      employeeId: 'MGR-007',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: true,
      canManageFinance: false,
      canManageCourses: true,
      canManageReports: true,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-12-26T07:30:00Z',
      loginCount: 567,
      lastPasswordChange: '2025-12-01T09:00:00Z',
      createdBy: 'James Cameron',
    },
    notes: 'Oversees daily operations and staff management. Known for creative problem-solving.',
    createdAt: '2021-04-01T08:00:00Z',
    updatedAt: '2025-12-26T07:30:00Z',
  },
  {
    id: '7',
    odooId: 'USR-2024-007',
    firstName: 'Angela',
    lastName: 'Martin',
    email: 'angela.martin@classivo.edu',
    phone: '+1 555-0107',
    role: 'finance_officer',
    status: 'active',
    schoolName: 'Scranton Branch',
    schoolId: 'SCH-004',
    address: {
      street: '1234 Accounting Way',
      city: 'Scranton',
      state: 'PA',
      postalCode: '18503',
      country: 'USA',
    },
    employment: {
      department: 'Finance',
      position: 'Senior Accountant',
      startDate: '2020-06-01',
      employeeId: 'FIN-002',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: false,
      canManageFinance: true,
      canManageCourses: false,
      canManageReports: true,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-12-25T16:00:00Z',
      loginCount: 412,
      lastPasswordChange: '2025-09-15T10:00:00Z',
      createdBy: 'Michael Scott',
    },
    notes: 'Handles accounts receivable and financial reporting. Very detail-oriented.',
    createdAt: '2020-06-01T08:00:00Z',
    updatedAt: '2025-12-25T16:00:00Z',
  },
  {
    id: '8',
    odooId: 'USR-2024-008',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@classivo.edu',
    phone: '+1 555-0108',
    role: 'help_desk',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    schoolName: 'Tech High',
    schoolId: 'SCH-003',
    address: {
      street: '2029 Future Road',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
    employment: {
      department: 'IT Support',
      position: 'Help Desk Specialist',
      startDate: '2023-02-15',
      employeeId: 'HD-004',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: false,
      canManageFinance: false,
      canManageCourses: false,
      canManageReports: false,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-12-26T09:00:00Z',
      loginCount: 298,
      lastPasswordChange: '2025-11-01T08:00:00Z',
      createdBy: 'Eleanor Rigby',
    },
    notes: 'First point of contact for technical support. Excellent customer service skills.',
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2025-12-26T09:00:00Z',
  },
  {
    id: '9',
    odooId: 'USR-2024-009',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@classivo.edu',
    phone: '+1 555-0109',
    role: 'teacher',
    status: 'suspended',
    schoolName: "St. Mary's High School",
    schoolId: 'SCH-001',
    address: {
      street: '567 Science Street',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62702',
      country: 'USA',
    },
    employment: {
      department: 'Science',
      position: 'Physics Teacher',
      startDate: '2022-09-01',
      employeeId: 'TCH-022',
      contractType: 'full-time',
    },
    permissions: {
      canManageUsers: false,
      canManageFinance: false,
      canManageCourses: true,
      canManageReports: false,
      canManageSettings: false,
    },
    activity: {
      lastLogin: '2025-12-10T11:30:00Z',
      loginCount: 156,
      lastPasswordChange: '2025-07-20T14:00:00Z',
      createdBy: 'Eleanor Rigby',
    },
    notes: 'Account suspended pending HR review. Contact HR for details.',
    createdAt: '2022-09-01T08:00:00Z',
    updatedAt: '2025-12-10T11:30:00Z',
  },
  {
    id: '10',
    odooId: 'USR-2024-010',
    firstName: 'Emily',
    lastName: 'Watson',
    email: 'emily.watson@classivo.edu',
    phone: '+1 555-0110',
    role: 'student',
    status: 'pending',
    schoolName: 'Westover Academy',
    schoolId: 'SCH-002',
    address: {
      street: '890 Student Lane',
      city: 'Princeton',
      state: 'NJ',
      postalCode: '08541',
      country: 'USA',
    },
    activity: {
      lastLogin: undefined,
      loginCount: 0,
      createdBy: 'John Nash',
    },
    notes: 'New student enrollment. Awaiting document verification.',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
];

const STORAGE_KEY = 'system_users';
const STORAGE_VERSION_KEY = 'system_users_version';
const CURRENT_VERSION = '1';

export function loadUsers(): SystemUser[] {
  if (typeof window === 'undefined') return mockUsers;

  try {
    const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
      window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return mockUsers;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockUsers;

    const parsed = JSON.parse(raw) as SystemUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) return mockUsers;

    return parsed;
  } catch {
    return mockUsers;
  }
}

export function saveUsers(users: SystemUser[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUserById(id: string): SystemUser | undefined {
  return loadUsers().find((u) => u.id === id);
}

export function generateUserId(): string {
  const users = loadUsers();
  const maxId = users.reduce((max, u) => {
    const num = parseInt(u.id, 10);
    return num > max ? num : max;
  }, 0);
  return String(maxId + 1);
}

export function generateOdooId(): string {
  const users = loadUsers();
  const year = new Date().getFullYear();
  const maxNum = users.reduce((max, u) => {
    const match = u.odooId.match(/USR-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  return `USR-${year}-${String(maxNum + 1).padStart(3, '0')}`;
}
