import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

// Public pages
import Home from '@/pages/public/home/Home';
import About from '@/pages/public/about/About';
import Contact from '@/pages/public/contact/Contact';
import Rules from '@/pages/public/rules/Rules';

// Auth pages
import Login from '@/pages/public/auth/Login';

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
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import AdminUsers from '@/pages/admin/users/AdminUsers';
import AdminCourses from '@/pages/admin/courses/AdminCourses';
import AdminFinance from '@/pages/admin/finance/AdminFinance';
import AdminReports from '@/pages/admin/reports/AdminReports';
import AdminSettings from '@/pages/admin/settings/AdminSettings';

function App() {
  const { i18n } = useTranslation();

  return (
    <div dir={i18n.language === 'my' ? 'rtl' : 'ltr'}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />

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
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
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
