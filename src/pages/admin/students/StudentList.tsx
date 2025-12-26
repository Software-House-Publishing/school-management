import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DataTable, Column, Filter } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Student, loadStudents, saveStudents } from './studentData';
import { fullName, getInitials } from '@/utils/formatters';
import { Plus } from 'lucide-react';

// Status filter options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const navigate = useNavigate();

  const handleView = (student: Student) => {
    navigate(`/school-admin/students/${student.id}`);
  };

  const handleEdit = (student: Student) => {
    navigate(`/school-admin/students/${student.id}/edit`);
  };

  const handleDelete = (student: Student) => {
    const ok = window.confirm('Are you sure you want to delete this student?');
    if (!ok) return;

    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== student.id);
      saveStudents(updated);
      return updated;
    });
  };

  // Search filter function
  const searchFilter = (student: Student, term: string): boolean => {
    const name = fullName(student).toLowerCase();
    const classLabel = `${student.enrollment.grade}-${student.enrollment.section ?? ''}`.toLowerCase();
    return (
      name.includes(term) ||
      student.studentId.toLowerCase().includes(term) ||
      (student.email ?? '').toLowerCase().includes(term) ||
      classLabel.includes(term)
    );
  };

  // Define table columns
  const columns: Column<Student>[] = [
    {
      key: 'student',
      header: 'Student',
      width: '28%',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            {s.photoUrl ? (
              <img src={s.photoUrl} alt={fullName(s)} className="h-full w-full object-cover" />
            ) : (
              getInitials(s)
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{fullName(s)}</p>
            <p className="text-xs text-gray-500">{s.phone || 'No phone'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'studentId',
      header: 'ID',
      width: '12%',
      render: (s) => <span className="text-xs font-mono text-gray-600">{s.studentId}</span>,
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
        const classLabel = `${s.enrollment.grade}${s.enrollment.section ? `-${s.enrollment.section}` : ''}`;
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
            {classLabel}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      align: 'center',
      render: (s) => <StatusBadge status={s.enrollment.status} type="student" />,
    },
  ];

  // Define filters
  const filters: Filter[] = [
    {
      key: 'enrollment.status',
      label: 'All Status',
      options: STATUS_OPTIONS,
    },
  ];

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
        emptyDescription="Try adjusting your search or filters"
      />
    </div>
  );
}
