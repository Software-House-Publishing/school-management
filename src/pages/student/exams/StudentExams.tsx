import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  GraduationCap,
  Clock,
  Calendar,
  MapPin,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Timer,
  Lock,
  Unlock,
  FileText,
  AlertTriangle,
  Check,
  Send,
  Eye,
  BookOpen,
} from 'lucide-react';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Mock student exam data - only approved exams are visible to students
interface StudentExam {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment';
  title: string;
  date: string;
  startTime: string;
  duration: number;
  location: string;
  maxScore: number;
  status: 'upcoming' | 'available' | 'in_progress' | 'submitted' | 'graded';
  // For time-based visibility
  availableAt: string; // ISO datetime when exam becomes available
  endsAt: string; // ISO datetime when exam ends
  // Results (if graded)
  score?: number;
  feedback?: string;
  gradedAt?: string;
  // Questions (only visible when taking exam)
  questions?: ExamQuestion[];
  // Attempt tracking
  attemptStartedAt?: string;
  attemptSubmittedAt?: string;
}

interface ExamQuestion {
  id: string;
  questionText: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  points: number;
  options?: { id: string; text: string }[];
  answer?: string; // Student's answer
}

// Mock data
const mockStudentExams: StudentExam[] = [
  {
    id: 'exam-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    examType: 'final',
    title: 'Final Examination',
    date: '2024-12-28',
    startTime: '09:00',
    duration: 180,
    location: 'Exam Hall A',
    maxScore: 100,
    status: 'available',
    availableAt: '2024-12-28T09:00:00',
    endsAt: '2024-12-28T12:00:00',
    questions: [
      {
        id: 'q1',
        questionText: 'What is the derivative of f(x) = x³ + 2x² - 5x + 3?',
        type: 'multiple_choice',
        points: 10,
        options: [
          { id: 'a', text: '3x² + 4x - 5' },
          { id: 'b', text: '3x² + 4x + 5' },
          { id: 'c', text: 'x² + 4x - 5' },
          { id: 'd', text: '3x² + 2x - 5' },
        ],
      },
      {
        id: 'q2',
        questionText: 'Evaluate the limit: lim(x→0) (sin x)/x',
        type: 'multiple_choice',
        points: 10,
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '∞' },
          { id: 'd', text: 'Does not exist' },
        ],
      },
      {
        id: 'q3',
        questionText: 'Find the integral: ∫(2x + 3)dx',
        type: 'short_answer',
        points: 15,
      },
      {
        id: 'q4',
        questionText: 'The derivative of a constant is always zero.',
        type: 'true_false',
        points: 5,
      },
      {
        id: 'q5',
        questionText: 'Explain the concept of continuity at a point. Include the three conditions that must be satisfied for a function to be continuous at x = a.',
        type: 'essay',
        points: 20,
      },
    ],
  },
  {
    id: 'exam-2',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    examType: 'quiz',
    title: 'Quiz 3 - Eigenvalues',
    date: '2024-12-20',
    startTime: '11:00',
    duration: 30,
    location: 'SM305',
    maxScore: 25,
    status: 'graded',
    availableAt: '2024-12-20T11:00:00',
    endsAt: '2024-12-20T11:30:00',
    score: 22,
    feedback: 'Excellent work! Minor calculation error on question 2.',
    gradedAt: '2024-12-21T14:00:00',
    attemptSubmittedAt: '2024-12-20T11:28:00',
  },
  {
    id: 'exam-3',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    examType: 'midterm',
    title: 'Midterm Examination',
    date: '2024-10-15',
    startTime: '09:00',
    duration: 120,
    location: 'Exam Hall A',
    maxScore: 100,
    status: 'graded',
    availableAt: '2024-10-15T09:00:00',
    endsAt: '2024-10-15T11:00:00',
    score: 85,
    feedback: 'Good understanding of core concepts. Work on showing more steps in proofs.',
    gradedAt: '2024-10-18T10:00:00',
    attemptSubmittedAt: '2024-10-15T10:45:00',
  },
  {
    id: 'exam-4',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    section: 'A',
    examType: 'final',
    title: 'Final Examination',
    date: '2024-12-30',
    startTime: '14:00',
    duration: 180,
    location: 'Exam Hall C',
    maxScore: 100,
    status: 'upcoming',
    availableAt: '2024-12-30T14:00:00',
    endsAt: '2024-12-30T17:00:00',
  },
  {
    id: 'exam-5',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    examType: 'final',
    title: 'Final Examination',
    date: '2025-01-05',
    startTime: '09:00',
    duration: 180,
    location: 'Exam Hall B',
    maxScore: 100,
    status: 'upcoming',
    availableAt: '2025-01-05T09:00:00',
    endsAt: '2025-01-05T12:00:00',
  },
];

const examTypeColors = {
  quiz: 'bg-indigo-50 text-indigo-700',
  midterm: 'bg-orange-50 text-orange-700',
  final: 'bg-red-50 text-red-700',
  assignment: 'bg-teal-50 text-teal-700',
};

const statusColors = {
  upcoming: 'bg-gray-100 text-gray-600',
  available: 'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-amber-50 text-amber-700',
  submitted: 'bg-blue-50 text-blue-700',
  graded: 'bg-purple-50 text-purple-700',
};

const statusLabels = {
  upcoming: 'Upcoming',
  available: 'Available Now',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  graded: 'Graded',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function formatDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getTimeRemaining(endsAt: string): string {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Time expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m ${seconds}s remaining`;
}

function getCountdownToStart(availableAt: string): string {
  const now = new Date();
  const start = new Date(availableAt);
  const diff = start.getTime() - now.getTime();

  if (diff <= 0) return 'Now available';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h until start`;
  if (hours > 0) return `${hours}h ${minutes}m until start`;
  return `${minutes}m until start`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAKE EXAM VIEW - Full screen exam taking interface
───────────────────────────────────────────────────────────────────────────── */
function TakeExamView({
  exam,
  onSubmit,
  onExit,
}: {
  exam: StudentExam;
  onSubmit: (answers: Record<string, string>) => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const questions = exam.questions || [];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(exam.endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [exam.endsAt]);

  const answeredCount = Object.keys(answers).filter(k => answers[k]).length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{exam.title}</h1>
            <p className="text-sm text-gray-500">{exam.courseCode} - {exam.courseName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
              <Timer className="h-5 w-5" />
              <span className="font-mono font-medium">{timeRemaining}</span>
            </div>
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Progress</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {answeredCount} of {questions.length} answered
            </p>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-2">Questions</p>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={cn(
                  'w-full aspect-square rounded-lg text-sm font-medium transition-colors flex items-center justify-center',
                  currentQuestion === idx
                    ? 'bg-blue-600 text-white'
                    : answers[q.id]
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded bg-emerald-100" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <div className="w-3 h-3 rounded bg-gray-100" />
              <span>Not answered</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {question && (
              <Card className="rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {question.points} points
                  </span>
                </div>

                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  {question.questionText}
                </h2>

                {/* Multiple Choice */}
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(question.id, option.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors',
                          answers[question.id] === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                          answers[question.id] === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        )}>
                          {answers[question.id] === option.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-gray-900">{option.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.type === 'true_false' && (
                  <div className="flex gap-4">
                    {['true', 'false'].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(question.id, value)}
                        className={cn(
                          'flex-1 py-4 rounded-xl border-2 font-medium capitalize transition-colors',
                          answers[question.id] === value
                            ? value === 'true'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {question.type === 'short_answer' && (
                  <input
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none"
                  />
                )}

                {/* Essay */}
                {question.type === 'essay' && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    placeholder="Write your answer here..."
                    rows={8}
                    className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none resize-none"
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === questions.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Submit Exam?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  You have answered {answeredCount} of {questions.length} questions.
                  {answeredCount < questions.length && (
                    <span className="text-amber-600 font-medium">
                      {' '}You still have {questions.length - answeredCount} unanswered questions.
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Once submitted, you cannot change your answers.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXAM RESULT MODAL - View graded exam results
───────────────────────────────────────────────────────────────────────────── */
function ExamResultModal({
  exam,
  onClose,
}: {
  exam: StudentExam;
  onClose: () => void;
}) {
  const percentage = exam.score && exam.maxScore ? Math.round((exam.score / exam.maxScore) * 100) : 0;

  const getGradeColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-600';
    if (pct >= 80) return 'text-blue-600';
    if (pct >= 70) return 'text-amber-600';
    if (pct >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (pct: number) => {
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
            <p className="text-sm text-gray-500">{exam.courseCode} - {exam.courseName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Score Display */}
          <div className="text-center mb-6">
            <div className={cn('text-6xl font-bold', getGradeColor(percentage))}>
              {exam.score}/{exam.maxScore}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={cn('text-2xl font-bold', getGradeColor(percentage))}>
                {percentage}%
              </span>
              <span className="text-gray-400">|</span>
              <span className={cn('text-2xl font-bold', getGradeColor(percentage))}>
                Grade: {getGradeLetter(percentage)}
              </span>
            </div>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Exam Date</span>
              </div>
              <div className="font-medium text-gray-900">{formatDate(exam.date)}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs">Graded On</span>
              </div>
              <div className="font-medium text-gray-900">
                {exam.gradedAt ? formatDateTime(exam.gradedAt) : '-'}
              </div>
            </Card>
          </div>

          {/* Feedback */}
          {exam.feedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Instructor Feedback</p>
                  <p className="text-sm text-blue-700 mt-1">{exam.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function StudentExams() {
  const [exams, setExams] = useState(mockStudentExams);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'available' | 'graded'>('all');
  const [takingExam, setTakingExam] = useState<StudentExam | null>(null);
  const [viewingResult, setViewingResult] = useState<StudentExam | null>(null);

  const filteredExams = useMemo(() => {
    if (filter === 'all') return exams;
    if (filter === 'upcoming') return exams.filter(e => e.status === 'upcoming');
    if (filter === 'available') return exams.filter(e => e.status === 'available' || e.status === 'in_progress');
    if (filter === 'graded') return exams.filter(e => e.status === 'graded' || e.status === 'submitted');
    return exams;
  }, [exams, filter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: exams.length,
      upcoming: exams.filter(e => e.status === 'upcoming').length,
      available: exams.filter(e => e.status === 'available').length,
      graded: exams.filter(e => e.status === 'graded').length,
      avgScore: exams.filter(e => e.score !== undefined).length > 0
        ? Math.round(
            exams.filter(e => e.score !== undefined)
              .reduce((sum, e) => sum + ((e.score! / e.maxScore) * 100), 0) /
            exams.filter(e => e.score !== undefined).length
          )
        : 0,
    };
  }, [exams]);

  const handleStartExam = (exam: StudentExam) => {
    setTakingExam(exam);
  };

  const handleSubmitExam = (answers: Record<string, string>) => {
    // In a real app, this would submit to the backend
    console.log('Submitting answers:', answers);
    setExams(prev => prev.map(e => {
      if (e.id === takingExam?.id) {
        return {
          ...e,
          status: 'submitted' as const,
          attemptSubmittedAt: new Date().toISOString(),
        };
      }
      return e;
    }));
    setTakingExam(null);
    alert('Exam submitted successfully! You will receive your grade once the instructor has reviewed your responses.');
  };

  // If taking an exam, show full-screen exam view
  if (takingExam) {
    return (
      <TakeExamView
        exam={takingExam}
        onSubmit={handleSubmitExam}
        onExit={() => setTakingExam(null)}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Exams</h1>
        <p className="mt-2 text-sm text-gray-600">
          View upcoming exams, take available tests, and check your results
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-6">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Total Exams</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Upcoming</span>
          </div>
          <div className="text-2xl font-bold text-gray-600">{stats.upcoming}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Unlock className="h-4 w-4" />
            <span className="text-xs">Available Now</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.available}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Graded</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.graded}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs">Average Score</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.avgScore}%</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          {(['all', 'upcoming', 'available', 'graded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                filter === f
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {f === 'all' ? 'All Exams' : f}
            </button>
          ))}
        </div>

        {/* Exam List */}
        <div className="divide-y">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50"
            >
              <div className={cn('p-3 rounded-xl', examTypeColors[exam.examType])}>
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{exam.title}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColors[exam.status])}>
                    {statusLabels[exam.status]}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span>{exam.courseCode} (Section {exam.section})</span>
                  <span className="capitalize">{exam.examType}</span>
                </div>
              </div>

              <div className="text-right text-sm">
                <div className="font-medium text-gray-900">{formatDate(exam.date)}</div>
                <div className="text-gray-500">{formatTime(exam.startTime)} • {exam.duration}min</div>
              </div>

              <div className="text-right min-w-[100px]">
                {exam.status === 'graded' && exam.score !== undefined && (
                  <div className="text-lg font-bold text-emerald-600">
                    {exam.score}/{exam.maxScore}
                  </div>
                )}
                {exam.status === 'upcoming' && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>{getCountdownToStart(exam.availableAt)}</span>
                  </div>
                )}
              </div>

              <div>
                {exam.status === 'available' && (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </button>
                )}
                {exam.status === 'graded' && (
                  <button
                    onClick={() => setViewingResult(exam)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                )}
                {exam.status === 'submitted' && (
                  <span className="px-3 py-2 text-sm text-blue-600 font-medium">
                    Awaiting Grade
                  </span>
                )}
                {exam.status === 'upcoming' && (
                  <span className="text-gray-400">
                    <ChevronRight className="h-5 w-5" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No exams found</p>
          </div>
        )}
      </Card>

      {/* Result Modal */}
      {viewingResult && (
        <ExamResultModal
          exam={viewingResult}
          onClose={() => setViewingResult(null)}
        />
      )}
    </div>
  );
}
