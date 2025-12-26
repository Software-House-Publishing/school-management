import { teacherNavItems } from '@/config/navigation';
import ProtectedLayout from './ProtectedLayout';

export default function TeacherLayout() {
  return (
    <ProtectedLayout
      brandSubtitle="Teacher Portal"
      navItems={teacherNavItems}
      userInfoType="user"
    />
  );
}
