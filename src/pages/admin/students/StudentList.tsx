import React, { useMemo, useState, FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type StudentStatus = 'active' | 'inactive';

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  status: StudentStatus;
  phone?: string;
  address?: string;
  notes?: string;
}

const initialStudents: Student[] = [
  {
    id: 'STU001',
    name: 'Alice Johnson',
    email: 'alice@school.com',
    className: '10-A',
    status: 'active',
    phone: '+111111111',
    address: '123 Main St',
    notes: 'Prefers morning classes. Good at math.'
  },
  {
    id: 'STU002',
    name: 'Bob Smith',
    email: 'bob@school.com',
    className: '10-B',
    status: 'active',
    notes: 'Transferred from another school last term.'
  },
  {
    id: 'STU003',
    name: 'Carol White',
    email: 'carol@school.com',
    className: '10-A',
    status: 'active'
  },
  {
    id: 'STU004',
    name: 'David Brown',
    email: 'david@school.com',
    className: '11-A',
    status: 'inactive',
    notes: 'On leave for this semester.'
  },
  {
    id: 'STU005',
    name: 'Emma Davis',
    email: 'emma@school.com',
    className: '10-C',
    status: 'active'
  },
];

const emptyForm = {
  name: '',
  id: '',
  email: '',
  className: '',
  phone: '',
  address: '',
  notes: '',
};

const classes = ['10-A', '10-B', '10-C', '11-A', '11-B'];

type ModalMode = 'add' | 'edit' | 'view';

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredStudents = useMemo(
    () =>
      students.filter((s) => {
        const term = searchTerm.toLowerCase();
        return (
          s.id.toLowerCase().includes(term) ||
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
        );
      }),
    [students, searchTerm]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const openEditModal = (student: Student) => {
    setMode('edit');
    setEditingId(student.id);
    setForm({
      name: student.name,
      id: student.id,
      email: student.email,
      className: student.className,
      phone: student.phone || '',
      address: student.address || '',
      notes: student.notes || '',
    });
    setIsModalOpen(true);
  };

  const openViewModal = (student: Student) => {
    setMode('view');
    setEditingId(student.id);
    setForm({
      name: student.name,
      id: student.id,
      email: student.email,
      className: student.className,
      phone: student.phone || '',
      address: student.address || '',
      notes: student.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMode('add');
  };

  const handleSubmitStudent = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.id || !form.email || !form.className) return;

    const baseData: Student = {
      id: form.id,
      name: form.name,
      email: form.email,
      className: form.className,
      phone: form.phone || undefined,
      address: form.address || undefined,
      notes: form.notes || undefined,
      status: 'active', 
    };

    if (mode === 'add') {
      setStudents((prev) => [...prev, baseData]);
    } else if (mode === 'edit' && editingId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                ...baseData,
                status: s.status, // keep existing status
              }
            : s
        )
      );
    }

    closeModal();
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const readOnly = mode === 'view';

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
        <p className="mt-2 text-gray-600">
          Manage student information and enrollment.
        </p>
      </div>


      <Card className="space-y-4 p-6">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search students by name or ID..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button className="whitespace-nowrap px-5" onClick={openAddModal}>
            + Add Student
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Class</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-gray-700">{student.id}</td>

                  <td
                    className="py-3 pr-4 text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openViewModal(student)}
                  >
                    {student.name}
                  </td>

                  <td className="py-3 pr-4 text-gray-600">{student.email}</td>
                  <td className="py-3 pr-4 text-gray-700">
                    {student.className}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(student)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No students found. Try a different search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    {isModalOpen && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
            <div>
            <h2 className="text-lg font-semibold text-gray-900">
                {mode === 'add'
                ? 'Add New Student'
                : mode === 'edit'
                ? 'Edit Student'
                : 'Student Details'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
                {mode === 'add'
                ? 'Fill in the student details below to add a new student to the system.'
                : mode === 'edit'
                ? 'Update the student details below.'
                : 'View full information for this student.'}
            </p>
            </div>
        </div>

        <form onSubmit={handleSubmitStudent} className="space-y-4">
            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Student Name
            </label>
            <input
                type="text"
                name="name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                placeholder="e.g., John Doe"
                value={form.name}
                onChange={handleChange}
                disabled={readOnly}
                required
            />
            </div>

            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Student ID
            </label>
            <input
                type="text"
                name="id"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                placeholder="e.g., STU006"
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
                placeholder="e.g., john@school.com"
                value={form.email}
                onChange={handleChange}
                disabled={readOnly}
                required
            />
            </div>

            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Class
            </label>
            <select
                name="className"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                value={form.className}
                onChange={handleChange}
                disabled={readOnly}
                required
            >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                <option key={cls} value={cls}>
                    {cls}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone (Optional)
            </label>
            <input
                type="tel"
                name="phone"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                placeholder="e.g., +1234567890"
                value={form.phone}
                onChange={handleChange}
                disabled={readOnly}
            />
            </div>

            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Address (Optional)
            </label>
            <input
                type="text"
                name="address"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                placeholder="e.g., 123 Main St"
                value={form.address}
                onChange={handleChange}
                disabled={readOnly}
            />
            </div>

            <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes (Optional)
            </label>
            <textarea
                name="notes"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                placeholder="Any additional notes about this student (behavior, strengths, etc.)"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                disabled={readOnly}
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
                    {mode === 'add' ? 'Add Student' : 'Save Changes'}
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
