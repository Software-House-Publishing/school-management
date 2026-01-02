import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard, KpiCardsRow } from '@/components/shared/data/KpiCard';
import { IdentityCard } from '@/components/shared/dashboard/IdentityCard';
import { AnnouncementPanel, AnnouncementItem } from '@/components/shared/dashboard/AnnouncementPanel';
import { ActionItemsCard, ActionItem } from '@/components/shared/dashboard/ActionItemsCard';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  GraduationCap,
  Bell,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  currentTeacher,
  mockTodayClasses,
  getDashboardStats,
  actionItems as rawActionItems,
  recentSubmissions,
  teacherAnnouncements,
  formatTime,
  getCourseColor,
} from '../data/teacherPortalData';
import { cn } from '@/lib/utils';

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
                <div className="w-20 shrink-0">
                  <div className="text-sm font-semibold text-gray-900">{formatTime(cls.startTime)}</div>
                  <div className="text-xs text-gray-500">{formatTime(cls.endTime)}</div>
                </div>
                <div className={cn('w-1 h-12 rounded-full', colors.bg)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{cls.courseCode}</span>
                    <span className="text-sm text-gray-500">Section {cls.section}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 truncate">{cls.courseName}</div>
                </div>
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
   RECENT SUBMISSIONS
───────────────────────────────────────────────────────────────────────────── */
function RecentSubmissionsCard() {
  const navigate = useNavigate();

  const statusClasses = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    graded: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    late: 'bg-red-50 text-red-700 border-red-100',
  };

  const statusIcons = {
    pending: Clock,
    graded: CheckCircle2,
    late: XCircle,
  };

  return (
    <Card className="rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent Submissions</h2>
            <p className="text-xs text-gray-500">Latest student work</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/teacher/courses')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>

      <div className="divide-y max-h-[280px] overflow-y-auto">
        {recentSubmissions.slice(0, 5).map((sub) => {
          const StatusIcon = statusIcons[sub.status];
          return (
            <div key={sub.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50">
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                {sub.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">{sub.studentName}</span>
                  <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium', statusClasses[sub.status])}>
                    <StatusIcon className="h-3 w-3" />
                    {sub.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {sub.courseCode} - {sub.assignmentName}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-gray-500">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
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
    return first;
  }, [user]);

  // Convert action items to ActionItemsCard format
  const actionItemsData: ActionItem[] = useMemo(() => {
    const typeIcons = {
      grade: ClipboardCheck,
      attendance: CheckCircle2,
      material: FileText,
      exam: GraduationCap,
      document: FileText,
    };

    return rawActionItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      priority: item.priority as 'high' | 'medium' | 'low',
      dueDate: item.dueDate,
      icon: typeIcons[item.type],
    }));
  }, []);

  // Convert announcements to AnnouncementPanel format
  const announcementsData: AnnouncementItem[] = useMemo(() => {
    return teacherAnnouncements
      .filter(a => !a.isOwn)
      .slice(0, 3)
      .map(a => ({
        id: a.id,
        title: a.title,
        body: a.body,
        dateLabel: new Date(a.createdAt).toLocaleDateString(),
        priority: a.priority as 'urgent' | 'important' | 'normal',
        scope: a.scope,
        author: a.author,
      }));
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${teacherName}!`}
        subtitle="Manage your courses, students, and academic activities"
        className="mb-8"
      />

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left - ID Card */}
        <div className="xl:col-span-1">
          <IdentityCard
            type="teacher"
            name={`${currentTeacher.firstName} ${currentTeacher.lastName}`}
            id={currentTeacher.teacherId}
            status={currentTeacher.status}
            qrId={currentTeacher.staffQrId}
            extraFields={[
              { label: 'Department', value: currentTeacher.department },
              { label: 'Role', value: currentTeacher.role },
            ]}
            officeHours={currentTeacher.officeHours}
            officeLocation={currentTeacher.office}
          />
        </div>

        {/* Right - Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* KPI Cards */}
          <KpiCardsRow columns={4}>
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
          </KpiCardsRow>

          {/* Today's Schedule */}
          <TodayScheduleCard />

          {/* Action Items & Submissions Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActionItemsCard
              title="Action Items"
              subtitle={`${actionItemsData.length} tasks need attention`}
              icon={AlertCircle}
              iconColor="red"
              items={actionItemsData}
            />
            <RecentSubmissionsCard />
          </div>

          {/* Announcements */}
          <AnnouncementPanel
            title="School Announcements"
            subtitle="From administration"
            iconVariant="bell"
            items={announcementsData}
            onViewAll={() => navigate('/teacher/announcements')}
          />
        </div>
      </div>
    </div>
  );
}
