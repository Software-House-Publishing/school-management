import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Teacher, loadTeachers, saveTeachers } from './teacherData';

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

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadTeachers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
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

  const handleView = (id: string) => {
    navigate(`/school-admin/teachers/${id}`);
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
          + Add Teacher
        </Button>
      </div>

      <Card padding="lg" className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search teachers by name, ID, email, or department..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-3 py-2">Teacher</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Employment</th>
                <th className="px-3 py-2">Workload</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/40">
                  {/* Teacher Identity */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white uppercase">
                        {t.firstName[0]}{t.lastName[0]}
                      </div>
                      <div>
                        <p
                          className="font-medium text-slate-900 cursor-pointer hover:underline"
                          onClick={() => handleView(t.id)}
                        >
                          {fullName(t)}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">{t.teacherId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-3">
                    <p className="text-sm text-slate-700">{t.department}</p>
                    <p className="text-xs text-slate-500">{t.employment.role}</p>
                  </td>

                  {/* Employment Type */}
                  <td className="px-3 py-3">
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
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{t.teaching.assignedCourses.length}</p>
                        <p className="text-slate-500">Courses</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{t.teaching.totalSections}</p>
                        <p className="text-slate-500">Sections</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{t.teaching.totalStudents}</p>
                        <p className="text-slate-500">Students</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClasses(
                        t.status
                      )}`}
                    >
                      {statusLabel(t.status)}
                    </span>
                    {t.operations.pendingTasks > 0 && (
                      <p className="mt-1 text-[10px] text-amber-600">
                        {t.operations.pendingTasks} pending tasks
                      </p>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-3">
                    <p className="text-xs text-slate-600 truncate max-w-[150px]">{t.email}</p>
                    <p className="text-xs text-slate-500">{t.phone}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 text-right space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/school-admin/teachers/${t.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
