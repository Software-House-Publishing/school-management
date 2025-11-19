import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

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
import AdminAnnouncement from '@/pages/admin/announcement/AdminAnnouncement';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
// import AdminUsers from '@/pages/admin/users/AdminUsers';
import AdminCourses from '@/pages/admin/courses/AdminCourses';
import AdminExams from '@/pages/admin/exams/AdminExams';
import AdminFinance from '@/pages/admin/finance/AdminFinance';
import AdminInvoices from '@/pages/admin/invoices/AdminInvoices';
import AdminReports from '@/pages/admin/reports/AdminReports';
import AdminSettings from '@/pages/admin/settings/AdminSettings';
import AdminStudents from '@/pages/admin/students/StudentList';
import AdminTeachers from '@/pages/admin/teachers/TeacherList';


function App() {
  const { i18n } = useTranslation();

  return (
    <div dir={i18n.language === 'my' ? 'rtl' : 'ltr'}>
      <Router>
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

          {/* Admin portal */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['director', 'administrator', 'manager', 'finance_officer', 'help_desk']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* <Route path="users" element={<AdminUsers />} /> */}
            <Route path="courses" element={<AdminCourses />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="announcements" element={<AdminAnnouncement />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="invoices" element={<AdminInvoices />} />
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
