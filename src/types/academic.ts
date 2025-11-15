import { UserRole } from './auth';

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: ExamType;
  totalMarks: number;
  passingMarks: number;
  duration: number; // in minutes
  scheduledDate: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
  isProctored: boolean;
  instructions: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ExamType = 'midterm' | 'final' | 'quiz' | 'assignment' | 'practical';

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  marks: number;
  order: number;
  createdAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_in_blank';

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  status: 'passed' | 'failed' | 'pending';
  submittedAt: string;
  answers: StudentAnswer[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  obtainedMarks: number;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  type: AnnouncementType;
  targetAudience: UserRole[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementType = 'general' | 'academic' | 'financial' | 'event' | 'emergency';