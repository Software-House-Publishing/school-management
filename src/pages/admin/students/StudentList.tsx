import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student } from './studentData';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

function fullName(s: Student) {
  return `${s.firstName} ${s.lastName}`;
}

export default function StudentList() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👉 Load students from backend
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/students`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load students');
        }

        setStudents(data.students || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchStudents();
    }
  }, [token]);

  // 👉 Search filter (by name or studentId)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const name = fullName(s).toLowerCase();
      const id = (s.studentId || '').toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [students, search]);

  // 👉 View details
  const handleView = (id: string) => {
    navigate(`/school-admin/students/${id}`);
  };

  // 👉 Delete student
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete student');
      }

      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  // ---------- UI ----------
  if (!token) {
    return <p className="text-sm text-red-600">You must be logged in to view students.</p>;
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Loading students…</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <Button type="button" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
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
        {loading && (
          <p className="text-sm text-muted-foreground">Loading students...</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

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
                const classLabel = `${s.enrollment?.grade ?? ''}-${s.enrollment?.section ?? ''}`;
                const status = s.enrollment?.status ?? 'active';

                return (
                  <tr
                    key={s.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-3 py-2 text-xs font-mono">
                      {s.studentId}
                    </td>
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

              {filtered.length === 0 && !loading && (
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
