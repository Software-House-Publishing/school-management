import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useNotificationStore,
  Notification,
  getNotificationIcon,
} from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getPriorityColor(priority: Notification['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-500 bg-red-50/50';
    case 'high':
      return 'border-l-orange-500 bg-orange-50/50';
    case 'normal':
      return 'border-l-blue-500 bg-blue-50/50';
    case 'low':
      return 'border-l-gray-400 bg-gray-50/50';
  }
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (url: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onNavigate,
}: NotificationItemProps) {
  const icon = getNotificationIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`relative border-l-4 ${getPriorityColor(notification.priority)} ${
        notification.read ? 'opacity-60' : ''
      } rounded-r-lg p-3 hover:bg-gray-50 transition-colors group`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-medium ${
                notification.read ? 'text-gray-600' : 'text-gray-900'
              } line-clamp-1`}
            >
              {notification.title}
            </h4>
            <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {notification.message}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium"
              >
                <Check className="w-3 h-3" />
                Mark read
              </button>
            )}
            {notification.actionUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(notification.actionUrl!);
                }}
                className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <ExternalLink className="w-3 h-3" />
                View
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-600 font-medium ml-auto"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
    </motion.div>
  );
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getNotificationsForUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const userRole = user?.role || 'student';
  const userId = user?.id;
  const notifications = getNotificationsForUser(userRole, userId);
  const unreadCount = getUnreadCount(userRole, userId);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNavigate = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/60 border border-gray-200/60 hover:bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-sm"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">
                    No notifications yet
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    We'll notify you when something arrives
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {notifications.slice(0, 10).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page based on role
                    if (userRole === 'student') {
                      navigate('/student/notifications');
                    } else if (userRole === 'teacher') {
                      navigate('/teacher/notifications');
                    } else {
                      navigate('/school-admin/notifications');
                    }
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
