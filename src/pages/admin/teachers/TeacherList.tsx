import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Teacher, loadTeachers, saveTeachers } from './teacherData';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';

function fullName(t: Teacher) {
  return `${t.firstName} ${t.lastName}`;
}

function statusClasses(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'on_leave':
      return 'bg-amber-100 text-amber-800';
    case 'resigned':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'on_leave':
      return 'On Leave';
    case 'resigned':
      return 'Resigned';
    default:
      return status;
  }
}

function employmentTypeLabel(type: string) {
  switch (type) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'visiting':
      return 'Visiting';
    default:
      return type;
  }
}

function employmentTypeClasses(type: string) {
  switch (type) {
    case 'full_time':
      return 'bg-blue-100 text-blue-800';
    case 'part_time':
      return 'bg-purple-100 text-purple-800';
    case 'visiting':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

const ITEMS_PER_PAGE = 10;

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadTeachers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const departments = useMemo(() => {
    const depts = new Set(teachers.map((t) => t.department));
    return Array.from(depts).sort();
  }, [teachers]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return teachers.filter((t) => {
      const name = fullName(t).toLowerCase();
      const matchesSearch =
        !term ||
        name.includes(term) ||
        t.teacherId.toLowerCase().includes(term) ||
        (t.email ?? '').toLowerCase().includes(term) ||
        t.department.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || t.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [teachers, search, statusFilter, departmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTeachers = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departmentFilter]);

  const handleView = (id: string) => {
    navigate(`/school-admin/teachers/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/school-admin/teachers/${id}/edit`);
  };

  function handleDelete(id: string) {
    const ok = window.confirm('Are you sure you want to delete this teacher?');
    if (!ok) return;

    setTeachers((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTeachers(updated);
      return updated;
    });
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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

      <Card padding="lg" className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers by name, ID, email, or department..."
              className="w-full rounded-md border px-3 py-2 pl-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="resigned">Resigned</option>
          </select>
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="w-[22%] px-4 py-3">Teacher</th>
                <th className="w-[14%] px-3 py-3">Department</th>
                <th className="w-[10%] px-3 py-3 text-center">Employment</th>
                <th className="w-[18%] px-3 py-3 text-center">Workload</th>
                <th className="w-[10%] px-3 py-3 text-center">Status</th>
                <th className="w-[14%] px-3 py-3">Contact</th>
                <th className="w-[12%] px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedTeachers.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleView(t.id)}
                >
                  {/* Teacher Identity */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                        {t.photoUrl ? (
                          <img
                            src={t.photoUrl}
                            alt={fullName(t)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            {t.firstName[0]}
                            {t.lastName[0]}
                          </>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {fullName(t)}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{t.teacherId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-3">
                    <p className="text-sm text-gray-700 truncate">{t.department}</p>
                    <p className="text-xs text-gray-500 truncate">{t.employment.role}</p>
                  </td>

                  {/* Employment Type */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${employmentTypeClasses(
                        t.employment.type
                      )}`}
                    >
                      {employmentTypeLabel(t.employment.type)}
                    </span>
                  </td>

                  {/* Workload Snapshot */}
                  <td className="px-3 py-3">
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
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClasses(
                        t.status
                      )}`}
                    >
                      {statusLabel(t.status)}
                    </span>
                    {t.operations.pendingTasks > 0 && (
                      <p className="mt-1 text-[10px] text-amber-600">
                        {t.operations.pendingTasks} pending
                      </p>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-3">
                    <p className="text-xs text-gray-600 truncate">{t.email}</p>
                    <p className="text-xs text-gray-500">{t.phone}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 text-center">
                    <div
                      className="flex justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleView(t.id)}
                        className="text-violet-500 hover:text-white hover:bg-violet-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(t.id)}
                        className="text-blue-500 hover:text-white hover:bg-blue-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                        title="Edit Teacher"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedTeachers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="w-10 h-10 text-gray-300 mb-3" />
                      <p className="font-medium">No teachers found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-900">
              {filtered.length > 0 ? startIndex + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-900">
              {Math.min(endIndex, filtered.length)}
            </span>{' '}
            of <span className="font-medium text-gray-900">{filtered.length}</span> teachers
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
