import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserManagement, ColumnDef } from '@/components/shared/users/UserManagement';
import { fetchMockStudents, ExtendedUser } from '@/utils/mockData';
import { User } from '@/types/auth'; // Ensure compatibility
import { School, Mail, Hash } from 'lucide-react';

export default function SchoolStudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMockStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns: ColumnDef<ExtendedUser>[] = useMemo(() => [
    {
      header: 'User',
      accessorKey: 'firstName',
      sortable: true,
      cell: (user) => (
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => navigate(`/school-admin/students/${user.id}`)}
        >
          <div className="flex-shrink-0 h-11 w-11 rounded-full p-0.5 bg-gradient-to-tr from-classivo-blue to-classivo-lightblue transition-transform group-hover:scale-105">
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
            <div className="text-sm font-semibold text-gray-900 group-hover:text-classivo-blue transition-colors">
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
      header: 'Class',
      accessorKey: 'studentClass',
      sortable: true,
      cell: (user) => (
        <span className="font-medium text-gray-700">{user.studentClass || 'N/A'}</span>
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
  ], [navigate]);

  const handleAddUser = () => {
    navigate('/school-admin/students/new');
  };

  const handleEditUser = (user: User) => {
    navigate(`/school-admin/students/${user.id}/edit`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(prev => prev.filter(u => u.id !== userId));
    }
  };


  return (
    <UserManagement
      users={students}
      isLoading={loading}
      title="Students"
      description="Manage student records, classes, and enrollment status."
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      columns={columns as ColumnDef<User>[]} // Cast to match prop type which expects User
    />
  );
}
