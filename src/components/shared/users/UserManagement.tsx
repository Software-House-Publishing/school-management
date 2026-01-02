import { useState, useMemo } from 'react';
import { User, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Mail, School, Hash, Shield, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable, ColumnDef, FilterDef } from '@/components/shared/DataTable';

const MOCK_USERS: User[] = [
  {
    id: 'USR-2024-001',
    firstName: 'Eleanor',
    lastName: 'Rigby',
    email: 'eleanor.rigby@classivo.edu',
    role: 'school_administrator',
    schoolName: 'St. Marys High School',
    isActive: true,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-01T10:00:00Z',
  },
  {
    id: 'USR-2024-002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@classivo.edu',
    role: 'teacher',
    schoolName: 'Westover Academy',
    isActive: true,
    createdAt: '2023-08-15T09:30:00Z',
    updatedAt: '2023-08-15T09:30:00Z',
  },
  {
    id: 'USR-2024-003',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@sky.net',
    role: 'student',
    schoolName: 'Tech High',
    isActive: false,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 'USR-2024-004',
    firstName: 'Michael',
    lastName: 'Scott',
    email: 'm.scott@paper.co',
    role: 'manager',
    schoolName: 'Scranton Branch',
    isActive: true,
    createdAt: '2022-11-05T08:00:00Z',
    updatedAt: '2022-11-05T08:00:00Z',
  },
  {
    id: 'USR-2024-005',
    firstName: 'Angela',
    lastName: 'Martin',
    email: 'angela.m@paper.co',
    role: 'finance_officer',
    schoolName: 'Scranton Branch',
    isActive: true,
    createdAt: '2022-11-06T09:15:00Z',
    updatedAt: '2022-11-06T09:15:00Z',
  }
];

export type { ColumnDef };

interface UserManagementProps {
  users?: User[];
  isLoading?: boolean;
  onAddUser?: () => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  title?: string;
  description?: string;
  columns?: ColumnDef<User>[];
}

export function UserManagement({
  users: propUsers,
  isLoading = false,
  onAddUser,
  onEditUser,
  onDeleteUser,
  title = "Users",
  description = "Manage system users and their roles.",
  columns: propColumns
}: UserManagementProps) {
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const displayUsers = (propUsers && propUsers.length > 0) ? propUsers : MOCK_USERS;

  const uniqueSchools = useMemo(() => {
    const schools = new Set(displayUsers.map(u => u.schoolName).filter(Boolean));
    return Array.from(schools).sort();
  }, [displayUsers]);

  const filteredUsers = useMemo(() => {
    return displayUsers.filter(user => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSchool = schoolFilter === 'all' || user.schoolName === schoolFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive : !user.isActive);
      return matchesRole && matchesSchool && matchesStatus;
    });
  }, [displayUsers, roleFilter, schoolFilter, statusFilter]);

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'school_administrator':
      case 'system_administrator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'manager':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'finance_officer':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'help_desk':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const defaultColumns: ColumnDef<User>[] = [
    {
      header: 'User',
      accessorKey: 'firstName',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
            {user.avatar ? (
              <img className="h-full w-full object-cover" src={user.avatar} alt="" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold text-xs">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-0.5">
              <Mail className="w-3 h-3 mr-1 opacity-70" />
              {user.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
      className: 'text-center',
      cell: (user) => (
        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-xs font-mono text-gray-500">
          <Hash className="w-3 h-3 mr-1 opacity-50" />
          {user.id.split('-').pop()}
        </div>
      )
    },
    {
      header: 'School',
      accessorKey: 'schoolName',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center text-sm text-gray-600">
          <School className="w-4 h-4 mr-2 text-gray-400" />
          {user.schoolName || <span className="text-gray-400 italic">Not Assigned</span>}
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      cell: (user) => (
        <span className={`px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded-full border ${getRoleBadgeStyle(user.role)}`}>
          <Shield className="w-3 h-3 mr-1.5 opacity-70" />
          {formatRole(user.role)}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      sortable: true,
      className: 'text-center',
      cell: (user) => user.isActive ? (
        <div className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs font-medium text-green-700">Active</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-red-400 mr-2"></div>
          <span className="text-xs font-medium text-red-600">Inactive</span>
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (user) => (
        <div className="flex justify-end gap-1">
          {onEditUser && (
            <button
              onClick={() => onEditUser(user)}
              className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-all duration-200"
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDeleteUser && (
            <button
              onClick={() => onDeleteUser(user.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-all duration-200"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filters: FilterDef[] = [
    {
      key: 'role',
      label: 'All Roles',
      value: roleFilter,
      onChange: (val) => setRoleFilter(val as UserRole | 'all'),
      options: [
        { label: 'School Administrator', value: 'school_administrator' },
        { label: 'System Administrator', value: 'system_administrator' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Student', value: 'student' },
        { label: 'Manager', value: 'manager' },
        { label: 'Finance Officer', value: 'finance_officer' },
        { label: 'Help Desk', value: 'help_desk' },
      ]
    },
    {
      key: 'school',
      label: 'All Schools',
      value: schoolFilter,
      onChange: (val) => setSchoolFilter(val),
      options: uniqueSchools.map(s => ({ label: s as string, value: s as string }))
    },
    {
      key: 'status',
      label: 'All Status',
      value: statusFilter,
      onChange: (val) => setStatusFilter(val as 'all' | 'active' | 'inactive'),
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ];

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-600 font-light"
          >
            {description}
          </motion.p>
        </div>
        {onAddUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={onAddUser} className="shrink-0 shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          </motion.div>
        )}
      </div>

      <DataTable
        data={filteredUsers}
        columns={propColumns || defaultColumns}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Search users..."
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalItems: filteredUsers.length,
          itemsPerPage: 10,
          onPageChange: () => { }
        }}
      />
    </div>
  );
}
