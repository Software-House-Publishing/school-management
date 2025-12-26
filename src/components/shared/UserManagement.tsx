import { useState, useMemo } from 'react';
import { User, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Filter,
  MoreVertical,
  School,
  Hash,
  Shield,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data for Development ---
const MOCK_USERS: User[] = [
  {
    id: 'USR-2024-001',
    firstName: 'Eleanor',
    lastName: 'Rigby',
    email: 'eleanor.rigby@classivo.edu',
    role: 'school_administrator',
    schoolName: 'St. Mary’s High School',
    isActive: true,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-01T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
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
    avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
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

interface UserManagementProps {
  users?: User[]; // Made optional to support mock data fallback
  isLoading?: boolean;
  onAddUser?: () => void;
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  title?: string;
  description?: string;
}

type SortField = 'user' | 'id' | 'school' | 'role' | 'status';
type SortDirection = 'asc' | 'desc';

export function UserManagement({
  users: propUsers,
  isLoading = false,
  onAddUser,
  onViewUser,
  onEditUser,
  onDeleteUser,
  title = "Users",
  description = "Manage system users and their roles."
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Use mock data if no users provided
  const displayUsers = (propUsers && propUsers.length > 0) ? propUsers : MOCK_USERS;

  // Extract unique schools for filter dropdown
  const uniqueSchools = useMemo(() => {
    const schools = new Set(displayUsers.map(u => u.schoolName).filter(Boolean));
    return Array.from(schools).sort();
  }, [displayUsers]);

  const filteredAndSortedUsers = useMemo(() => {
    // 1. Filter
    const result = displayUsers.filter(user => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.schoolName && user.schoolName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSchool = schoolFilter === 'all' || user.schoolName === schoolFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? user.isActive : !user.isActive);

      return matchesSearch && matchesRole && matchesSchool && matchesStatus;
    });

    // 2. Sort
    if (sortField) {
      result.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (sortField) {
          case 'user':
            aValue = `${a.firstName} ${a.lastName}`;
            bValue = `${b.firstName} ${b.lastName}`;
            break;
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          case 'school':
            aValue = a.schoolName || '';
            bValue = b.schoolName || '';
            break;
          case 'role':
            aValue = a.role;
            bValue = b.role;
            break;
          case 'status':
            // active first if asc
            aValue = a.isActive ? 1 : 0;
            bValue = b.isActive ? 1 : 0;
            break;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [displayUsers, searchTerm, roleFilter, schoolFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 opacity-50" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 ml-1 text-classivo-blue" />
      : <ArrowDown className="w-4 h-4 ml-1 text-classivo-blue" />;
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'school_administrator':
      case 'system_administrator':
        return 'bg-purple-100/50 text-purple-700 border-purple-200';
      case 'teacher':
        return 'bg-blue-100/50 text-blue-700 border-blue-200';
      case 'student':
        return 'bg-green-100/50 text-green-700 border-green-200';
      case 'manager':
        return 'bg-orange-100/50 text-orange-700 border-orange-200';
      case 'finance_officer':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-200';
      case 'help_desk':
        return 'bg-indigo-100/50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-classivo-black to-classivo-blue"
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
            <Button onClick={onAddUser} className="shrink-0 shadow-lg shadow-classivo-blue/20">
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          </motion.div>
        )}
      </div>

      {/* Glass Control Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-2xl p-4 flex flex-col xl:flex-row gap-4 justify-between items-center"
      >
        <div className="relative w-full xl:w-96 group shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-classivo-blue transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2.5 bg-white/50 border border-white/60 rounded-xl leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-classivo-blue/30 focus:bg-white/80 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto overflow-x-auto pb-1 md:pb-0">

          {/* Status Filter */}
          <div className="relative min-w-[140px] flex-1">
            <select
              className="appearance-none block w-full pl-3 pr-10 py-2.5 bg-white/50 border border-white/60 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-classivo-blue/30 focus:bg-white/80 transition-all duration-300 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ArrowDown className="h-3 w-3 text-gray-500" />
            </div>
          </div>

          {/* School Filter */}
          <div className="relative min-w-[200px] flex-1">
            <select
              className="appearance-none block w-full pl-3 pr-10 py-2.5 bg-white/50 border border-white/60 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-classivo-blue/30 focus:bg-white/80 transition-all duration-300 cursor-pointer"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
            >
              <option value="all">All Schools</option>
              {uniqueSchools.map(school => (
                <option key={school} value={school as string}>{school}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <School className="h-3 w-3 text-gray-500" />
            </div>
          </div>

          {/* Role Filter */}
          <div className="relative min-w-[200px] flex-1">
            <select
              className="appearance-none block w-full pl-3 pr-10 py-2.5 bg-white/50 border border-white/60 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-classivo-blue/30 focus:bg-white/80 transition-all duration-300 cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            >
              <option value="all">All Roles</option>
              <option value="school_administrator">School Administrator</option>
              <option value="system_administrator">System Administrator</option>
              <option value="manager">Manager</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="finance_officer">Finance Officer</option>
              <option value="help_desk">Help Desk</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="h-3 w-3 text-gray-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Glass Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-3xl overflow-hidden border border-white/40 shadow-xl shadow-classivo-blue/5"
      >
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-white/40 border-b border-white/30">
              <th
                className="w-[26%] px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors select-none"
                onClick={() => handleSort('user')}
              >
                <div className="flex items-center">
                  User <SortIcon field="user" />
                </div>
              </th>
              <th
                className="w-[8%] px-2 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors select-none"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center justify-center">
                  ID <SortIcon field="id" />
                </div>
              </th>
              <th
                className="w-[20%] px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors select-none"
                onClick={() => handleSort('school')}
              >
                <div className="flex items-center">
                  School <SortIcon field="school" />
                </div>
              </th>
              <th
                className="w-[18%] px-3 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors select-none"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center justify-center">
                  Role <SortIcon field="role" />
                </div>
              </th>
              <th
                className="w-[12%] px-2 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center">
                  Status <SortIcon field="status" />
                </div>
              </th>
              <th className="w-[16%] px-3 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  <div className="flex flex-col justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-classivo-blue"></div>
                    <span className="mt-2 text-sm">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">No users found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filteredAndSortedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group hover:bg-white/40 transition-colors duration-200 ${onViewUser ? 'cursor-pointer' : ''}`}
                    onClick={() => onViewUser?.(user)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full p-0.5 bg-gradient-to-tr from-classivo-blue to-classivo-lightblue">
                          <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white">
                            {user.avatar ? (
                              <img className="h-full w-full object-cover" src={user.avatar} alt="" />
                            ) : (
                              <div className="h-full w-full bg-classivo-cream flex items-center justify-center text-classivo-blue font-bold text-xs">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-classivo-blue transition-colors truncate">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5 truncate">
                            <Mail className="w-3 h-3 mr-1 opacity-70 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 border border-gray-100/50 text-xs font-mono text-gray-500">
                        <Hash className="w-3 h-3 mr-0.5 opacity-50" />
                        {user.id.split('-').pop()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-600 min-w-0">
                        <School className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{user.schoolName || <span className="text-gray-400 italic">Not Assigned</span>}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2 py-1 inline-flex items-center text-xs font-medium rounded-full border ${getRoleBadgeStyle(user.role)}`}>
                        <Shield className="w-3 h-3 mr-1 opacity-70" />
                        <span className="truncate">{formatRole(user.role)}</span>
                      </span>
                    </td>
                    <td className="px-2 py-4 text-center">
                      {user.isActive ? (
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></div>
                          <span className="text-xs font-medium text-green-700">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-red-400 mr-1.5"></div>
                          <span className="text-xs font-medium text-red-600">Inactive</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center text-sm font-medium">
                      <div className="flex justify-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        {onViewUser && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewUser(user); }}
                            className="text-violet-500 hover:text-white hover:bg-violet-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEditUser && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onEditUser(user); }}
                            className="text-classivo-blue hover:text-white hover:bg-classivo-blue p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteUser && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }}
                            className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
        <div className="bg-white/30 px-6 py-4 border-t border-white/20 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredAndSortedUsers.length}</span> of <span className="font-medium text-gray-900">{displayUsers.length}</span> users
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="opacity-50">Previous</Button>
            <Button variant="outline" size="sm" disabled className="opacity-50">Next</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
