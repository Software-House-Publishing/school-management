import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import Sidebar, { UserInfo } from '@/components/shared/Sidebar';
import { teacherNavItems } from '@/config/navigation.tsx';

export default function TeacherLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user info for sidebar
  const userInfo: UserInfo | undefined = user ? {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        brandName="EduNest"
        brandSubtitle="Teacher Portal"
        user={userInfo}
        items={teacherNavItems}
        onSignOut={handleLogout}
      />
      
      <main className="p-8" style={{ paddingLeft: 'calc(var(--sidebar-width) + var(--sidebar-gutter) + var(--content-gutter))' }}>
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}