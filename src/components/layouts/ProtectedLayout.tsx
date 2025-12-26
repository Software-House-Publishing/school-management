import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import Sidebar, { UserInfo, StudentInfo, NavItem } from '@/components/shared/Sidebar';

export interface ProtectedLayoutProps {
  brandSubtitle: string;
  navItems: NavItem[];
  userInfoType?: 'user' | 'student';
  studentInfo?: Omit<StudentInfo, 'name'>;
}

export default function ProtectedLayout({
  brandSubtitle,
  navItems,
  userInfoType = 'user',
  studentInfo,
}: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build user info based on type
  const userInfoData: UserInfo | undefined = user && userInfoType === 'user'
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      }
    : undefined;

  // Build student info
  const studentInfoData: StudentInfo | undefined = user && userInfoType === 'student' && studentInfo
    ? {
        name: `${user.firstName} ${user.lastName}`,
        ...studentInfo,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        brandName="Classivo"
        brandSubtitle={brandSubtitle}
        user={userInfoData}
        studentInfo={studentInfoData}
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
