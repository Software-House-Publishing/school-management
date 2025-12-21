import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import Sidebar, { UserInfo } from '@/components/shared/Sidebar';
import { studentNavItems } from '@/config/navigation.tsx';

export default function StudentLayout() {
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
        brandName="Classivo"
        brandSubtitle="Student Portal"
        user={userInfo}
        items={studentNavItems}
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