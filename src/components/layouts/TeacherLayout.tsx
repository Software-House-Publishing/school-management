import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export default function TeacherLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <Container>
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('navigation.teacher')}
            </h1>
            <nav className="flex space-x-4">
              <Link to="/teacher/dashboard" className="text-gray-600 hover:text-gray-900">
                {t('navigation.dashboard')}
              </Link>
              <Link to="/teacher/courses" className="text-gray-600 hover:text-gray-900">
                {t('navigation.courses')}
              </Link>
              <Link to="/teacher/students" className="text-gray-600 hover:text-gray-900">
                {t('navigation.students')}
              </Link>
              <Link to="/teacher/exams" className="text-gray-600 hover:text-gray-900">
                {t('navigation.exams')}
              </Link>
              <Link to="/teacher/announcements" className="text-gray-600 hover:text-gray-900">
                {t('navigation.announcements')}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t('navigation.logout')}
              </Button>
            </nav>
          </div>
        </Container>
      </header>
      
      <main className="py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}