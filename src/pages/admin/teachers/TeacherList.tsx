import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DataTable, Column, Filter } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Teacher, loadTeachers, saveTeachers } from './teacherData';
import { fullName, getInitials } from '@/utils/formatters';
import { Plus } from 'lucide-react';

// Status filter options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'resigned', label: 'Resigned' },
];

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadTeachers());
  const navigate = useNavigate();

  // Get unique departments for filter
  const departmentOptions = useMemo(() => {
    const depts = new Set(teachers.map((t) => t.department));
    return Array.from(depts).sort().map((dept) => ({ value: dept, label: dept }));
  }, [teachers]);

  const handleView = (teacher: Teacher) => {
    navigate(`/school-admin/teachers/${teacher.id}`);
  };

  const handleEdit = (teacher: Teacher) => {
    navigate(`/school-admin/teachers/${teacher.id}/edit`);
  };

  const handleDelete = (teacher: Teacher) => {
    const ok = window.confirm('Are you sure you want to delete this teacher?');
    if (!ok) return;

    setTeachers((prev) => {
      const updated = prev.filter((t) => t.id !== teacher.id);
      saveTeachers(updated);
      return updated;
    });
  };

  // Search filter function
  const searchFilter = (teacher: Teacher, term: string): boolean => {
    const name = fullName(teacher).toLowerCase();
    return (
      name.includes(term) ||
      teacher.teacherId.toLowerCase().includes(term) ||
      (teacher.email ?? '').toLowerCase().includes(term) ||
      teacher.department.toLowerCase().includes(term)
    );
  };

  // Define table columns
  const columns: Column<Teacher>[] = [
    {
      key: 'teacher',
      header: 'Teacher',
      width: '22%',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            {t.photoUrl ? (
              <img src={t.photoUrl} alt={fullName(t)} className="h-full w-full object-cover" />
            ) : (
              getInitials(t)
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{fullName(t)}</p>
            <p className="text-xs text-gray-500 font-mono">{t.teacherId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      width: '14%',
      render: (t) => (
        <div>
          <p className="text-sm text-gray-700 truncate">{t.department}</p>
          <p className="text-xs text-gray-500 truncate">{t.employment.role}</p>
        </div>
      ),
    },
    {
      key: 'employment',
      header: 'Employment',
      width: '10%',
      align: 'center',
      render: (t) => <StatusBadge status={t.employment.type} type="employment" />,
    },
    {
      key: 'workload',
      header: 'Workload',
      width: '18%',
      align: 'center',
      render: (t) => (
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.teaching.assignedCourses.length}</p>
            <p className="text-gray-500">Courses</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.teaching.totalSections}</p>
            <p className="text-gray-500">Sections</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{t.teaching.totalStudents}</p>
            <p className="text-gray-500">Students</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      align: 'center',
      render: (t) => (
        <div>
          <StatusBadge status={t.status} type="teacher" />
          {t.operations.pendingTasks > 0 && (
            <p className="mt-1 text-[10px] text-amber-600">
              {t.operations.pendingTasks} pending
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      width: '14%',
      render: (t) => (
        <div>
          <p className="text-xs text-gray-600 truncate">{t.email}</p>
          <p className="text-xs text-gray-500">{t.phone}</p>
        </div>
      ),
    },
  ];

  // Define filters
  const filters: Filter[] = [
    {
      key: 'status',
      label: 'All Status',
      options: STATUS_OPTIONS,
    },
    {
      key: 'department',
      label: 'All Departments',
      options: departmentOptions,
    },
  ];

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
        searchPlaceholder="Search teachers by name, ID, email, or department..."
        searchFilter={searchFilter}
        filters={filters}
        entityName="teachers"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleView}
        emptyTitle="No teachers found"
        emptyDescription="Try adjusting your search or filters"
      />
    </div>
  );
}
