import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Search,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Download,
  Video,
  File,
  Link as LinkIcon,
  Image,
  ArrowLeft,
  Save,
} from 'lucide-react';
import {
  teacherCourses,
  TeacherCourse,
  GradeKey,
  GRADE_POINTS,
  formatTime,
  formatDate,
  getGradeColor,
  getCourseColor,
} from '../data/teacherPortalData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────────────────────────────────────
   COURSE LIST VIEW
───────────────────────────────────────────────────────────────────────────── */
function CourseListView({ onSelectCourse }: { onSelectCourse: (course: TeacherCourse) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    if (!searchTerm) return teacherCourses;
    const term = searchTerm.toLowerCase();
    return teacherCourses.filter(
      (c) =>
        c.courseCode.toLowerCase().includes(term) ||
        c.courseName.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Courses</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your courses, students, and grades
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => {
          const colors = getCourseColor(course.color);
          const activeStudents = course.students.filter((s) => s.status === 'active').length;
          const scheduleText = course.schedule
            .map((s) => `${s.day} ${formatTime(s.startTime)}`)
            .join(', ');

          return (
            <Card
              key={course.id}
              className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => onSelectCourse(course)}
            >
              {/* Color header */}
              <div className={cn('h-2', colors.bg)} />

              <div className="p-5">
                {/* Course Code & Section */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{course.courseCode}</span>
                      <span className="text-sm text-gray-500">Section {course.section}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-medium text-gray-700">{course.courseName}</h3>
                  </div>
                  <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', colors.bg.replace('-500', '-50'), colors.text)}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Students</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{activeStudents}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-xs">Credits</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{course.credits}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Room</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{course.room}</div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{scheduleText}</span>
                  </div>
                </div>

                {/* Grading Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Grading Progress</span>
                    <span>Final: {course.gradingProgress.final}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', colors.bg)}
                      style={{ width: `${course.gradingProgress.final}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{course.semester}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COURSE DETAIL VIEW
───────────────────────────────────────────────────────────────────────────── */
type CourseTab = 'roster' | 'grades' | 'attendance' | 'materials' | 'announcements';

function CourseDetailView({
  course,
  onBack,
}: {
  course: TeacherCourse;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<CourseTab>('roster');
  const colors = getCourseColor(course.color);

  const tabs: { id: CourseTab; label: string; icon: React.ElementType }[] = [
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'grades', label: 'Grades', icon: ClipboardCheck },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className={cn('inline-flex h-12 w-12 items-center justify-center rounded-xl', colors.bg.replace('-500', '-100'), colors.text)}>
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{course.courseCode}</h1>
                  <span className="text-gray-500">Section {course.section}</span>
                </div>
                <p className="text-gray-600">{course.courseName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{course.students.filter((s) => s.status === 'active').length} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{course.room}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-4 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'roster' && <RosterTab course={course} />}
      {activeTab === 'grades' && <GradesTab course={course} />}
      {activeTab === 'attendance' && <AttendanceTab course={course} />}
      {activeTab === 'materials' && <MaterialsTab course={course} />}
      {activeTab === 'announcements' && <AnnouncementsTab course={course} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROSTER TAB
───────────────────────────────────────────────────────────────────────────── */
function RosterTab({ course }: { course: TeacherCourse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dropped'>('all');

  const filteredStudents = useMemo(() => {
    let students = course.students;

    if (statusFilter !== 'all') {
      students = students.filter((s) => s.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.studentId.toLowerCase().includes(term)
      );
    }

    return students;
  }, [course.students, searchTerm, statusFilter]);

  return (
    <Card className="rounded-2xl border shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'dropped')}
            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="dropped">Dropped</option>
          </select>
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
              <th className="px-6 py-3">Attendance</th>
              <th className="px-6 py-3">Current Grade</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GRADES TAB
───────────────────────────────────────────────────────────────────────────── */
function GradesTab({ course }: { course: TeacherCourse }) {
  const [grades, setGrades] = useState<Record<string, { midterm: GradeKey; final: GradeKey }>>(
    () => {
      const initial: Record<string, { midterm: GradeKey; final: GradeKey }> = {};
      course.students.forEach((s) => {
        initial[s.id] = { midterm: s.midtermGrade, final: s.finalGrade };
      });
      return initial;
    }
  );
  const [hasChanges, setHasChanges] = useState(false);

  const gradeOptions: GradeKey[] = ['-', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

  const handleGradeChange = (studentId: string, type: 'midterm' | 'final', grade: GradeKey) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [type]: grade },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('Grades saved successfully!');
  };

  const activeStudents = course.students.filter((s) => s.status === 'active');

  const stats = useMemo(() => {
    const midtermGrades = activeStudents
      .map((s) => grades[s.id]?.midterm)
      .filter((g) => g && g !== '-') as Exclude<GradeKey, '-'>[];
    const finalGrades = activeStudents
      .map((s) => grades[s.id]?.final)
      .filter((g) => g && g !== '-') as Exclude<GradeKey, '-'>[];

    const calcAvg = (gradeList: Exclude<GradeKey, '-'>[]) => {
      if (gradeList.length === 0) return null;
      const sum = gradeList.reduce((acc, g) => acc + GRADE_POINTS[g], 0);
      return (sum / gradeList.length).toFixed(2);
    };

    return {
      midtermAvg: calcAvg(midtermGrades),
      midtermGraded: midtermGrades.length,
      finalAvg: calcAvg(finalGrades),
      finalGraded: finalGrades.length,
      total: activeStudents.length,
    };
  }, [activeStudents, grades]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 rounded-xl border">
          <div className="text-sm text-gray-500">Midterm Graded</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {stats.midtermGraded}/{stats.total}
          </div>
          {stats.midtermAvg && (
            <div className="mt-1 text-sm text-gray-500">Avg: {stats.midtermAvg} GPA</div>
          )}
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="text-sm text-gray-500">Final Graded</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {stats.finalGraded}/{stats.total}
          </div>
          {stats.finalAvg && (
            <div className="mt-1 text-sm text-gray-500">Avg: {stats.finalAvg} GPA</div>
          )}
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="text-sm text-gray-500">Midterm Progress</div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(stats.midtermGraded / stats.total) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((stats.midtermGraded / stats.total) * 100)}%
          </div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="text-sm text-gray-500">Final Progress</div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(stats.finalGraded / stats.total) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((stats.finalGraded / stats.total) * 100)}%
          </div>
        </Card>
      </div>

      {/* Grade Entry Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Grade Entry</h3>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            Save Grades
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Midterm Grade</th>
                <th className="px-6 py-3">Final Grade</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <select
                      value={grades[student.id]?.midterm || '-'}
                      onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value as GradeKey)}
                      className={cn(
                        'rounded-lg border border-gray-300 py-1.5 px-3 text-sm font-medium focus:border-blue-500 focus:outline-none',
                        getGradeColor(grades[student.id]?.midterm || '-')
                      )}
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={grades[student.id]?.final || '-'}
                      onChange={(e) => handleGradeChange(student.id, 'final', e.target.value as GradeKey)}
                      className={cn(
                        'rounded-lg border border-gray-300 py-1.5 px-3 text-sm font-medium focus:border-blue-500 focus:outline-none',
                        getGradeColor(grades[student.id]?.final || '-')
                      )}
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {grades[student.id]?.final && grades[student.id]?.final !== '-' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </span>
                    ) : grades[student.id]?.midterm && grades[student.id]?.midterm !== '-' ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Midterm Only
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                        <XCircle className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ATTENDANCE TAB
───────────────────────────────────────────────────────────────────────────── */
function AttendanceTab({ course }: { course: TeacherCourse }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const activeStudents = course.students.filter((s) => s.status === 'active');

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('Attendance saved successfully!');
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, 'present'> = {};
    activeStudents.forEach((s) => {
      newAttendance[s.id] = 'present';
    });
    setAttendance(newAttendance);
    setHasChanges(true);
  };

  const statusColors = {
    present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    absent: 'bg-red-100 text-red-700 border-red-200',
    late: 'bg-amber-100 text-amber-700 border-amber-200',
    excused: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <Card className="p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={markAllPresent}
              className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Mark All Present
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            Save Attendance
          </button>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Overall Attendance</th>
                <th className="px-6 py-3">Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
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
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize',
                            attendance[student.id] === status
                              ? statusColors[status]
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MATERIALS TAB
───────────────────────────────────────────────────────────────────────────── */
function MaterialsTab({ course }: { course: TeacherCourse }) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const typeIcons = {
    pdf: FileText,
    video: Video,
    document: File,
    link: LinkIcon,
    image: Image,
  };

  const typeColors = {
    pdf: 'bg-red-50 text-red-600',
    video: 'bg-purple-50 text-purple-600',
    document: 'bg-blue-50 text-blue-600',
    link: 'bg-green-50 text-green-600',
    image: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Course Materials</h3>
          <p className="text-sm text-gray-500">{course.materials.length} files uploaded</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {course.materials.map((material) => {
          const Icon = typeIcons[material.type];
          return (
            <Card key={material.id} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={cn('p-2.5 rounded-lg', typeColors[material.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{material.type}</span>
                    {material.size && (
                      <>
                        <span>•</span>
                        <span>{material.size}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Uploaded {formatDate(material.uploadedAt)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {course.materials.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No materials uploaded yet</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Upload your first material
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Material</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter material title"
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="link">External Link</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Drag and drop or click to upload</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  alert('Material uploaded! (Demo)');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANNOUNCEMENTS TAB
───────────────────────────────────────────────────────────────────────────── */
function AnnouncementsTab({ course }: { course: TeacherCourse }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const priorityColors = {
    urgent: 'bg-red-50 text-red-700 border-red-100',
    important: 'bg-amber-50 text-amber-700 border-amber-100',
    normal: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Course Announcements</h3>
          <p className="text-sm text-gray-500">{course.announcements.length} announcements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {course.announcements.map((ann) => (
          <Card key={ann.id} className="p-5 rounded-xl border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priorityColors[ann.priority])}>
                    {ann.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{ann.body}</p>
                <div className="mt-3 text-xs text-gray-400">
                  Posted on {formatDate(ann.createdAt)} by {ann.author}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {course.announcements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No announcements yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first announcement
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Enter your announcement..."
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  alert('Announcement created! (Demo)');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Announcement
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function TeacherCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(() => {
    const courseId = searchParams.get('course');
    if (courseId) {
      return teacherCourses.find((c) => c.id === courseId) || null;
    }
    return null;
  });

  const handleSelectCourse = (course: TeacherCourse) => {
    setSelectedCourse(course);
    setSearchParams({ course: course.id });
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSearchParams({});
  };

  if (selectedCourse) {
    return <CourseDetailView course={selectedCourse} onBack={handleBack} />;
  }

  return <CourseListView onSelectCourse={handleSelectCourse} />;
}
