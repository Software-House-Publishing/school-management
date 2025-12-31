import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Calendar,
  QrCode,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Bell,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  currentTeacher,
  mockTodayClasses,
  getDashboardStats,
  actionItems,
  recentSubmissions,
  teacherAnnouncements,
  formatTime,
  formatDateTime,
  getCourseColor,
} from '../data/teacherPortalData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEACHER ID CARD (like student's Virtual ID Card)
───────────────────────────────────────────────────────────────────────────── */
function TeacherIdCard() {
  return (
    <Card className="h-full rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-base font-semibold text-gray-900">Staff ID Card</h2>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <QrCode className="h-5 w-5" />
        </div>
      </div>

      <div className="p-5">
        {/* QR Code Section */}
        <div className="flex h-[128px] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-700 shadow-md">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn('h-2 w-2 rounded-sm bg-white/70', i % 6 === 0 && 'bg-white')}
                  />
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-500">STAFF QR CODE</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">{currentTeacher.staffQrId}</div>
              <div className="mt-1 text-xs text-gray-500">Scan for attendance</div>
            </div>
          </div>
        </div>

        {/* Staff Info */}
        <div className="mt-5 rounded-2xl border bg-white p-4">
          <div className="text-xs font-semibold tracking-wide text-gray-500">STAFF NAME</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {currentTeacher.firstName} {currentTeacher.lastName}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">ID</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{currentTeacher.teacherId}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">STATUS</div>
              <div className="mt-1 text-sm font-semibold text-emerald-700 capitalize">
                {currentTeacher.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">DEPARTMENT</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{currentTeacher.department}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">ROLE</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{currentTeacher.role}</div>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-800">OFFICE HOURS</span>
          </div>
          <div className="mt-2 text-sm font-medium text-amber-900">{currentTeacher.officeHours}</div>
          <div className="mt-1 text-xs text-amber-700">{currentTeacher.office}</div>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   KPI CARDS
───────────────────────────────────────────────────────────────────────────── */
function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red';
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
  };

  return (
    <Card
      className={cn(
        'rounded-2xl border shadow-sm p-5',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="mt-1 text-xs text-gray-500">{subtext}</p>}
        </div>
        <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1', colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TODAY'S SCHEDULE
───────────────────────────────────────────────────────────────────────────── */
function TodayScheduleCard() {
  const navigate = useNavigate();
  const classes = mockTodayClasses;

  return (
    <Card className="rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 ring-1 ring-black/5">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Today's Classes</h2>
            <p className="text-xs text-gray-500">{classes.length} classes scheduled</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/teacher/schedule')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Full Schedule
        </button>
      </div>

      <div className="divide-y">
        {classes.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No classes scheduled for today</div>
        ) : (
          classes.map((cls) => {
            const colors = getCourseColor(cls.color);
            return (
              <div key={cls.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                {/* Time */}
                <div className="w-20 shrink-0">
                  <div className="text-sm font-semibold text-gray-900">{formatTime(cls.startTime)}</div>
                  <div className="text-xs text-gray-500">{formatTime(cls.endTime)}</div>
                </div>

                {/* Color bar */}
                <div className={cn('w-1 h-12 rounded-full', colors.bg)} />

                {/* Course info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{cls.courseCode}</span>
                    <span className="text-sm text-gray-500">Section {cls.section}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 truncate">{cls.courseName}</div>
                </div>

                {/* Room & Students */}
                <div className="text-right shrink-0">
                  <div className={cn('text-sm font-semibold', colors.text)}>{cls.room}</div>
                  <div className="text-xs text-gray-500">{cls.studentCount} students</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ACTION ITEMS & RECENT SUBMISSIONS - Combined Wide Card
───────────────────────────────────────────────────────────────────────────── */
function ActionAndSubmissionsCard() {
  const navigate = useNavigate();

  const priorityDot = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-gray-400',
  };

  const statusConfig = {
    pending: { text: 'text-amber-600', bg: 'bg-amber-50' },
    graded: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
    late: { text: 'text-red-600', bg: 'bg-red-50' },
  };

  return (
    <Card className="rounded-2xl border shadow-sm">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
        {/* Action Items Column */}
        <div>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Action Items</h2>
                <p className="text-xs text-gray-500">{actionItems.length} pending</p>
              </div>
            </div>
          </div>

          <div className="divide-y max-h-[320px] overflow-y-auto">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', priorityDot[item.priority])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                  {item.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">Due: {item.dueDate}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions Column */}
        <div>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Recent Submissions</h2>
                <p className="text-xs text-gray-500">Latest student work</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/teacher/courses')}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              View All
            </button>
          </div>

          <div className="divide-y max-h-[320px] overflow-y-auto">
            {recentSubmissions.slice(0, 5).map((sub) => {
              const status = statusConfig[sub.status];
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                    {sub.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{sub.studentName}</p>
                      <span className={cn('text-xs font-medium capitalize', status.text)}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {sub.courseCode} · {sub.assignmentName}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANNOUNCEMENTS PANEL
───────────────────────────────────────────────────────────────────────────── */
function AnnouncementsPanel() {
  const navigate = useNavigate();

  const priorityClasses = {
    urgent: 'bg-red-50 text-red-700 border-red-100',
    important: 'bg-amber-50 text-amber-700 border-amber-100',
    normal: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  // Show school/department announcements (not own)
  const schoolAnnouncements = teacherAnnouncements.filter(a => !a.isOwn).slice(0, 3);

  return (
    <Card className="rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">School Announcements</h2>
            <p className="text-xs text-gray-500">From administration</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/teacher/announcements')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>

      <div className="divide-y">
        {schoolAnnouncements.map((ann) => (
          <div key={ann.id} className="px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">{ann.title}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priorityClasses[ann.priority])}>
                    {ann.priority}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
                    {ann.scope}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ann.body}</p>
                <p className="mt-2 text-xs text-gray-400">From: {ann.author}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-500">
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
export default function TeacherDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = useMemo(() => getDashboardStats(), []);

  const teacherName = useMemo(() => {
    const first = user?.firstName?.trim() || currentTeacher.firstName;
    const last = (user as any)?.lastName?.trim?.() || currentTeacher.lastName;
    return first;
  }, [user]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {teacherName}!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your courses, students, and academic activities
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left - ID Card */}
        <div className="xl:col-span-1">
          <TeacherIdCard />
        </div>

        {/* Right - Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              icon={BookOpen}
              label="Active Courses"
              value={stats.activeCourses}
              subtext={`${stats.totalSections} sections`}
              color="blue"
              onClick={() => navigate('/teacher/courses')}
            />
            <KpiCard
              icon={Users}
              label="Total Students"
              value={stats.totalStudents}
              subtext="This semester"
              color="green"
              onClick={() => navigate('/teacher/students')}
            />
            <KpiCard
              icon={ClipboardCheck}
              label="Pending Grades"
              value={stats.pendingGrades}
              subtext="Need attention"
              color={stats.pendingGrades > 20 ? 'red' : 'amber'}
              onClick={() => navigate('/teacher/courses')}
            />
            <KpiCard
              icon={GraduationCap}
              label="Upcoming Exams"
              value={stats.upcomingExams}
              subtext="Scheduled"
              color="purple"
              onClick={() => navigate('/teacher/exams')}
            />
          </div>

          {/* Today's Schedule */}
          <TodayScheduleCard />

          {/* Action Items & Recent Submissions - Wide Card */}
          <ActionAndSubmissionsCard />

          {/* Announcements */}
          <AnnouncementsPanel />
        </div>
      </div>
    </div>
  );
}
