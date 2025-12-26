import { studentNavItems } from '@/config/navigation';
import ProtectedLayout from './ProtectedLayout';

export default function StudentLayout() {
  return (
    <ProtectedLayout
      brandSubtitle="Student Portal"
      navItems={studentNavItems}
      userInfoType="student"
      studentInfo={{
        department: 'Computer Science',
        faculty: 'Science and Technology',
        studentId: 'STU-2400001',
        gpa: 3.85,
        credits: 115,
      }}
    />
  );
}
