import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Notification types for different events
export type NotificationType =
  | 'exam_submitted' // Teacher submitted exam for approval
  | 'question_submitted' // Teacher submitted question for approval
  | 'exam_approved' // Admin approved exam
  | 'exam_rejected' // Admin rejected exam
  | 'question_approved' // Admin approved question
  | 'question_rejected' // Admin rejected question
  | 'exam_available' // Exam is now available for student
  | 'exam_graded' // Student's exam has been graded
  | 'announcement' // General announcement
  | 'assignment_due' // Assignment due reminder
  | 'message' // Direct message
  | 'system'; // System notification

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  // Target role(s) who should see this notification
  targetRoles: string[];
  // Optional: specific user ID if notification is for one person
  targetUserId?: string;
  // Optional: link to navigate to
  actionUrl?: string;
  // Optional: additional data
  metadata?: {
    examId?: string;
    questionId?: string;
    courseCode?: string;
    courseName?: string;
    teacherName?: string;
    studentName?: string;
    announcementId?: string;
  };
}

interface NotificationStore {
  notifications: Notification[];

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;

  // Getters
  getUnreadCount: (role?: string, userId?: string) => number;
  getNotificationsForUser: (role: string, userId?: string) => Notification[];
}

// Helper to generate unique IDs
const generateId = () => `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to get priority color for toast
const getPriorityStyle = (priority: NotificationPriority) => {
  switch (priority) {
    case 'urgent':
      return { className: 'bg-red-50 border-red-200' };
    case 'high':
      return { className: 'bg-orange-50 border-orange-200' };
    case 'normal':
      return { className: 'bg-blue-50 border-blue-200' };
    case 'low':
      return { className: 'bg-gray-50 border-gray-200' };
  }
};

// Helper to get notification icon
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'exam_submitted':
    case 'question_submitted':
      return '📝';
    case 'exam_approved':
    case 'question_approved':
      return '✅';
    case 'exam_rejected':
    case 'question_rejected':
      return '❌';
    case 'exam_available':
      return '📋';
    case 'exam_graded':
      return '📊';
    case 'announcement':
      return '📢';
    case 'assignment_due':
      return '⏰';
    case 'message':
      return '💬';
    case 'system':
      return '⚙️';
    default:
      return '🔔';
  }
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));

        // Show toast notification
        const icon = getNotificationIcon(notification.type);
        const style = getPriorityStyle(notification.priority);

        toast(notification.title, {
          description: notification.message,
          icon,
          duration: notification.priority === 'urgent' ? 10000 : 5000,
          ...style,
        });
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      getUnreadCount: (role?: string, userId?: string) => {
        const { notifications } = get();
        return notifications.filter((n) => {
          if (n.read) return false;
          if (userId && n.targetUserId && n.targetUserId !== userId) return false;
          if (role && !n.targetRoles.includes(role) && !n.targetRoles.includes('all')) return false;
          return true;
        }).length;
      },

      getNotificationsForUser: (role: string, userId?: string) => {
        const { notifications } = get();
        return notifications.filter((n) => {
          // Check if notification is for this user specifically
          if (n.targetUserId && n.targetUserId !== userId) return false;
          // Check if notification is for this role
          if (!n.targetRoles.includes(role) && !n.targetRoles.includes('all')) return false;
          return true;
        });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Helper functions to create specific notification types
export const notifyExamSubmitted = (
  examTitle: string,
  teacherName: string,
  courseCode: string,
  courseName: string,
  examId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'exam_submitted',
    title: 'New Exam Pending Approval',
    message: `${teacherName} submitted "${examTitle}" for ${courseCode} - ${courseName}`,
    priority: 'normal',
    targetRoles: ['school_administrator', 'manager'],
    actionUrl: '/school-admin/exams',
    metadata: { examId, teacherName, courseCode, courseName },
  });
};

export const notifyQuestionSubmitted = (
  questionCount: number,
  teacherName: string,
  courseCode: string,
  courseName: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'question_submitted',
    title: 'New Questions Pending Approval',
    message: `${teacherName} submitted ${questionCount} question(s) for ${courseCode} - ${courseName}`,
    priority: 'normal',
    targetRoles: ['school_administrator', 'manager'],
    actionUrl: '/school-admin/exams',
    metadata: { teacherName, courseCode, courseName },
  });
};

export const notifyExamApproved = (
  examTitle: string,
  approverName: string,
  teacherId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'exam_approved',
    title: 'Exam Approved',
    message: `Your exam "${examTitle}" has been approved by ${approverName}`,
    priority: 'normal',
    targetRoles: ['teacher'],
    targetUserId: teacherId,
    actionUrl: '/teacher/exams',
    metadata: { teacherName: approverName },
  });
};

export const notifyExamRejected = (
  examTitle: string,
  approverName: string,
  reason: string,
  teacherId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'exam_rejected',
    title: 'Exam Rejected',
    message: `Your exam "${examTitle}" was rejected: ${reason}`,
    priority: 'high',
    targetRoles: ['teacher'],
    targetUserId: teacherId,
    actionUrl: '/teacher/exams',
    metadata: { teacherName: approverName },
  });
};

export const notifyQuestionApproved = (
  questionText: string,
  approverName: string,
  courseCode: string,
  teacherId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'question_approved',
    title: 'Question Approved',
    message: `Your question for ${courseCode} has been approved and added to the question pool`,
    priority: 'normal',
    targetRoles: ['teacher'],
    targetUserId: teacherId,
    actionUrl: '/teacher/exams',
    metadata: { courseCode },
  });
};

export const notifyQuestionRejected = (
  questionText: string,
  approverName: string,
  reason: string,
  courseCode: string,
  teacherId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'question_rejected',
    title: 'Question Rejected',
    message: `Your question for ${courseCode} was rejected: ${reason}`,
    priority: 'high',
    targetRoles: ['teacher'],
    targetUserId: teacherId,
    actionUrl: '/teacher/exams',
    metadata: { courseCode },
  });
};

export const notifyExamAvailable = (
  examTitle: string,
  courseCode: string,
  courseName: string,
  startTime: string,
  examId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'exam_available',
    title: 'Exam Now Available',
    message: `${examTitle} for ${courseCode} is now available. Good luck!`,
    priority: 'high',
    targetRoles: ['student'],
    actionUrl: '/student/exams',
    metadata: { examId, courseCode, courseName },
  });
};

export const notifyExamGraded = (
  examTitle: string,
  courseCode: string,
  score: number,
  maxScore: number,
  studentId: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'exam_graded',
    title: 'Exam Graded',
    message: `Your ${examTitle} for ${courseCode} has been graded: ${score}/${maxScore}`,
    priority: 'normal',
    targetRoles: ['student'],
    targetUserId: studentId,
    actionUrl: '/student/exams',
    metadata: { courseCode },
  });
};

export const notifyAnnouncement = (
  title: string,
  message: string,
  targetRoles: string[],
  announcementId?: string,
  courseCode?: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'announcement',
    title: title,
    message: message,
    priority: 'normal',
    targetRoles,
    metadata: { announcementId, courseCode },
  });
};

// Initialize with some demo notifications
export const initializeDemoNotifications = () => {
  const store = useNotificationStore.getState();

  // Only add if no notifications exist
  if (store.notifications.length === 0) {
    // For school admin
    store.addNotification({
      type: 'exam_submitted',
      title: 'New Exam Pending Approval',
      message: 'David Smith submitted "Final Exam - Linear Algebra" for MATH201',
      priority: 'normal',
      targetRoles: ['school_administrator', 'manager'],
      actionUrl: '/school-admin/exams',
      metadata: { examId: 'exam-6', teacherName: 'David Smith', courseCode: 'MATH201', courseName: 'Linear Algebra' },
    });

    store.addNotification({
      type: 'question_submitted',
      title: 'New Questions Pending Approval',
      message: 'Sarah Johnson submitted 3 questions for ENG101 - English Literature',
      priority: 'normal',
      targetRoles: ['school_administrator', 'manager'],
      actionUrl: '/school-admin/exams',
      metadata: { teacherName: 'Sarah Johnson', courseCode: 'ENG101', courseName: 'English Literature' },
    });

    // For teachers
    store.addNotification({
      type: 'exam_approved',
      title: 'Exam Approved',
      message: 'Your exam "Calculus I Final Exam" has been approved by Dr. Robert Brown',
      priority: 'normal',
      targetRoles: ['teacher'],
      actionUrl: '/teacher/exams',
    });

    // For students
    store.addNotification({
      type: 'exam_available',
      title: 'Exam Now Available',
      message: 'Calculus I Final Exam is now available. Good luck!',
      priority: 'high',
      targetRoles: ['student'],
      actionUrl: '/student/exams',
      metadata: { examId: 'exam-2', courseCode: 'MATH101', courseName: 'Calculus I' },
    });

    store.addNotification({
      type: 'announcement',
      title: 'School Holiday Notice',
      message: 'The school will be closed from December 31st to January 2nd for New Year celebrations.',
      priority: 'normal',
      targetRoles: ['student', 'teacher', 'school_administrator'],
    });
  }
};
