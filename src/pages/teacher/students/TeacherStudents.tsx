import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Users,
  Search,
  Mail,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Filter,
  ChevronRight,
  BookOpen,
  X,
  ArrowLeft,
  Phone,
  FileText,
  Plus,
  Clock,
  MessageSquare,
  Trash2,
  Shield,
} from 'lucide-react';
import {
  teacherCourses,
  CourseStudent,
  getGradeColor,
  getCourseColor,
  formatDate,
} from '../data/teacherPortalData';
import { loadStudents, Student } from '@/pages/admin/students/studentData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Aggregate all students from all courses with course info
interface AggregatedStudent extends CourseStudent {
  courses: { code: string; name: string; section: string; color: string }[];
}

// Teacher notes interface
interface TeacherNote {
  id: string;
  studentId: string;
  content: string;
  category: 'academic' | 'behavior' | 'attendance' | 'general';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Mock teacher notes (in real app, this would come from backend)
const mockTeacherNotes: TeacherNote[] = [
  {
    id: 'note-1',
    studentId: 'STU-2024-001000',
    content: 'Showing significant improvement in calculus problem-solving. Consider recommending for advanced placement.',
    category: 'academic',
    priority: 'medium',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'note-2',
    studentId: 'STU-2024-001000',
    content: 'Frequently helps other students during group work. Great leadership potential.',
    category: 'behavior',
    priority: 'low',
    createdAt: '2024-03-10T14:20:00Z',
    updatedAt: '2024-03-10T14:20:00Z',
  },
  {
    id: 'note-3',
    studentId: 'STU-2024-001001',
    content: 'Has been arriving late to class. Spoke with student - family transportation issues. Monitor situation.',
    category: 'attendance',
    priority: 'high',
    createdAt: '2024-03-18T09:00:00Z',
    updatedAt: '2024-03-18T09:00:00Z',
  },
];

function aggregateStudents(): AggregatedStudent[] {
  const studentMap = new Map<string, AggregatedStudent>();

  teacherCourses.forEach((course) => {
    course.students.forEach((student) => {
      const existing = studentMap.get(student.studentId);
      if (existing) {
        existing.courses.push({
          code: course.courseCode,
          name: course.courseName,
          section: course.section,
          color: course.color,
        });
      } else {
        studentMap.set(student.studentId, {
          ...student,
          courses: [{
            code: course.courseCode,
            name: course.courseName,
            section: course.section,
            color: course.color,
          }],
        });
      }
    });
  });

  return Array.from(studentMap.values());
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADD NOTE MODAL
───────────────────────────────────────────────────────────────────────────── */
function AddNoteModal({
  studentId,
  onClose,
  onSave,
}: {
  studentId: string;
  onClose: () => void;
  onSave: (note: Omit<TeacherNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TeacherNote['category']>('general');
  const [priority, setPriority] = useState<TeacherNote['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ studentId, content, category, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Add Note</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(['academic', 'behavior', 'attendance', 'general'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                      category === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                      priority === p
                        ? p === 'high' ? 'bg-red-600 text-white' :
                          p === 'medium' ? 'bg-amber-500 text-white' :
                          'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your note about this student..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Note
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT FULL DETAIL VIEW (Page-like view with notes)
───────────────────────────────────────────────────────────────────────────── */
function StudentDetailView({
  student,
  onBack,
}: {
  student: AggregatedStudent;
  onBack: () => void;
}) {
  const [notes, setNotes] = useState<TeacherNote[]>(
    mockTeacherNotes.filter(n => n.studentId === student.studentId)
  );
  const [showAddNote, setShowAddNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'attendance' | 'notes'>('overview');

  // Load full student data from admin student records for additional info
  const fullStudentData = useMemo(() => {
    const allStudents = loadStudents();
    // Try to find by matching first name and last name
    return allStudents.find(
      (s) => s.firstName === student.firstName && s.lastName === student.lastName
    ) || null;
  }, [student.firstName, student.lastName]);

  const handleAddNote = (noteData: Omit<TeacherNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: TeacherNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== noteId));
    }
  };

  const getCategoryColor = (category: TeacherNote['category']) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'behavior': return 'bg-purple-100 text-purple-700';
      case 'attendance': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: TeacherNote['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Students</span>
      </button>

      {/* Hero Card */}
      <Card className="rounded-2xl overflow-hidden border shadow-sm">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-blue-100 text-sm">{student.studentId}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Enrolled in {student.courses.length} of your courses
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                student.status === 'active' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-red-500/20 text-red-100'
              )}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Attendance</span>
            </div>
            <div className={cn(
              'text-2xl font-bold',
              student.attendancePercentage >= 80 ? 'text-emerald-600' :
              student.attendancePercentage >= 60 ? 'text-amber-600' : 'text-red-600'
            )}>
              {student.attendancePercentage}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs">Current Grade</span>
            </div>
            <div className={cn('text-2xl font-bold', getGradeColor(student.currentGrade))}>
              {student.currentGrade}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Your Courses</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {student.courses.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Notes</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {notes.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-1 p-2">
            {(['overview', 'grades', 'attendance', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* Personal & Contact */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Personal & Contact</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Date of Birth
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.dateOfBirth || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Gender
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.gender || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Phone
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.phone || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Email
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {student.email || fullStudentData?.email || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Languages
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.language || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Address
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.address || '—'}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Parents / Guardians */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Parents / Guardians</h2>
                  <div className="mt-3 space-y-2 text-sm">
                    {fullStudentData?.guardians && fullStudentData.guardians.length > 0 ? (
                      fullStudentData.guardians.map((g, idx) => (
                        <div
                          key={idx}
                          className="rounded-md border bg-white px-3 py-2 text-xs md:text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium">
                              {g.name}{' '}
                              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                • {g.relationship}
                              </span>
                            </p>
                            {g.isEmergencyContact && (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                                Emergency
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            Phone: {g.phone}
                            {g.email ? ` • Email: ${g.email}` : ''}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No guardian information available.</p>
                    )}
                  </div>
                </section>

                {/* Health */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Health</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Allergies
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.health?.allergies || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Medical Notes
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.health?.medicalNotes || '—'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Emergency Instructions
                      </p>
                      <p className="mt-0.5 text-sm text-slate-900">
                        {fullStudentData?.health?.emergencyInstructions || '—'}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* Enrolled Courses */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Enrolled in Your Courses</h2>
                  <div className="mt-3 space-y-2">
                    {student.courses.map((course, idx) => {
                      const colors = getCourseColor(course.color);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-md border bg-white px-3 py-2"
                        >
                          <div className={cn('w-1.5 h-10 rounded-full', colors.bg)} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{course.code}</span>
                              <span className="text-sm text-gray-500">Section {course.section}</span>
                            </div>
                            <div className="text-sm text-gray-600">{course.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Quick Contact */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Quick Contact</h2>
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => window.location.href = `mailto:${student.email}`}
                      className="w-full flex items-center gap-3 rounded-md border bg-white px-3 py-2 hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Send Email to Student</span>
                    </button>
                    {fullStudentData?.guardians?.[0]?.email && (
                      <button
                        onClick={() => window.location.href = `mailto:${fullStudentData?.guardians?.[0]?.email}`}
                        className="w-full flex items-center gap-3 rounded-md border bg-white px-3 py-2 hover:bg-blue-50 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Contact Parent/Guardian</span>
                      </button>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Assignment Scores
              </h3>
              <div className="space-y-2">
                {student.assignmentScores.map((assignment, idx) => (
                  <Card
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl border"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{assignment.name}</div>
                      {assignment.submittedAt && (
                        <div className="text-xs text-gray-500">
                          Submitted {formatDate(assignment.submittedAt)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        'text-lg font-bold',
                        (assignment.score / assignment.maxScore) >= 0.8 ? 'text-emerald-600' :
                        (assignment.score / assignment.maxScore) >= 0.6 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {assignment.score}/{assignment.maxScore}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((assignment.score / assignment.maxScore) * 100)}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Attendance Summary
                </h3>
                <div className={cn(
                  'text-2xl font-bold',
                  student.attendancePercentage >= 80 ? 'text-emerald-600' :
                  student.attendancePercentage >= 60 ? 'text-amber-600' : 'text-red-600'
                )}>
                  {student.attendancePercentage}%
                </div>
              </div>
              <Card className="p-6 rounded-xl border">
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      student.attendancePercentage >= 80 ? 'bg-emerald-500' :
                      student.attendancePercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${student.attendancePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round(student.attendancePercentage * 0.3)}
                    </div>
                    <div className="text-xs text-gray-500">Classes Attended</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {Math.round((100 - student.attendancePercentage) * 0.3)}
                    </div>
                    <div className="text-xs text-gray-500">Classes Missed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">30</div>
                    <div className="text-xs text-gray-500">Total Classes</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Teacher Notes ({notes.length})
                </h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </button>
              </div>

              {notes.length === 0 ? (
                <Card className="p-12 rounded-xl border text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No notes for this student yet</p>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first note
                  </button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-4 rounded-xl border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium capitalize',
                              getCategoryColor(note.category)
                            )}>
                              {note.category}
                            </span>
                            <span className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium capitalize',
                              getPriorityColor(note.priority)
                            )}>
                              {note.priority} priority
                            </span>
                          </div>
                          <p className="text-gray-900">{note.content}</p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(note.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add Note Modal */}
      {showAddNote && (
        <AddNoteModal
          studentId={student.studentId}
          onClose={() => setShowAddNote(false)}
          onSave={handleAddNote}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<AggregatedStudent | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const allStudents = useMemo(() => aggregateStudents(), []);

  const uniqueCourses = useMemo(() => {
    const courses = new Map<string, string>();
    teacherCourses.forEach((c) => {
      const key = `${c.courseCode}-${c.section}`;
      courses.set(key, `${c.courseCode} (${c.section})`);
    });
    return Array.from(courses.entries());
  }, []);

  const filteredStudents = useMemo(() => {
    let students = allStudents;

    // Filter by course
    if (courseFilter !== 'all') {
      const [code, section] = courseFilter.split('-');
      students = students.filter((s) =>
        s.courses.some((c) => c.code === code && c.section === section)
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.studentId.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
      );
    }

    return students;
  }, [allStudents, searchTerm, courseFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = filteredStudents.filter((s) => s.status === 'active').length;
    const avgAttendance = filteredStudents.length > 0
      ? Math.round(filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / filteredStudents.length)
      : 0;
    const aGrades = filteredStudents.filter((s) => s.currentGrade.startsWith('A')).length;

    return { total: filteredStudents.length, active, avgAttendance, aGrades };
  }, [filteredStudents]);

  // If viewing a student's full details
  if (viewMode === 'detail' && selectedStudent) {
    return (
      <StudentDetailView
        student={selectedStudent}
        onBack={() => {
          setViewMode('list');
          setSelectedStudent(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Students</h1>
        <p className="mt-2 text-sm text-gray-600">
          View all students enrolled in your courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Total Students</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Avg Attendance</span>
          </div>
          <div className={cn(
            'text-2xl font-bold',
            stats.avgAttendance >= 80 ? 'text-emerald-600' :
            stats.avgAttendance >= 60 ? 'text-amber-600' : 'text-red-600'
          )}>
            {stats.avgAttendance}%
          </div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs">A Grades</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.aGrades}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredStudents.length} students
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Courses</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setViewMode('detail');
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.courses.slice(0, 3).map((course, idx) => {
                        const colors = getCourseColor(course.color);
                        return (
                          <span
                            key={idx}
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                              colors.bg.replace('-500', '-100'),
                              colors.text
                            )}
                          >
                            {course.code}
                          </span>
                        );
                      })}
                      {student.courses.length > 3 && (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{student.courses.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            student.attendancePercentage >= 80 ? 'bg-emerald-500' :
                            student.attendancePercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${student.attendancePercentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{student.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('font-semibold', getGradeColor(student.currentGrade))}>
                      {student.currentGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                        student.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      )}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No students found</p>
          </div>
        )}
      </Card>

    </div>
  );
}
