import { useState, useEffect, useMemo } from 'react';
import { UserManagement, ColumnDef } from '@/components/shared/users/UserManagement';
import { fetchMockTeachers, ExtendedUser } from '@/utils/mockData';
import { User } from '@/types/auth';
import { School, Mail, Hash, BookOpen } from 'lucide-react';

export default function SchoolTeacherList() {
  const [teachers, setTeachers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMockTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns: ColumnDef<ExtendedUser>[] = useMemo(() => [
    {
      header: 'Teacher',
      accessorKey: 'firstName',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-11 w-11 rounded-full p-0.5 bg-gradient-to-tr from-classivo-blue to-classivo-lightblue">
            <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white">
              {user.avatar ? (
                <img className="h-full w-full object-cover" src={user.avatar} alt="" />
              ) : (
                <div className="h-full w-full bg-classivo-cream flex items-center justify-center text-classivo-blue font-bold text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
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
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100/50 text-xs font-mono text-gray-500">
          <Hash className="w-3 h-3 mr-1 opacity-50" />
          {user.id.split('-').pop()}
        </div>
      )
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700">{user.subject || 'General'}</span>
        </div>
      )
    },
    {
      header: 'Courses',
      accessorKey: 'coursesCount',
      sortable: true,
      className: 'text-center',
      cell: (user) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {user.coursesCount || 0}
        </span>
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
      header: 'Status',
      accessorKey: 'isActive',
      sortable: true,
      className: 'text-center',
      cell: (user) => (
        user.isActive ? (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs font-medium text-green-700">Active</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div>
            <span className="text-xs font-medium text-red-600">Inactive</span>
          </div>
        )
      )
    }
  ], []);

  const handleAddUser = () => {
    alert("Add Teacher functionality to be implemented");
  };

  const handleEditUser = (user: User) => {
    alert(`Edit Teacher: ${user.firstName}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(prev => prev.filter(u => u.id !== userId));
    }
  };


  return (
    <UserManagement
      users={teachers}
      isLoading={loading}
      title="Teachers"
      description="Manage faculty, assign subjects and track course loads."
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      columns={columns as ColumnDef<User>[]}
    />
  );
}
