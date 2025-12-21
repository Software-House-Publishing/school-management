import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  User,
  Users,
  CreditCard,
  Award,
  Megaphone,
  LogOut,
  X
} from 'lucide-react';
// Use unified stores to ensure consistent state across the app
import { useAuthStore } from '../../state/authStore';
import { useAppStore } from '../../state/appStore';
import { UserRole } from '../../types';
import { ROUTES } from '../../utils/routes';
import { cn } from '../../utils';
import ClassivoLogoIcon from '../icons/ClassivoLogoIcon';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: UserRole[];
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  // Align with app store API (uses sidebarCollapsed instead of sidebarOpen)
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const schoolLabel = t('app.schoolName', 'Classivo');

  // Determine current portal context from URL to avoid cross-portal duplicates
  const portalPrefix = React.useMemo(() => {
    const pathname = location.pathname || '';
    if (pathname.startsWith('/student')) return '/student';
    if (pathname.startsWith('/teacher')) return '/teacher';
    if (pathname.startsWith('/admin')) return '/admin';
    return '';
  }, [location.pathname]);

  // Detect desktop viewport to keep sidebar visible regardless of sidebarOpen
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    // Add/remove listener with cross-browser support
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  const navigationItems: NavItem[] = [
    // Student navigation
    {
      id: 'student-dashboard',
      label: t('navigation.dashboard'),
      icon: Home,
      path: ROUTES.STUDENT.DASHBOARD,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-courses',
      label: t('navigation.courses'),
      icon: BookOpen,
      path: ROUTES.STUDENT.COURSES,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-schedule',
      label: t('navigation.schedule'),
      icon: Calendar,
      path: ROUTES.STUDENT.SCHEDULE,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-exams',
      label: t('navigation.exams'),
      icon: FileText,
      path: ROUTES.STUDENT.EXAMS,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-fees',
      label: t('navigation.fees', 'Fees'),
      icon: CreditCard,
      path: ROUTES.STUDENT.FEES,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-certifications',
      label: t('navigation.certifications', 'Certifications'),
      icon: Award,
      path: ROUTES.STUDENT.CERTIFICATIONS,
      roles: [UserRole.STUDENT]
    },
    {
      id: 'student-announcements',
      label: t('navigation.announcements', 'Announcements'),
      icon: Megaphone,
      path: ROUTES.STUDENT.ANNOUNCEMENTS,
      roles: [UserRole.STUDENT]
    },

    // Teacher navigation
    {
      id: 'teacher-dashboard',
      label: t('navigation.dashboard'),
      icon: Home,
      path: ROUTES.TEACHER.DASHBOARD,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },
    {
      id: 'teacher-courses',
      label: t('navigation.courses'),
      icon: BookOpen,
      path: ROUTES.TEACHER.COURSES,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },
    {
      id: 'teacher-students',
      label: t('navigation.students', 'Students'),
      icon: Users,
      path: ROUTES.TEACHER.STUDENTS,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },
    {
      id: 'teacher-schedule',
      label: t('navigation.schedule'),
      icon: Calendar,
      path: ROUTES.TEACHER.SCHEDULE,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },
    {
      id: 'teacher-exams',
      label: t('navigation.exams'),
      icon: FileText,
      path: ROUTES.TEACHER.EXAMS,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },
    {
      id: 'teacher-announcements',
      label: t('navigation.announcements', 'Announcements'),
      icon: Megaphone,
      path: ROUTES.TEACHER.ANNOUNCEMENTS,
      roles: [UserRole.TEACHER, UserRole.ADMIN]
    },

  ];

  // Admin navigation
  navigationItems.push(
    {
      id: 'admin-dashboard',
      label: t('navigation.dashboard'),
      icon: Home,
      path: ROUTES.ADMIN.DASHBOARD,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-users',
      label: 'Users',
      icon: Users,
      path: ROUTES.ADMIN.USERS,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-courses',
      label: t('navigation.courses'),
      icon: BookOpen,
      path: ROUTES.ADMIN.COURSES,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-exams',
      label: t('navigation.exams'),
      icon: FileText,
      path: ROUTES.ADMIN.EXAMS,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-schedule',
      label: t('navigation.schedule'),
      icon: Calendar,
      path: ROUTES.ADMIN.SCHEDULE,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-finances',
      label: t('navigation.finances', 'Finances'),
      icon: CreditCard,
      path: ROUTES.ADMIN.FINANCES,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    },
    {
      id: 'admin-announcements',
      label: t('navigation.announcements', 'Announcements'),
      icon: Megaphone,
      path: ROUTES.ADMIN.ANNOUNCEMENTS,
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
    }
  );

  const bottomNavigationItems: NavItem[] = [
    {
      id: 'profile',
      label: t('navigation.profile'),
      icon: User,
      // Route to the profile page within the current portal context
      path: portalPrefix === '/student'
        ? ROUTES.STUDENT.PROFILE
        : portalPrefix === '/teacher'
          ? ROUTES.TEACHER.PROFILE
          : ROUTES.ADMIN.PROFILE,
      roles: [UserRole.STUDENT, UserRole.TEACHER, UserRole.EMPLOYEE, UserRole.ADMIN]
    },
  ];

  // Filter by role AND current portal prefix to prevent duplicates for admin
  const filteredNavItems = navigationItems.filter(item => {
    if (!user?.role) return false;
    const roleMatch = item.roles.includes(user.role);
    const portalMatch = portalPrefix ? item.path.startsWith(portalPrefix) : true;
    return roleMatch && portalMatch;
  });

  const filteredBottomNavItems = bottomNavigationItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleCloseSidebar = () => {
    // Collapse sidebar on mobile
    setSidebarCollapsed(true);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!isDesktop && !sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
            onClick={handleCloseSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: isDesktop ? 0 : (!sidebarCollapsed ? 0 : -300),
          opacity: isDesktop ? 1 : (!sidebarCollapsed ? 1 : 0)
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        }}
        className={cn(
          "fixed top-4 left-4 bottom-4 z-40 w-72",
          // Keep sidebar fixed on desktop too so it doesn't push content down
          "lg:translate-x-0 lg:opacity-100",
          "transition-all duration-300 ease-out"
        )}
      >
        {/* Glass Card Container */}
        <div className="h-full bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-18 h-18 bg-white/60 rounded-2xl border border-gray-200/60 flex items-center justify-center shadow-sm shadow-black/10">
                  <ClassivoLogoIcon className="w-16 h-16 object-contain" alt="Classivo" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-1000 text-xl">
                    {schoolLabel}
                  </h2>
                  <p className="text-xs text-gray-500 capitalize font-medium">
                    {user.role} Portal
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseSidebar}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <X className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
              </button>
            </div>

            {/* User info */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-200/60 bg-white/60 overflow-hidden flex items-center justify-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">
                      {(user.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {filteredNavItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={handleCloseSidebar}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                        active
                          ? "bg-white text-gray-900 shadow-sm shadow-black/5 border border-gray-200/60"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-all duration-200",
                        active ? "text-gray-700" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                      <span className="relative z-10">{item.label}</span>

                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-white/60 rounded-2xl"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom navigation */}
            <div className="p-4 border-t border-gray-200/50 space-y-2">
              {filteredBottomNavItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (filteredNavItems.length + index) * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={handleCloseSidebar}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                        active
                          ? "bg-white text-gray-900 shadow-sm shadow-black/5 border border-gray-200/60"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-all duration-200",
                        active ? "text-gray-700" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                      <span className="relative z-10">{item.label}</span>

                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeIndicatorBottom"
                          className="absolute inset-0 bg-white/60 rounded-2xl"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}

              {/* Sign out button */}
              <motion.button
                type="button"
                onClick={async () => {
                  try {
                    // Use Supabase-backed signOut for consistency
                    await signOut?.();
                  } finally {
                    handleCloseSidebar();
                    navigate('/login');
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (filteredNavItems.length + filteredBottomNavItems.length) * 0.05 + 0.05 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5 text-gray-500" />
                {t('navigation.signOut', 'Sign out')}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
