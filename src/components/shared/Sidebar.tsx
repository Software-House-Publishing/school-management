import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: 'primary' | 'secondary';
}

export interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface StudentInfo {
  name: string;
  avatarUrl?: string;
  department: string;
  faculty: string;
  studentId: string;
  gpa: number;
  credits: number;
}

export interface SidebarProps {
  brandName: string;
  brandSubtitle?: string;
  user?: UserInfo;
  studentInfo?: StudentInfo;
  items: NavItem[];
  collapsed?: boolean;
  width?: number;
  onSignOut?: () => void;
  className?: string;
}

export function Sidebar({
  brandName,
  brandSubtitle,
  user,
  studentInfo,
  items,
  collapsed = false,
  onSignOut,
  className = '',
}: SidebarProps) {
  const primary = items.filter(i => (i.section ?? 'primary') === 'primary');
  const secondary = items.filter(i => (i.section ?? 'primary') === 'secondary');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isDesktop && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
        className={`fixed z-40 ${className}`}
        style={{ 
          width: collapsed ? 80 : 'var(--sidebar-width)',
          top: 'var(--sidebar-gutter)',
          left: 'var(--sidebar-gutter)',
          bottom: 'var(--sidebar-gutter)'
        }}
      >
        <div className="h-full bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/60 rounded-2xl border border-gray-200/60 flex items-center justify-center shadow-sm">
                  <span className="text-gray-800 text-base font-semibold">{brandName.slice(0,2).toUpperCase()}</span>
                </div>
                {!collapsed && (
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">{brandName}</h2>
                    {brandSubtitle && (
                      <p className="text-xs text-gray-500 font-medium">{brandSubtitle}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Student Info Card - shows when studentInfo is provided */}
            {studentInfo && !collapsed && (
              <div className="px-4 pt-4 pb-2">
                <div className="bg-white rounded-2xl border border-gray-200/60 p-3 shadow-sm">
                  {/* Avatar and Name - Horizontal Layout */}
                  <div className="flex items-center gap-3">
                    {studentInfo.avatarUrl ? (
                      <img
                        src={studentInfo.avatarUrl}
                        alt={studentInfo.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
                        {studentInfo.name}
                      </h3>
                      <p className="text-xs text-gray-500">{studentInfo.department}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-center">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 uppercase">Student ID</p>
                      <p className="text-xs font-bold text-gray-900">{studentInfo.studentId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">GPA</p>
                      <p className="text-xs font-bold text-gray-900">{studentInfo.gpa.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase">Credits</p>
                      <p className="text-xs font-bold text-gray-900">{studentInfo.credits}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular user info - shows when user is provided but NOT studentInfo */}
            {user && !studentInfo && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-gray-200/60 bg-white/60 overflow-hidden flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">{getInitials(user.name)}</span>
                    </div>
                  )}
                  {!collapsed && (
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {primary.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
                        isActive ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        collapsed ? 'justify-center' : ''
                      ].join(' ')
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`text-gray-500 ${collapsed ? '' : 'flex-shrink-0'}`}>{item.icon}</span>
                    {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {secondary.length > 0 && (
              <div className="p-4 border-t border-gray-200/50 space-y-2">
                {secondary.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (primary.length + index) * 0.05 }}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
                          isActive ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                          collapsed ? 'justify-center' : ''
                        ].join(' ')
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <span className={`text-gray-500 ${collapsed ? '' : 'flex-shrink-0'}`}>{item.icon}</span>
                      {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
                    </NavLink>
                  </motion.div>
                ))}

                {onSignOut && (
                  <motion.button
                    type="button"
                    onClick={onSignOut}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (primary.length + secondary.length) * 0.05 + 0.05 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 bg-white/70 backdrop-blur-xl border border-red-500/30 hover:border-red-400/50 hover:bg-red-500/10 group"
                    title={collapsed ? 'Sign out' : undefined}
                  >
                    {/* Glass reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                    
                    <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors relative z-10" />
                    {!collapsed && <span className="text-red-400 group-hover:text-red-300 font-medium transition-colors relative z-10">Sign out</span>}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;