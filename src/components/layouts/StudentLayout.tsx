import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { useAuthStore } from '@/stores/authStore';
import Sidebar, { StudentInfo } from '@/components/shared/Sidebar';
import { studentNavItems } from '@/config/navigation.tsx';

export default function StudentLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get student info for sidebar card
  const studentInfo: StudentInfo | undefined = user ? {
    name: `${user.firstName} ${user.lastName}`,
    department: 'Computer Science',
    faculty: 'Science and Technology',
    studentId: 'STU-2400001',
    gpa: 3.85,
    credits: 115
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        brandName="Classivo"
        brandSubtitle="Student Portal"
        studentInfo={studentInfo}
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