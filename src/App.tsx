import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

import ScrollToTop from '@/components/shared/ScrollToTop';
// System pages (SaaS provider)
import SystemHome from '@/pages/system/home/Home';
import SystemAbout from '@/pages/system/about/About';
import SystemContact from '@/pages/system/contact/Contact';
import SystemTerms from '@/pages/system/terms/Terms';
import SystemPrivacy from '@/pages/system/privacy/Privacy';
import SystemPricing from '@/pages/system/pricing/Pricing';
import SystemLogin from '@/pages/system/auth/Login';
import SystemRegister from '@/pages/system/auth/Register';
import SystemForgotPassword from '@/pages/system/auth/ForgotPassword';
import SystemDocs from '@/pages/system/docs/Docs';
import SystemCommunity from '@/pages/system/community/Community';
import SystemStatus from '@/pages/system/status/Status';
import SystemHelp from '@/pages/system/help/HelpCenter';
import SystemCareers from '@/pages/system/careers/Careers';
import SystemCareerDetail from '@/pages/system/careers/CareerDetail';
import SystemPress from '@/pages/system/press/Press';
import SystemPressDetail from '@/pages/system/press/PressDetail';
import SystemCookies from '@/pages/system/cookies/Cookies';
import SystemGDPR from '@/pages/system/gdpr/GDPR';

// School-specific public pages
import SchoolHome from '@/pages/school-public/home/SchoolHome';
import SchoolAbout from '@/pages/school-public/about/SchoolAbout';
import SchoolContact from '@/pages/school-public/contact/SchoolContact';
import SchoolPricing from '@/pages/school-public/pricing/SchoolPricing';
import SchoolRules from '@/pages/school-public/rules/SchoolRules';
import SchoolLogin from '@/pages/school-public/auth/SchoolLogin';

// Protected route components
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import StudentLayout from '@/components/layouts/StudentLayout';
import TeacherLayout from '@/components/layouts/TeacherLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// Student portal pages
import StudentDashboard from '@/pages/student/dashboard/StudentDashboard';
import StudentQRId from '@/pages/student/qr-id/StudentQRId';
import StudentGrades from '@/pages/student/grades/StudentGrades';
import StudentSchedule from '@/pages/student/schedule/StudentSchedule';
import StudentCourses from '@/pages/student/courses/StudentCourses';
import StudentAdvisor from '@/pages/student/advisor/StudentAdvisor';
import StudentAssignments from '@/pages/student/assignments/StudentAssignments';
import StudentFees from '@/pages/student/fees/StudentFees';
import StudentCalendar from '@/pages/student/calendar/StudentCalendar';
import StudentExams from '@/pages/student/exams/StudentExams';
import StudentProfile from '@/pages/student/profile/StudentProfile';

// Teacher portal pages
import TeacherDashboard from '@/pages/teacher/dashboard/TeacherDashboard';
import TeacherCourses from '@/pages/teacher/courses/TeacherCourses';
import TeacherStudents from '@/pages/teacher/students/TeacherStudents';
import TeacherSchedule from '@/pages/teacher/schedule/TeacherSchedule';
import TeacherExams from '@/pages/teacher/exams/TeacherExams';
import TeacherAnnouncements from '@/pages/teacher/announcements/TeacherAnnouncements';
import TeacherProfile from '@/pages/teacher/profile/TeacherProfile';
import TeacherAvailability from '@/pages/teacher/availability/TeacherAvailability';

// School Admin portal pages (folder: admin, routes: /school-admin)
import SchoolAdminAnnouncement from '@/pages/admin/announcement/AdminAnnouncement';
import SchoolAdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import SchoolAdminUsers from '@/pages/admin/users/AdminUsers';
import SchoolAdminCourses from '@/pages/admin/courses/AdminCourses';
import SchoolAdminExams from '@/pages/admin/exams/AdminExams';
import SchoolAdminFinance from '@/pages/admin/finance/AdminFinance';
import SchoolAdminInvoices from '@/pages/admin/invoices/AdminInvoices';
import SchoolAdminReports from '@/pages/admin/reports/AdminReports';
import SchoolAdminSettings from '@/pages/admin/settings/AdminSettings';
import SchoolAdminStudents from '@/pages/admin/students/StudentList';
import SchoolAdminTeachers from '@/pages/admin/teachers/TeacherList';
import SchoolAdminStudentDetail from '@/pages/admin/students/StudentDetail';
import SchoolAdminStudentCreate from '@/pages/admin/students/StudentCreate';
import SchoolAdminStudentEdit from '@/pages/admin/students/StudentEdit';
import SchoolAdminTeacherDetail from '@/pages/admin/teachers/TeacherDetail';
import SchoolAdminTeacherCreate from '@/pages/admin/teachers/TeacherCreate';
import SchoolAdminTeacherEdit from '@/pages/admin/teachers/TeacherEdit';
import SchoolAdminUserDetail from '@/pages/admin/users/UserDetail';
import SchoolAdminUserCreate from '@/pages/admin/users/UserCreate';
import SchoolAdminUserEdit from '@/pages/admin/users/UserEdit';
import SchoolAdminCalendar from '@/pages/admin/calendar/AdminCalendar';
import SchoolAdminTeacherAvailability from '@/pages/admin/teacher-availability/TeacherAvailabilityAdmin';
import SchoolAdminTimetableDashboard from '@/pages/admin/timetable-planner/TimetableDashboard';
import SchoolAdminTimetablePlanner from '@/pages/admin/timetable-planner/TimetablePlanner';

// System Admin portal pages
import SystemDashboard from '@/pages/system-admin/dashboard/SystemDashboard';
import SystemSchoolsPage from '@/pages/system-admin/schools/SchoolsPage';
import SystemSchoolAdminsPage from '@/pages/system-admin/school-admins/SchoolAdminsPage';
import SystemUsersPage from '@/pages/system-admin/users/SystemUsersPage';
import SystemRolesPage from '@/pages/system-admin/roles/RolesPermissionsPage';
import SystemAnnouncementsPage from '@/pages/system-admin/announcements/SystemAnnouncementsPage';
import SystemReportsPage from '@/pages/system-admin/reports/SystemReportsPage';
import SystemIntegrationsPage from '@/pages/system-admin/integrations/IntegrationsPage';
import SystemAuditLogsPage from '@/pages/system-admin/audit-logs/AuditLogsPage';
import SystemSettingsPage from '@/pages/system-admin/settings/SystemSettingsPage';
import SystemSupportPage from '@/pages/system-admin/support/SupportCenterPage';
import SystemSecurityPage from '@/pages/system-admin/security/SecurityPage';
import SystemHealthPage from '@/pages/system-admin/health/SystemHealthPage';

// Shared pages
import NotificationsPage from '@/pages/shared/notifications/NotificationsPage';

function App() {
  const { i18n } = useTranslation();
  // const { user, updateUser } = useAuthStore();

  // useEffect(() => {
  //   if (user) {
  //     if (user.role === 'director' as any) {
  //       updateUser({ role: 'system_administrator' });
  //     } else if (user.role === 'administrator' as any) {
  //       updateUser({ role: 'school_administrator' });
  //     }
  //   }
  // }, [user, updateUser]);

  return (
    <div dir={i18n.language === 'my' ? 'rtl' : 'ltr'}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* System routes (SaaS provider) */}
          <Route path="/" element={<SystemHome />} />
          <Route path="/about" element={<SystemAbout />} />
          <Route path="/contact" element={<SystemContact />} />
          <Route path="/pricing" element={<SystemPricing />} />
          <Route path="/terms" element={<SystemTerms />} />
          <Route path="/privacy" element={<SystemPrivacy />} />
          <Route path="/login" element={<SystemLogin />} />
          <Route path="/register" element={<SystemRegister />} />
          <Route path="/forgot-password" element={<SystemForgotPassword />} />
          <Route path="/docs" element={<SystemDocs />} />
          <Route path="/community" element={<SystemCommunity />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/help" element={<SystemHelp />} />
          <Route path="/careers" element={<SystemCareers />} />
          <Route path="/careers/:slug" element={<SystemCareerDetail />} />
          <Route path="/press" element={<SystemPress />} />
          <Route path="/press/:slug" element={<SystemPressDetail />} />
          <Route path="/cookies" element={<SystemCookies />} />
          <Route path="/gdpr" element={<SystemGDPR />} />

          {/* School-specific public routes */}
          <Route path="/school/:schoolId" element={<SchoolHome />} />
          <Route path="/school/:schoolId/about" element={<SchoolAbout />} />
          <Route path="/school/:schoolId/contact" element={<SchoolContact />} />
          <Route path="/school/:schoolId/pricing" element={<SchoolPricing />} />
          <Route path="/school/:schoolId/rules" element={<SchoolRules />} />
          <Route path="/school/:schoolId/login" element={<SchoolLogin />} />

          {/* Student portal */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="qr-id" element={<StudentQRId />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="advisor" element={<StudentAdvisor />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher portal */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="announcements" element={<TeacherAnnouncements />} />
            <Route path="availability" element={<TeacherAvailability />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>

          {/* School Admin portal */}
          <Route
            path="/school-admin/*"
            element={
              <ProtectedRoute allowedRoles={['school_administrator', 'manager', 'finance_officer', 'help_desk']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/school-admin/dashboard" replace />} />
            <Route path="dashboard" element={<SchoolAdminDashboard />} />
            <Route path="students" element={<SchoolAdminStudents />} />
            <Route path="students/new" element={<SchoolAdminStudentCreate />} />
            <Route path="students/:id" element={<SchoolAdminStudentDetail />} />
            <Route path="students/:id/edit" element={<SchoolAdminStudentEdit />} />
            <Route path="teachers" element={<SchoolAdminTeachers />} />
            <Route path="teachers/new" element={<SchoolAdminTeacherCreate />} />
            <Route path="teachers/:id" element={<SchoolAdminTeacherDetail />} />
            <Route path="teachers/:id/edit" element={<SchoolAdminTeacherEdit />} />
            <Route path="courses" element={<SchoolAdminCourses />} />
            <Route path="announcements" element={<SchoolAdminAnnouncement />} />
            <Route path="exams" element={<SchoolAdminExams />} />
            <Route path="finance" element={<SchoolAdminFinance />} />
            <Route path="invoices" element={<SchoolAdminInvoices />} />
            <Route path="reports" element={<SchoolAdminReports />} />
            <Route path="calendar" element={<SchoolAdminCalendar />} />
            <Route path="teacher-availability" element={<SchoolAdminTeacherAvailability />} />
            <Route path="timetable-dashboard" element={<SchoolAdminTimetableDashboard />} />
            <Route path="timetable-planner" element={<SchoolAdminTimetablePlanner />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SchoolAdminSettings />} />
          </Route>

          {/* System Admin portal */}
          <Route
            path="/system-admin/*"
            element={
              <ProtectedRoute allowedRoles={['system_administrator']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/system-admin/dashboard" replace />} />
            <Route path="dashboard" element={<SystemDashboard />} />
            <Route path="schools" element={<SystemSchoolsPage />} />
            <Route path="school-admins" element={<SystemSchoolAdminsPage />} />
            <Route path="users" element={<SystemUsersPage />} />
            <Route path="roles" element={<SystemRolesPage />} />
            <Route path="announcements" element={<SystemAnnouncementsPage />} />
            <Route path="reports" element={<SystemReportsPage />} />
            <Route path="integrations" element={<SystemIntegrationsPage />} />
            <Route path="audit-logs" element={<SystemAuditLogsPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
            <Route path="support" element={<SystemSupportPage />} />
            <Route path="security" element={<SystemSecurityPage />} />
            <Route path="health" element={<SystemHealthPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}

export default App;
