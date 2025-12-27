import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useNotificationStore,
  Notification,
  NotificationType,
  getNotificationIcon,
} from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPriorityBadge(priority: Notification['priority']) {
  switch (priority) {
    case 'urgent':
      return (
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
          High
        </span>
      );
    case 'normal':
      return null;
    case 'low':
      return (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          Low
        </span>
      );
  }
}

function getTypeBadge(type: NotificationType) {
  const labels: Record<NotificationType, { label: string; color: string }> = {
    exam_submitted: { label: 'Exam', color: 'bg-purple-100 text-purple-700' },
    question_submitted: { label: 'Question', color: 'bg-indigo-100 text-indigo-700' },
    exam_approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
    exam_rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
    question_approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
    question_rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
    exam_available: { label: 'Exam', color: 'bg-blue-100 text-blue-700' },
    exam_graded: { label: 'Graded', color: 'bg-teal-100 text-teal-700' },
    announcement: { label: 'Announcement', color: 'bg-amber-100 text-amber-700' },
    assignment_due: { label: 'Assignment', color: 'bg-rose-100 text-rose-700' },
    message: { label: 'Message', color: 'bg-sky-100 text-sky-700' },
    system: { label: 'System', color: 'bg-gray-100 text-gray-700' },
  };

  const { label, color } = labels[type];
  return (
    <span className={`px-2 py-0.5 ${color} text-xs font-medium rounded-full`}>
      {label}
    </span>
  );
}

type FilterType = 'all' | 'unread' | 'read';
type TypeFilter = 'all' | NotificationType;

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getNotificationsForUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const userRole = user?.role || 'student';
  const userId = user?.id;
  const allNotifications = getNotificationsForUser(userRole, userId);
  const unreadCount = getUnreadCount(userRole, userId);

  // Filter notifications
  const filteredNotifications = allNotifications.filter((n) => {
    // Read/Unread filter
    if (filterType === 'unread' && n.read) return false;
    if (filterType === 'read' && !n.read) return false;

    // Type filter
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const handleNavigate = (url: string) => {
    navigate(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
          {allNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['all', 'unread', 'read'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterType === type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All types</option>
              <option value="announcement">Announcements</option>
              <option value="exam_submitted">Exam Submitted</option>
              <option value="exam_approved">Exam Approved</option>
              <option value="exam_rejected">Exam Rejected</option>
              <option value="exam_available">Exam Available</option>
              <option value="exam_graded">Exam Graded</option>
              <option value="question_submitted">Question Submitted</option>
              <option value="question_approved">Question Approved</option>
              <option value="question_rejected">Question Rejected</option>
              <option value="message">Messages</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery
                ? 'No notifications match your search'
                : filterType === 'unread'
                ? "You're all caught up!"
                : 'No notifications to display'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500">{date}</h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                    >
                      <Card
                        padding="none"
                        className={`overflow-hidden ${
                          notification.read ? 'opacity-70' : ''
                        }`}
                      >
                        <div
                          className={`border-l-4 ${
                            notification.priority === 'urgent'
                              ? 'border-l-red-500'
                              : notification.priority === 'high'
                              ? 'border-l-orange-500'
                              : notification.priority === 'low'
                              ? 'border-l-gray-400'
                              : 'border-l-blue-500'
                          } p-4`}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4
                                      className={`font-medium ${
                                        notification.read
                                          ? 'text-gray-600'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {notification.title}
                                    </h4>
                                    {getTypeBadge(notification.type)}
                                    {getPriorityBadge(notification.priority)}
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {notification.message}
                                  </p>

                                  {/* Metadata */}
                                  {notification.metadata && (
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                      {notification.metadata.courseCode && (
                                        <span>
                                          Course: {notification.metadata.courseCode}
                                        </span>
                                      )}
                                      {notification.metadata.teacherName && (
                                        <span>
                                          From: {notification.metadata.teacherName}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Mark as read
                                  </button>
                                )}
                                {notification.actionUrl && (
                                  <button
                                    onClick={() => handleNavigate(notification.actionUrl!)}
                                    className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    View details
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium ml-auto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Clear Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Clear all notifications?
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowConfirmClear(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    clearAll();
                    setShowConfirmClear(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Clear all
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
