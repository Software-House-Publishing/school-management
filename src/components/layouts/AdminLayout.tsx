import { useAuthStore } from '@/stores/authStore';
import { adminNavItems, directorNavItems } from '@/config/navigation';
import ProtectedLayout from './ProtectedLayout';

export default function AdminLayout() {
  const { user } = useAuthStore();

  // Pick sidebar items based on role
  const navItems = user?.role === 'system_administrator'
    ? directorNavItems
    : adminNavItems;

  return (
    <ProtectedLayout
      brandSubtitle="Admin Portal"
      navItems={navItems}
      userInfoType="user"
    />
  );
}
