import { useEffect, useState } from 'react';
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

const API_BASE_URL = import.meta.env.VITE_API_URL;


// Status filter options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export default function TeacherList() {
  const [teachers, setTeachers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/school-admin/teachers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch teachers: ${response.statusText}`);
        }

        const data: BackendUser[] = await response.json();

        const processedData = data.map((user: any) => {
          const emailLocal = (user.email ?? '').split('@')[0] ?? '';
          const derivedFirst = emailLocal ? (emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1)) : '';
          return {
            // Prefer backend-provided names; fallback to derived first name
            ...user,
            id: user.id ?? user._id ?? '',
            userID: user.userID ?? user.userId ?? user.userid ?? '',
            firstName: user.firstName ?? derivedFirst,
            lastName: user.lastName ?? '',
          } as BackendUser;
        });

        setTeachers(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);


  const handleView = (teacher: BackendUser) => {
    navigate(`/school-admin/teachers/${teacher.id}`);
  };

  const handleEdit = (teacher: BackendUser) => {
    navigate(`/school-admin/teachers/${teacher.id}/edit`);
  };

  const handleDelete = async (teacher: BackendUser) => {
    const ok = window.confirm('Are you sure you want to delete this teacher?');
    if (!ok) return;

    const token = getAuthToken();
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/school-admin/users/${teacher.id}` , {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!resp.ok && resp.status !== 204) {
        let msg = `Failed to delete teacher (${resp.status})`;
        try {
          const errData = await resp.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        throw new Error(msg);
      }

      // Remove from UI after successful delete
      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete teacher');
    }
  };

  // Search filter function
  const searchFilter = (teacher: BackendUser, term: string): boolean => {
    const name = fullName(teacher).toLowerCase();
    return (
      name.includes(term) ||
      teacher.userID.toLowerCase().includes(term) ||
      (teacher.email ?? '').toLowerCase().includes(term)
    );
  };

  // Define table columns, adapted for the backend User model
  const columns: Column<BackendUser>[] = [
    {
      key: 'teacher',
      header: 'Teacher',
      width: '30%',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(t)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{fullName(t)}</p>
            <p className="text-xs text-gray-500 font-mono">{t.userID}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      width: '20%',
      render: () => (
        <div>
          <p className="text-sm text-gray-700 truncate">N/A</p>
          <p className="text-xs text-gray-500 truncate">Role info unavailable</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      width: '25%',
      render: (t) => (
        <div>
          <p className="text-xs text-gray-600 truncate">{t.email}</p>
          <p className="text-xs text-gray-500">Phone unavailable</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      align: 'center',
      render: (t) => <StatusBadge status={t.status} type="teacher" />,
    },
  ];

  // Define filters
  const filters: Filter[] = [
    {
      key: 'status',
      label: 'All Status',
      options: STATUS_OPTIONS,
    },
  ];

  if (loading) {
    return <div>Loading teachers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Teachers Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage teacher information, workload, and assignments.
          </p>
        </div>
        <Button type="button" onClick={() => navigate('/school-admin/teachers/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchPlaceholder="Search teachers by name, ID, or email..."
        searchFilter={searchFilter}
        filters={filters}
        entityName="teachers"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleView}
        emptyTitle="No teachers found"
        emptyDescription={error ? `Error: ${error}` : "No teachers match the current filters."}
      />
    </div>
  );
}
