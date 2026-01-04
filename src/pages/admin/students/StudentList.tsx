import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DataTable, Column, Filter } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { fullName, getInitials } from '@/utils/formatters';
import { Plus } from 'lucide-react';

// Define the structure of the User object from the backend
export interface BackendUser {
  id: string;
  userID: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  schoolId: string;
  createdAt: string;
  // The backend user doesn't have name fields, so we'll derive from email or use a placeholder
  firstName: string;
  lastName: string;
}

// A simple function to get a token from localStorage
const getAuthToken = (): string | null => {
  const authData = localStorage.getItem('auth-storage');
  if (!authData) return null;
  try {
    const parsed = JSON.parse(authData);
    // The token is nested inside the 'state' property
    return parsed?.state?.token || null;
  } catch (e) {
    console.error("Failed to parse auth data from localStorage", e);
    return null;
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// Status filter options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export default function StudentList() {
  const [students, setStudents] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        // Optional: redirect to login
        // navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/school-admin/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch students: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        // Map backend data to the frontend structure, preferring backend first/last names.
        const processedData = data.map((user: any) => {
          const emailLocal = (user.email ?? '').split('@')[0] ?? '';
          const derivedFirst = emailLocal ? (emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1)) : '';
          const firstName = (user.firstName ?? derivedFirst);
          const lastName = (user.lastName ?? '');
          return {
            // Normalize id/_id to a single id field
            id: user.id ?? user._id ?? '',
            // Normalize userID casing variations (userID, userId, userid)
            userID: user.userID ?? user.userId ?? user.userid ?? '',
            email: user.email ?? '',
            roles: user.roles ?? [],
            status: user.status ?? 'active',
            schoolId: user.schoolId ?? '',
            createdAt: user.createdAt ?? new Date().toISOString(),
            firstName,
            lastName,
          } as BackendUser;
        });


        setStudents(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  const handleView = (student: BackendUser) => {
    // This might need adjustment based on what the detail page expects
    navigate(`/school-admin/students/${student.id}`);
  };

  const handleEdit = (student: BackendUser) => {
    navigate(`/school-admin/students/${student.id}/edit`);
  };

  const handleDelete = async (student: BackendUser) => {
    const ok = window.confirm('Are you sure you want to delete this student?');
    if (!ok) return;

    const token = getAuthToken();
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/school-admin/users/${student.id}` , {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!resp.ok && resp.status !== 204) {
        let msg = `Failed to delete student (${resp.status})`;
        try {
          const errData = await resp.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        throw new Error(msg);
      }

      // Remove from UI after successful delete
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete student');
    }
  };

  // Search filter function
  const searchFilter = (student: BackendUser, term: string): boolean => {
    const name = fullName(student).toLowerCase();
    return (
      name.includes(term) ||
      student.userID.toLowerCase().includes(term) ||
      (student.email ?? '').toLowerCase().includes(term)
    );
  };

  // Define table columns
  const columns: Column<BackendUser>[] = [
    {
      key: 'student',
      header: 'Student',
      width: '28%',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            {/* The backend user has no photoUrl, using initials */}
            {getInitials(s)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{fullName(s)}</p>
            {/* The backend user has no phone, showing email instead */}
            <p className="text-xs text-gray-500">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'studentId',
      header: 'ID',
      width: '12%',
      render: (s) => (
        <span className="text-xs font-mono text-gray-600">
          {s.userID}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: '20%',
      render: (s) => (
        <span className="text-xs text-gray-600 truncate block">{s.email || '-'}</span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      width: '10%',
      align: 'center',
      render: (s) => {
        // The backend user model does not have class/enrollment info.
        // This is a placeholder.
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 text-xs font-medium">
            N/A
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      align: 'center',
      render: (s) => <StatusBadge status={s.status} type="student" />,
    },
  ];

  // Define filters - This needs to be adapted for the new data structure
  const filters: Filter[] = [
    {
      key: 'status',
      label: 'All Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
      ],
    },
  ];

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Students Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage student information and enrollment.
          </p>
        </div>
        <Button type="button" onClick={() => navigate('/school-admin/students/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <DataTable
        data={students}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search students by name, ID, or email..."
        searchFilter={searchFilter}
        filters={filters}
        entityName="students"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleView}
        emptyTitle="No students found"
        emptyDescription={error ? `Error: ${error}` : "No students match the current filters."}
      />
    </div>
  );
}
