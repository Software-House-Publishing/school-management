import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';

import { useAuthStore } from '@/stores/authStore';
import Sidebar, { UserInfo } from '@/components/shared/Sidebar';
import { adminNavItems, directorNavItems } from '@/config/navigation.tsx';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // pick sidebar items based on role
  const navItems = user?.role === 'system_administrator'
    ? directorNavItems // used by us
    : adminNavItems; // used by administrator + manager

  const userInfo: UserInfo | undefined = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        brandName="EduNest"
        brandSubtitle="Admin Portal"
        user={userInfo}
        items={navItems}
        onSignOut={handleLogout}
      />

      <main
        className="p-8"
        style={{
          paddingLeft:
            'calc(var(--sidebar-width) + var(--sidebar-gutter) + var(--content-gutter))',
        }}
      >
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
