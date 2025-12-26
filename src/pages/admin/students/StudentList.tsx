import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student, loadStudents, saveStudents } from './studentData';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';

function fullName(s: Student) {
  return `${s.firstName} ${s.lastName}`;
}

const ITEMS_PER_PAGE = 10;

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) => {
      const name = fullName(s).toLowerCase();
      const classLabel = `${s.enrollment.grade}-${s.enrollment.section ?? ''}`.toLowerCase();
      const matchesSearch =
        !term ||
        name.includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        (s.email ?? '').toLowerCase().includes(term) ||
        classLabel.includes(term);

      const matchesStatus = statusFilter === 'all' || s.enrollment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleView = (id: string) => {
    navigate(`/school-admin/students/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/school-admin/students/${id}/edit`);
  };

  function handleDelete(id: string) {
    const ok = window.confirm('Are you sure you want to delete this student?');
    if (!ok) return;

    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveStudents(updated);
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

      <Card padding="lg" className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, ID, or email..."
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
            <option value="graduated">Graduated</option>
            <option value="transferred">Transferred</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="w-[28%] px-4 py-3">Student</th>
                <th className="w-[12%] px-3 py-3">ID</th>
                <th className="w-[20%] px-3 py-3">Email</th>
                <th className="w-[10%] px-3 py-3 text-center">Class</th>
                <th className="w-[12%] px-3 py-3 text-center">Status</th>
                <th className="w-[18%] px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedStudents.map((s) => {
                const classLabel = `${s.enrollment.grade}${s.enrollment.section ? `-${s.enrollment.section}` : ''}`;
                const status = s.enrollment.status;

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleView(s.id)}
                  >
                    {/* Student with Photo */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                          {s.photoUrl ? (
                            <img
                              src={s.photoUrl}
                              alt={fullName(s)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <>
                              {s.firstName[0]}
                              {s.lastName[0]}
                            </>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {fullName(s)}
                          </p>
                          <p className="text-xs text-gray-500">{s.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-mono text-gray-600">{s.studentId}</span>
                    </td>

                    {/* Email */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-600 truncate block">
                        {s.email || '-'}
                      </span>
                    </td>

                    {/* Class */}
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        {classLabel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'graduated'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'transferred'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-center">
                      <div
                        className="flex justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleView(s.id)}
                          className="text-violet-500 hover:text-white hover:bg-violet-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(s.id)}
                          className="text-blue-500 hover:text-white hover:bg-blue-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="w-10 h-10 text-gray-300 mb-3" />
                      <p className="font-medium">No students found</p>
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
            of <span className="font-medium text-gray-900">{filtered.length}</span> students
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
