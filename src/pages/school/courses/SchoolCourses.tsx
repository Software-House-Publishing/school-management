import React, { useMemo, useState, FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Course {
  id: string;
  code: string;
  title: string;
  lecturer: string;
  timeRange: string;     // e.g. "09:00 – 10:30"
  days: string[];        // e.g. ["Wed", "Fri"]
  studentsCount: number; // total students
  imageUrl: string;      // course image
}

const initialCourses: Course[] = [
  {
    id: '1',
    code: 'MATH101',
    title: 'Mathematics I',
    lecturer: 'Mr. Smith',
    timeRange: '09:00 – 10:30',
    days: ['Mon', 'Wed'],
    studentsCount: 45,
    imageUrl:
      'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    code: 'ENG101',
    title: 'English I',
    lecturer: 'Ms. Johnson',
    timeRange: '10:45 – 12:15',
    days: ['Tue', 'Thu'],
    studentsCount: 42,
    imageUrl:
      'https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    code: 'SCI101',
    title: 'Science I',
    lecturer: 'Dr. Brown',
    timeRange: '13:00 – 14:30',
    days: ['Wed', 'Fri'],
    studentsCount: 40,
    imageUrl:
      'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    code: 'HIS101',
    title: 'History I',
    lecturer: 'Mr. Wilson',
    timeRange: '08:00 – 09:30',
    days: ['Tue'],
    studentsCount: 38,
    imageUrl:
      'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    code: 'COMP101',
    title: 'Computer Science I',
    lecturer: 'Mr. Davis',
    timeRange: '14:45 – 16:15',
    days: ['Mon', 'Thu'],
    studentsCount: 35,
    imageUrl:
      'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const emptyForm = {
  code: '',
  title: '',
  lecturer: '',
  timeRange: '',
  days: '',
  studentsCount: '',
  imageUrl: '',
};

type ModalMode = 'add' | 'edit' | 'view';

export default function SchoolCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) => {
        const term = searchTerm.toLowerCase();
        return (
          c.title.toLowerCase().includes(term) ||
          c.code.toLowerCase().includes(term) ||
          c.lecturer.toLowerCase().includes(term)
        );
      }),
    [courses, searchTerm]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const openEditModal = (course: Course) => {
    setMode('edit');
    setEditingId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      lecturer: course.lecturer,
      timeRange: course.timeRange,
      days: course.days.join(', '),
      studentsCount: String(course.studentsCount),
      imageUrl: course.imageUrl,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (course: Course) => {
    setMode('view');
    setEditingId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      lecturer: course.lecturer,
      timeRange: course.timeRange,
      days: course.days.join(', '),
      studentsCount: String(course.studentsCount),
      imageUrl: course.imageUrl,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMode('add');
  };

  const handleSubmitCourse = (e: FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.title || !form.lecturer || !form.timeRange) return;

    const days = form.days
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const baseData = {
      code: form.code,
      title: form.title,
      lecturer: form.lecturer,
      timeRange: form.timeRange,
      days,
      studentsCount: Number(form.studentsCount) || 0,
      imageUrl:
        form.imageUrl ||
        'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    if (mode === 'add') {
      const newCourse: Course = {
        id: `${Date.now()}`,
        ...baseData,
      };
      setCourses((prev) => [...prev, newCourse]);
    } else if (mode === 'edit' && editingId) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...baseData } : c))
      );
    }

    closeModal();
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const readOnly = mode === 'view';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <p className="mt-2 text-gray-600">Create and manage school courses.</p>
      </div>

      {/* Main card */}
      <Card className="space-y-4 p-6">
        {/* Top row: search + add button */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button className="whitespace-nowrap px-5" onClick={openAddModal}>
            + Add Course
          </Button>
        </div>

        {/* Courses grid */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-colors transform"
            >
              {/* image + title section */}
              <div className="flex gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base font-semibold text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openViewModal(course)}
                  >
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
              </div>

              {/* details */}
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Lecturer: </span>
                  {course.lecturer}
                </p>
                <p>
                  <span className="font-medium">Time: </span>
                  {course.timeRange}
                </p>
                <p className="flex flex-wrap items-center gap-1">
                  <span className="mr-1 font-medium">Days:</span>
                  {course.days.map((day) => (
                    <span
                      key={day}
                      className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {day}
                    </span>
                  ))}
                  {course.days.length === 0 && (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Students: </span>
                  {course.studentsCount}
                </p>
              </div>

              {/* actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditModal(course)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-gray-500">
              No courses found. Try a different search term.
            </p>
          )}
        </div>
      </Card>

      {/* Modal: Add / Edit / View course */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {mode === 'add'
                    ? 'Add New Course'
                    : mode === 'edit'
                      ? 'Edit Course'
                      : 'Course Details'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {mode === 'add'
                    ? 'Fill in the details below to create a new course.'
                    : mode === 'edit'
                      ? 'Update the course details below.'
                      : 'View full information for this course.'}
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

            <form onSubmit={handleSubmitCourse} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="e.g., Mathematics I"
                    value={form.title}
                    onChange={handleChange}
                    disabled={readOnly}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Course Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="e.g., MATH101"
                    value={form.code}
                    onChange={handleChange}
                    disabled={readOnly}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lecturer
                </label>
                <input
                  type="text"
                  name="lecturer"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                  placeholder="e.g., Mr. Smith"
                  value={form.lecturer}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Time Range
                  </label>
                  <input
                    type="text"
                    name="timeRange"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="e.g., 09:00 – 10:30"
                    value={form.timeRange}
                    onChange={handleChange}
                    disabled={readOnly}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Days (comma separated)
                  </label>
                  <input
                    type="text"
                    name="days"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="e.g., Mon, Wed, Fri"
                    value={form.days}
                    onChange={handleChange}
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Total Students
                  </label>
                  <input
                    type="number"
                    name="studentsCount"
                    min={0}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="e.g., 40"
                    value={form.studentsCount}
                    onChange={handleChange}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={handleChange}
                    disabled={readOnly}
                  />
                </div>
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
                      {mode === 'add' ? 'Add Course' : 'Save Changes'}
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
