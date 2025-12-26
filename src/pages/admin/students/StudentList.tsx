import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student, loadStudents, saveStudents} from './studentData';

function fullName(s: Student) {
  return `${s.firstName} ${s.lastName}`;
}

export default function StudentList() {
  // load from localStorage or mock data
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return students;
    return students.filter((s) => {
      const name = fullName(s).toLowerCase();
      const classLabel = `${s.enrollment.grade}-${s.enrollment.section ?? ''}`.toLowerCase();
      return (
        name.includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        (s.email ?? '').toLowerCase().includes(term) ||
        classLabel.includes(term)
      );
    });
  }, [students, search]);

  const handleView = (id: string) => {
    navigate(`/school-admin/students/${id}`);
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
          + Add Student
        </Button>
      </div>

      <Card padding="lg" className="space-y-4">
        <input
          type="text"
          placeholder="Search students by name or ID..."
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Class</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const classLabel = `${s.enrollment.grade}-${s.enrollment.section ?? ''}`;
                const status = s.enrollment.status;

                return (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-2 text-xs font-mono">{s.studentId}</td>
                    <td
                      className="px-3 py-2 cursor-pointer text-sm font-medium hover:underline"
                      onClick={() => handleView(s.id)}
                    >
                      {fullName(s)}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {s.email || '-'}
                    </td>
                    <td className="px-3 py-2 text-xs">{classLabel}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
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
                    <td className="px-3 py-2 text-right space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/school-admin/students/${s.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </Button>

                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                  >
                    No students found.
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
