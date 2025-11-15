import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export default function StudentLayout() {
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
              {t('navigation.student')}
            </h1>
            <nav className="flex space-x-4">
              <Link to="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                {t('navigation.dashboard')}
              </Link>
              <Link to="/student/courses" className="text-gray-600 hover:text-gray-900">
                {t('navigation.courses')}
              </Link>
              <Link to="/student/exams" className="text-gray-600 hover:text-gray-900">
                {t('navigation.exams')}
              </Link>
              <Link to="/student/profile" className="text-gray-600 hover:text-gray-900">
                {t('navigation.profile')}
              </Link>
              <Link to="/student/fees" className="text-gray-600 hover:text-gray-900">
                {t('navigation.fees')}
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