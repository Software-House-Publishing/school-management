import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

// System pages (Public)
import SystemHome from '@/pages/system/public/home/Home';
import SystemAbout from '@/pages/system/public/about/About';
import SystemContact from '@/pages/system/public/contact/Contact';
import SystemTerms from '@/pages/system/public/terms/Terms';
import SystemPrivacy from '@/pages/system/public/privacy/Privacy';
import SystemPricing from '@/pages/system/public/pricing/Pricing';
import SystemLogin from '@/pages/system/public/auth/Login';
import SystemRegister from '@/pages/system/public/auth/Register';
import SystemForgotPassword from '@/pages/system/public/auth/ForgotPassword';
import SystemDocs from '@/pages/system/public/docs/Docs';
import SystemCommunity from '@/pages/system/public/community/Community';
import SystemStatus from '@/pages/system/public/status/Status';
import SystemHelp from '@/pages/system/public/help/HelpCenter';
import SystemCareers from '@/pages/system/public/careers/Careers';
import SystemCareerDetail from '@/pages/system/public/careers/CareerDetail';
import SystemPress from '@/pages/system/public/press/Press';
import SystemPressDetail from '@/pages/system/public/press/PressDetail';
import SystemCookies from '@/pages/system/public/cookies/Cookies';
import SystemGDPR from '@/pages/system/public/gdpr/GDPR';

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
import ScrollToTop from '@/components/shared/ScrollToTop';

// Student portal pages
import StudentDashboard from '@/pages/student/dashboard/StudentDashboard';
import StudentCourses from '@/pages/student/courses/StudentCourses';
import StudentExams from '@/pages/student/exams/StudentExams';
import StudentProfile from '@/pages/student/profile/StudentProfile';
import StudentFees from '@/pages/student/fees/StudentFees';

// Teacher portal pages
import TeacherDashboard from '@/pages/teacher/dashboard/TeacherDashboard';
import TeacherCourses from '@/pages/teacher/courses/TeacherCourses';
import TeacherStudents from '@/pages/teacher/students/TeacherStudents';
import TeacherExams from '@/pages/teacher/exams/TeacherExams';
import TeacherAnnouncements from '@/pages/teacher/announcements/TeacherAnnouncements';

// Admin portal pages
// School Portal Pages
import SchoolDashboard from '@/pages/school/dashboard/SchoolDashboard';
import SchoolStudents from '@/pages/school/students/SchoolStudentList';
import SchoolStudentCreate from '@/pages/school/students/StudentCreate';
import SchoolStudentDetail from '@/pages/school/students/StudentDetail';
import SchoolStudentEdit from '@/pages/school/students/StudentEdit';
import SchoolTeachers from '@/pages/school/teachers/SchoolTeacherList';
import SchoolCourses from '@/pages/school/courses/SchoolCourses';
import SchoolAnnouncements from '@/pages/school/announcements/SchoolAnnouncements';
import SchoolExams from '@/pages/school/exams/SchoolExams';
import SchoolFinance from '@/pages/school/finance/SchoolFinance';
import SchoolInvoices from '@/pages/school/invoices/SchoolInvoices';
import SchoolReports from '@/pages/school/reports/SchoolReports';
import SchoolSettings from '@/pages/school/settings/SchoolSettings';

// System Portal Pages (Admin)
import SystemDashboard from '@/pages/system/portal/dashboard/SystemDashboard';
import SystemUsers from '@/pages/system/portal/users/SystemUsers';
import SystemCourses from '@/pages/system/portal/courses/SystemCourses';
import SystemFinance from '@/pages/system/portal/finance/SystemFinance';
import SystemReports from '@/pages/system/portal/reports/SystemReports';
import SystemSettings from '@/pages/system/portal/settings/SystemSettings';
import SystemAnnouncements from '@/pages/system/portal/announcements/SystemAnnouncements';

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
            <Route path="courses" element={<StudentCourses />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="fees" element={<StudentFees />} />
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
            <Route path="exams" element={<TeacherExams />} />
            <Route path="announcements" element={<TeacherAnnouncements />} />
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
            <Route path="dashboard" element={<SchoolDashboard />} />
            <Route path="students" element={<SchoolStudents />} />
            <Route path="students/new" element={<SchoolStudentCreate />} />
            <Route path="students/:id" element={<SchoolStudentDetail />} />
            <Route path="students/:id/edit" element={<SchoolStudentEdit />} />
            <Route path="teachers" element={<SchoolTeachers />} />
            <Route path="courses" element={<SchoolCourses />} />
            <Route path="announcements" element={<SchoolAnnouncements />} />
            <Route path="exams" element={<SchoolExams />} />
            <Route path="finance" element={<SchoolFinance />} />
            <Route path="invoices" element={<SchoolInvoices />} />
            <Route path="reports" element={<SchoolReports />} />
            <Route path="settings" element={<SchoolSettings />} />
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
            <Route path="users" element={<SystemUsers />} />
            <Route path="courses" element={<SystemCourses />} />
            <Route path="announcements" element={<SystemAnnouncements />} />
            <Route path="finance" element={<SystemFinance />} />
            <Route path="reports" element={<SystemReports />} />
            <Route path="settings" element={<SystemSettings />} />
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
