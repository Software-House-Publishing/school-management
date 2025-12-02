import React, { useMemo, useState, FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  coursesCount: number;
}

const initialTeachers: Teacher[] = [
  { id: 'TEACH001', name: 'Mr. Smith',   email: 'smith@school.com',   subject: 'Mathematics',  coursesCount: 3 },
  { id: 'TEACH002', name: 'Ms. Johnson', email: 'johnson@school.com', subject: 'English',      coursesCount: 2 },
  { id: 'TEACH003', name: 'Dr. Brown',   email: 'brown@school.com',   subject: 'Science',      coursesCount: 4 },
  { id: 'TEACH004', name: 'Mr. Wilson',  email: 'wilson@school.com',  subject: 'History',      coursesCount: 2 },
];

const emptyForm = {
  name: '',
  id: '',
  email: '',
  subject: '',
  coursesCount: '',
};

const subjects = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Computer Science',
];

type ModalMode = 'add' | 'edit' | 'view';

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredTeachers = useMemo(
    () =>
      teachers.filter((t) => {
        const term = searchTerm.toLowerCase();
        return (
          t.id.toLowerCase().includes(term) ||
          t.name.toLowerCase().includes(term) ||
          t.email.toLowerCase().includes(term) ||
          t.subject.toLowerCase().includes(term)
        );
      }),
    [teachers, searchTerm]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setMode('add');
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setMode('edit');
    setEditingId(teacher.id);
    setForm({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      coursesCount: String(teacher.coursesCount),
    });
    setIsModalOpen(true);
  };

  const openViewModal = (teacher: Teacher) => {
    setMode('view');
    setEditingId(teacher.id);
    setForm({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      coursesCount: String(teacher.coursesCount),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMode('add');
  };

  const handleSubmitTeacher = (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.id || !form.email || !form.subject || !form.coursesCount) {
      return;
    }

    const baseData: Teacher = {
      id: form.id,
      name: form.name,
      email: form.email,
      subject: form.subject,
      coursesCount: Number(form.coursesCount) || 0,
    };

    if (mode === 'add') {
      setTeachers((prev) => [...prev, baseData]);
    } else if (mode === 'edit' && editingId) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...baseData } : t))
      );
    }

    closeModal();
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const readOnly = mode === 'view';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
        <p className="mt-2 text-gray-600">
          Manage teacher information, subjects and course assignments.
        </p>
      </div>

      {/* Main card */}
      <Card className="space-y-4 p-6">
        {/* Top row: search + button */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button className="whitespace-nowrap px-5" onClick={openAddModal}>
            + Add Teacher
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Subject</th>
                <th className="py-3 pr-4">Courses</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-gray-700">{teacher.id}</td>

                  {/* clickable name, opens details modal */}
                  <td
                    className="py-3 pr-4 text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openViewModal(teacher)}
                  >
                    {teacher.name}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">{teacher.email}</td>
                  <td className="py-3 pr-4 text-gray-700">{teacher.subject}</td>
                  <td className="py-3 pr-4 text-gray-700">
                    {teacher.coursesCount}
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No teachers found. Try a different search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add / Edit / View teacher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {mode === 'add'
                    ? 'Add New Teacher'
                    : mode === 'edit'
                    ? 'Edit Teacher'
                    : 'Teacher Details'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {mode === 'add'
                    ? 'Fill in the teacher details below to add a new teacher.'
                    : mode === 'edit'
                    ? 'Update the teacher details below.'
                    : 'View full information for this teacher.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTeacher} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Teacher Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  placeholder="e.g., Mr. Smith"
                  value={form.name}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Teacher ID
                </label>
                <input
                  type="text"
                  name="id"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  placeholder="e.g., TEACH005"
                  value={form.id}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  placeholder="e.g., smith@school.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  name="subject"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  value={form.subject}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Number of Courses
                </label>
                <input
                  type="number"
                  name="coursesCount"
                  min={0}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  placeholder="e.g., 3"
                  value={form.coursesCount}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {mode === 'view' ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                    >
                      Close
                    </Button>
                    
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {mode === 'add' ? 'Add Teacher' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
