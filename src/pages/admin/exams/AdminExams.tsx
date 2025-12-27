import React, {
  useMemo,
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Search,
  Calendar,
  Users,
  FileText,
  GraduationCap,
  ChevronRight,
  X,
  Sparkles,
  BookCheck,
  Bell,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  notifyQuestionApproved,
  notifyQuestionRejected,
  notifyExamApproved,
  notifyExamRejected,
} from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type QuestionStatus = 'new' | 'old';
type QuestionType = 'multiple-choice' | 'short-answer' | 'essay' | 'true_false';
type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  points: number;
  courseCode: string;
  createdBy: string;
  createdAt: string;
  approvalStatus?: ApprovalStatus;
  options?: QuestionOption[];
  correctAnswer?: string;
}

interface PendingQuestion extends Question {
  approvalStatus: 'pending';
  teacherName: string;
  submittedAt: string;
}

type ExamApprovalStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string;
}

interface Exam {
  id: string;
  name: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  questionCount: number;
  totalPoints: number;
  approvalStatus: ExamApprovalStatus;
  submittedAt?: string;
  section: string;
  questions?: ExamQuestion[];
}

interface CourseExamsData {
  code: string;
  title: string;
  lecturer: string;
  questions: Question[];
  exams: Exam[];
}

// Mock data for pending items
const pendingQuestions: PendingQuestion[] = [
  {
    id: 'PQ001',
    text: 'Prove that the derivative of e^x is e^x using the limit definition.',
    type: 'essay',
    difficulty: 'Hard',
    status: 'new',
    points: 15,
    courseCode: 'MATH101',
    createdBy: 'David Smith',
    createdAt: '2024-12-26T10:00:00',
    approvalStatus: 'pending',
    teacherName: 'David Smith',
    submittedAt: '2024-12-26T10:00:00',
  },
  {
    id: 'PQ002',
    text: 'What is the derivative of sin(x^2)?',
    type: 'multiple-choice',
    difficulty: 'Medium',
    status: 'new',
    points: 5,
    courseCode: 'MATH101',
    createdBy: 'David Smith',
    createdAt: '2024-12-26T11:00:00',
    approvalStatus: 'pending',
    teacherName: 'David Smith',
    submittedAt: '2024-12-26T11:00:00',
  },
  {
    id: 'PQ003',
    text: 'The rank of a matrix equals the number of non-zero rows in its row echelon form.',
    type: 'true_false',
    difficulty: 'Easy',
    status: 'new',
    points: 3,
    courseCode: 'MATH201',
    createdBy: 'David Smith',
    createdAt: '2024-12-27T09:00:00',
    approvalStatus: 'pending',
    teacherName: 'David Smith',
    submittedAt: '2024-12-27T09:00:00',
  },
];

const pendingExams: Exam[] = [
  {
    id: 'PE001',
    name: 'Final Examination',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    teacherName: 'David Smith',
    date: '2024-12-30',
    startTime: '11:00',
    durationMinutes: 180,
    questionCount: 25,
    totalPoints: 100,
    approvalStatus: 'pending_approval',
    submittedAt: '2024-12-25T10:00:00',
    section: 'A',
    questions: [
      {
        id: 'EQ001',
        questionNumber: 1,
        text: 'Find the determinant of the matrix A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]].',
        type: 'short-answer',
        difficulty: 'Medium',
        points: 4,
        correctAnswer: '0',
      },
      {
        id: 'EQ002',
        questionNumber: 2,
        text: 'Which of the following is an eigenvalue of the identity matrix I?',
        type: 'multiple-choice',
        difficulty: 'Easy',
        points: 3,
        options: [
          { id: 'a', text: '0', isCorrect: false },
          { id: 'b', text: '1', isCorrect: true },
          { id: 'c', text: '-1', isCorrect: false },
          { id: 'd', text: '2', isCorrect: false },
        ],
      },
      {
        id: 'EQ003',
        questionNumber: 3,
        text: 'The rank of a matrix equals the number of non-zero rows in its row echelon form.',
        type: 'true_false',
        difficulty: 'Easy',
        points: 2,
        correctAnswer: 'True',
      },
      {
        id: 'EQ004',
        questionNumber: 4,
        text: 'Prove that the set of all 2x2 symmetric matrices forms a vector space under matrix addition and scalar multiplication.',
        type: 'essay',
        difficulty: 'Hard',
        points: 10,
      },
      {
        id: 'EQ005',
        questionNumber: 5,
        text: 'Calculate the inverse of matrix B = [[2, 1], [5, 3]].',
        type: 'short-answer',
        difficulty: 'Medium',
        points: 5,
        correctAnswer: '[[3, -1], [-5, 2]]',
      },
      {
        id: 'EQ006',
        questionNumber: 6,
        text: 'A matrix A is invertible if and only if its determinant is:',
        type: 'multiple-choice',
        difficulty: 'Easy',
        points: 3,
        options: [
          { id: 'a', text: 'Zero', isCorrect: false },
          { id: 'b', text: 'Positive', isCorrect: false },
          { id: 'c', text: 'Non-zero', isCorrect: true },
          { id: 'd', text: 'Negative', isCorrect: false },
        ],
      },
      {
        id: 'EQ007',
        questionNumber: 7,
        text: 'Every square matrix can be diagonalized.',
        type: 'true_false',
        difficulty: 'Medium',
        points: 2,
        correctAnswer: 'False',
      },
      {
        id: 'EQ008',
        questionNumber: 8,
        text: 'Find all eigenvalues of the matrix C = [[4, 2], [1, 3]].',
        type: 'short-answer',
        difficulty: 'Medium',
        points: 5,
        correctAnswer: '5, 2',
      },
      {
        id: 'EQ009',
        questionNumber: 9,
        text: 'Explain the geometric interpretation of matrix multiplication as a linear transformation.',
        type: 'essay',
        difficulty: 'Hard',
        points: 8,
      },
      {
        id: 'EQ010',
        questionNumber: 10,
        text: 'The null space of a matrix A is a subspace of which space?',
        type: 'multiple-choice',
        difficulty: 'Medium',
        points: 3,
        options: [
          { id: 'a', text: 'Row space of A', isCorrect: false },
          { id: 'b', text: 'Column space of A', isCorrect: false },
          { id: 'c', text: 'Domain of A', isCorrect: true },
          { id: 'd', text: 'Range of A', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'PE002',
    name: 'Quiz 5 - Integration',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    teacherName: 'David Smith',
    date: '2025-01-08',
    startTime: '09:00',
    durationMinutes: 45,
    questionCount: 10,
    totalPoints: 30,
    approvalStatus: 'pending_approval',
    submittedAt: '2024-12-27T14:00:00',
    section: 'A',
    questions: [
      {
        id: 'QQ001',
        questionNumber: 1,
        text: 'Evaluate the integral: ∫ x² dx',
        type: 'short-answer',
        difficulty: 'Easy',
        points: 3,
        correctAnswer: 'x³/3 + C',
      },
      {
        id: 'QQ002',
        questionNumber: 2,
        text: 'What is the integral of sin(x)?',
        type: 'multiple-choice',
        difficulty: 'Easy',
        points: 2,
        options: [
          { id: 'a', text: 'cos(x) + C', isCorrect: false },
          { id: 'b', text: '-cos(x) + C', isCorrect: true },
          { id: 'c', text: 'sin(x) + C', isCorrect: false },
          { id: 'd', text: '-sin(x) + C', isCorrect: false },
        ],
      },
      {
        id: 'QQ003',
        questionNumber: 3,
        text: 'The integral of e^x is e^x + C.',
        type: 'true_false',
        difficulty: 'Easy',
        points: 2,
        correctAnswer: 'True',
      },
      {
        id: 'QQ004',
        questionNumber: 4,
        text: 'Evaluate using substitution: ∫ 2x·cos(x²) dx',
        type: 'short-answer',
        difficulty: 'Medium',
        points: 4,
        correctAnswer: 'sin(x²) + C',
      },
      {
        id: 'QQ005',
        questionNumber: 5,
        text: 'Find the integral: ∫ 1/(1+x²) dx',
        type: 'multiple-choice',
        difficulty: 'Medium',
        points: 3,
        options: [
          { id: 'a', text: 'ln(1+x²) + C', isCorrect: false },
          { id: 'b', text: 'arctan(x) + C', isCorrect: true },
          { id: 'c', text: 'arcsin(x) + C', isCorrect: false },
          { id: 'd', text: '1/x + C', isCorrect: false },
        ],
      },
      {
        id: 'QQ006',
        questionNumber: 6,
        text: 'Explain the Fundamental Theorem of Calculus and its significance.',
        type: 'essay',
        difficulty: 'Hard',
        points: 6,
      },
      {
        id: 'QQ007',
        questionNumber: 7,
        text: 'Evaluate the definite integral: ∫₀¹ x³ dx',
        type: 'short-answer',
        difficulty: 'Easy',
        points: 3,
        correctAnswer: '1/4',
      },
      {
        id: 'QQ008',
        questionNumber: 8,
        text: 'Integration by parts is based on the product rule for differentiation.',
        type: 'true_false',
        difficulty: 'Easy',
        points: 2,
        correctAnswer: 'True',
      },
      {
        id: 'QQ009',
        questionNumber: 9,
        text: 'Which technique would you use for ∫ x·e^x dx?',
        type: 'multiple-choice',
        difficulty: 'Medium',
        points: 2,
        options: [
          { id: 'a', text: 'U-substitution', isCorrect: false },
          { id: 'b', text: 'Integration by parts', isCorrect: true },
          { id: 'c', text: 'Partial fractions', isCorrect: false },
          { id: 'd', text: 'Trigonometric substitution', isCorrect: false },
        ],
      },
      {
        id: 'QQ010',
        questionNumber: 10,
        text: 'Evaluate: ∫ ln(x) dx using integration by parts.',
        type: 'short-answer',
        difficulty: 'Hard',
        points: 3,
        correctAnswer: 'x·ln(x) - x + C',
      },
    ],
  },
];

const initialCourses: CourseExamsData[] = [
  {
    code: 'MATH101',
    title: 'Mathematics',
    lecturer: 'Dr. John Smith',
    questions: [
      {
        id: 'Q001',
        text: 'What is 2 + 2?',
        type: 'multiple-choice',
        difficulty: 'Easy',
        status: 'old',
        points: 5,
        courseCode: 'MATH101',
        createdBy: 'Admin',
        createdAt: '2024-01-10',
        approvalStatus: 'approved',
      },
      {
        id: 'Q002',
        text: 'Solve: 2x + 5 = 13',
        type: 'short-answer',
        difficulty: 'Medium',
        status: 'old',
        points: 10,
        courseCode: 'MATH101',
        createdBy: 'Admin',
        createdAt: '2024-01-10',
        approvalStatus: 'approved',
      },
      {
        id: 'Q003',
        text: 'What is calculus?',
        type: 'essay',
        difficulty: 'Hard',
        status: 'new',
        points: 20,
        courseCode: 'MATH101',
        createdBy: 'David Smith',
        createdAt: '2024-12-15',
        approvalStatus: 'approved',
      },
    ],
    exams: [
      {
        id: 'EXAM001',
        name: 'Mathematics Mid-Term',
        courseCode: 'MATH101',
        courseName: 'Mathematics',
        teacherName: 'Dr. John Smith',
        date: '2025-01-15',
        startTime: '09:00',
        durationMinutes: 120,
        questionCount: 20,
        totalPoints: 100,
        approvalStatus: 'approved',
        section: 'A',
      },
    ],
  },
  {
    code: 'MATH201',
    title: 'Linear Algebra',
    lecturer: 'Prof. Sarah Johnson',
    questions: [],
    exams: [],
  },
];

type TabKey = 'approvals' | 'questions' | 'exams';
type ApprovalTabKey = 'questions' | 'exams';
type ModalMode = 'add' | 'edit';

const questionTypes: QuestionType[] = [
  'multiple-choice',
  'short-answer',
  'essay',
  'true_false',
];

const questionDifficulties: QuestionDifficulty[] = [
  'Easy',
  'Medium',
  'Hard',
];

const difficultyColors = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
};

const examApprovalStatusColors = {
  draft: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

const examApprovalStatusLabels = {
  draft: 'Draft',
  pending_approval: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

/* ─────────────────────────────────────────────────────────────────────────────
   QUESTION REVIEW MODAL
───────────────────────────────────────────────────────────────────────────── */
function QuestionReviewModal({
  question,
  onClose,
  onApprove,
  onReject,
}: {
  question: PendingQuestion;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Review Question</h2>
            <p className="text-sm text-gray-500">Submitted by {question.teacherName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Question Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                {question.courseCode}
              </span>
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', difficultyColors[question.difficulty])}>
                {question.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 capitalize">
                {question.type.replace('-', ' ').replace('_', '/')}
              </span>
              <span className="text-xs text-gray-500">{question.points} points</span>
            </div>
            <p className="text-gray-900 font-medium">{question.text}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 rounded-xl border">
              <div className="text-xs text-gray-500 mb-1">Submitted</div>
              <div className="font-medium text-gray-900">{formatDateTime(question.submittedAt)}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="text-xs text-gray-500 mb-1">Target Course Pool</div>
              <div className="font-medium text-gray-900">{question.courseCode}</div>
            </Card>
          </div>

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <label className="block text-sm font-medium text-red-800 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Explain why this question is being rejected..."
                className="w-full rounded-lg border border-red-200 py-2 px-3 text-sm focus:border-red-500 focus:outline-none bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => onReject(rejectReason)}
                disabled={!rejectReason.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve & Add to Pool
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXAM REVIEW MODAL
───────────────────────────────────────────────────────────────────────────── */
function ExamReviewModal({
  exam,
  onClose,
  onApprove,
  onReject,
}: {
  exam: Exam;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const questionsPrintRef = useRef<HTMLDivElement>(null);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (exam.questions) {
      setExpandedQuestions(new Set(exam.questions.map(q => q.id)));
    }
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'short-answer': return 'Short Answer';
      case 'essay': return 'Essay';
      case 'true_false': return 'True/False';
      default: return type;
    }
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-700';
      case 'short-answer': return 'bg-purple-100 text-purple-700';
      case 'essay': return 'bg-orange-100 text-orange-700';
      case 'true_false': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownloadPDF = async () => {
    if (!exam.questions || exam.questions.length === 0) return;

    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exam.name, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${exam.courseCode} - ${exam.courseName}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.text(`Section: ${exam.section} | Date: ${formatDate(exam.date)} | Time: ${exam.startTime}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 7;

      pdf.text(`Duration: ${exam.durationMinutes} minutes | Total Points: ${exam.totalPoints}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 12;

      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Instructions
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Instructions: Answer all questions. Show your work where applicable.', margin, yPosition);
      yPosition += 12;

      // Questions
      pdf.setFont('helvetica', 'normal');

      for (const question of exam.questions) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        // Question number and points
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const questionHeader = `Question ${question.questionNumber} (${question.points} points) - ${getQuestionTypeLabel(question.type)}`;
        pdf.text(questionHeader, margin, yPosition);
        yPosition += 7;

        // Question text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const questionLines = pdf.splitTextToSize(question.text, contentWidth);
        pdf.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * 5 + 3;

        // Options for multiple choice
        if (question.type === 'multiple-choice' && question.options) {
          for (const option of question.options) {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(`    ${option.id.toUpperCase()}) ${option.text}`, margin, yPosition);
            yPosition += 5;
          }
        }

        // True/False options
        if (question.type === 'true_false') {
          pdf.text('    A) True', margin, yPosition);
          yPosition += 5;
          pdf.text('    B) False', margin, yPosition);
          yPosition += 5;
        }

        // Answer space for short answer and essay
        if (question.type === 'short-answer') {
          yPosition += 3;
          pdf.text('Answer: _______________________________________', margin, yPosition);
          yPosition += 8;
        }

        if (question.type === 'essay') {
          yPosition += 3;
          pdf.setDrawColor(200, 200, 200);
          for (let i = 0; i < 5; i++) {
            if (yPosition > pageHeight - 15) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 7;
          }
        }

        yPosition += 8;
      }

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text('--- End of Examination ---', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`${exam.courseCode}_${exam.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadAnswerKey = async () => {
    if (!exam.questions || exam.questions.length === 0) return;

    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${exam.name} - ANSWER KEY`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${exam.courseCode} - ${exam.courseName}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 12;

      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Answers
      for (const question of exam.questions) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Q${question.questionNumber}: `, margin, yPosition);

        pdf.setFont('helvetica', 'normal');
        let answer = '';

        if (question.type === 'multiple-choice' && question.options) {
          const correctOption = question.options.find(o => o.isCorrect);
          answer = correctOption ? `${correctOption.id.toUpperCase()}) ${correctOption.text}` : 'N/A';
        } else if (question.type === 'true_false') {
          answer = question.correctAnswer || 'N/A';
        } else if (question.type === 'short-answer') {
          answer = question.correctAnswer || 'See rubric';
        } else if (question.type === 'essay') {
          answer = 'See rubric for grading criteria';
        }

        const answerLines = pdf.splitTextToSize(answer, contentWidth - 15);
        pdf.text(answerLines, margin + 15, yPosition);
        yPosition += answerLines.length * 5 + 5;
      }

      pdf.save(`${exam.courseCode}_${exam.name.replace(/\s+/g, '_')}_AnswerKey.pdf`);
    } catch (error) {
      console.error('Error generating answer key:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl mx-4 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Review Exam</h2>
            <p className="text-sm text-gray-500">Submitted by {exam.teacherName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Exam Details */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{exam.name}</h3>
              <p className="text-gray-500">{exam.courseCode} - {exam.courseName} (Section {exam.section})</p>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || !exam.questions?.length}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download Exam'}
              </button>
              <button
                onClick={handleDownloadAnswerKey}
                disabled={isGeneratingPDF || !exam.questions?.length}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="h-4 w-4" />
                Answer Key
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Date & Time</span>
              </div>
              <div className="font-medium text-gray-900">{formatDate(exam.date)}</div>
              <div className="text-sm text-gray-500">{exam.startTime}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Duration</span>
              </div>
              <div className="font-medium text-gray-900">{exam.durationMinutes} min</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Questions</span>
              </div>
              <div className="font-medium text-gray-900">{exam.questions?.length || exam.questionCount}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs">Total Points</span>
              </div>
              <div className="font-medium text-gray-900">{exam.totalPoints}</div>
            </Card>
          </div>

          {/* Questions Section */}
          {exam.questions && exam.questions.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <h4 className="font-semibold text-gray-900">Exam Questions</h4>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Expand All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={collapseAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div ref={questionsPrintRef} className="divide-y max-h-[300px] overflow-y-auto">
                {exam.questions.map((question) => (
                  <div key={question.id} className="bg-white">
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                          {question.questionNumber}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{question.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getQuestionTypeColor(question.type))}>
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', difficultyColors[question.difficulty])}>
                              {question.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{question.points} pts</span>
                          </div>
                        </div>
                      </div>
                      {expandedQuestions.has(question.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedQuestions.has(question.id) && (
                      <div className="px-4 pb-4 pt-0 ml-11">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <p className="text-gray-900">{question.text}</p>

                          {/* Multiple Choice Options */}
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-2 mt-3">
                              <p className="text-xs font-medium text-gray-500 uppercase">Options:</p>
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg text-sm',
                                    option.isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-200'
                                  )}
                                >
                                  <span className={cn(
                                    'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold',
                                    option.isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                                  )}>
                                    {option.id.toUpperCase()}
                                  </span>
                                  <span className={option.isCorrect ? 'text-emerald-700 font-medium' : 'text-gray-700'}>
                                    {option.text}
                                  </span>
                                  {option.isCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* True/False Answer */}
                          {question.type === 'true_false' && question.correctAnswer && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Correct Answer:</p>
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-medium text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                                {question.correctAnswer}
                              </span>
                            </div>
                          )}

                          {/* Short Answer */}
                          {question.type === 'short-answer' && question.correctAnswer && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Expected Answer:</p>
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                                {question.correctAnswer}
                              </div>
                            </div>
                          )}

                          {/* Essay */}
                          {question.type === 'essay' && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Grading:</p>
                              <p className="text-sm text-gray-600 italic">
                                Essay question - will be manually graded based on rubric
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No questions warning */}
          {(!exam.questions || exam.questions.length === 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No Questions Available</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This exam does not have any questions attached. The teacher may need to add questions before approval.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Time-Based Visibility</p>
                <p className="text-sm text-blue-700 mt-1">
                  Once approved, students will only be able to see and take this exam
                  starting at {exam.startTime} on {formatDate(exam.date)}.
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <label className="block text-sm font-medium text-red-800 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Explain why this exam is being rejected..."
                className="w-full rounded-lg border border-red-200 py-2 px-3 text-sm focus:border-red-500 focus:outline-none bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => onReject(rejectReason)}
                disabled={!rejectReason.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Exam
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminExams() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<CourseExamsData[]>(initialCourses);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('approvals');
  const [approvalTab, setApprovalTab] = useState<ApprovalTabKey>('questions');
  const [questionSearch, setQuestionSearch] = useState('');

  const approverName = user ? `${user.firstName} ${user.lastName}` : 'Admin';

  // Pending items state
  const [pendingQuestionsState, setPendingQuestionsState] = useState(pendingQuestions);
  const [pendingExamsState, setPendingExamsState] = useState(pendingExams);

  // Review modals
  const [reviewingQuestion, setReviewingQuestion] = useState<PendingQuestion | null>(null);
  const [reviewingExam, setReviewingExam] = useState<Exam | null>(null);

  // QUESTION MODAL STATE
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionModalMode, setQuestionModalMode] = useState<ModalMode>('add');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'multiple-choice' as QuestionType,
    difficulty: 'Easy' as QuestionDifficulty,
    status: 'new' as QuestionStatus,
    points: '5',
  });

  const selectedCourse = useMemo(
    () => courses.find((c) => c.code === selectedCourseCode) || null,
    [courses, selectedCourseCode]
  );

  const filteredQuestions = useMemo(() => {
    if (!selectedCourse) return [];
    const term = questionSearch.toLowerCase();
    return selectedCourse.questions.filter(
      (q) =>
        q.id.toLowerCase().includes(term) ||
        q.text.toLowerCase().includes(term) ||
        q.type.toLowerCase().includes(term)
    );
  }, [selectedCourse, questionSearch]);

  const totalQuestions = selectedCourse?.questions.length ?? 0;
  const newQuestions = selectedCourse?.questions.filter((q) => q.status === 'new').length ?? 0;
  const oldQuestions = totalQuestions - newQuestions;

  // Stats
  const pendingStats = useMemo(() => ({
    questions: pendingQuestionsState.length,
    exams: pendingExamsState.length,
    total: pendingQuestionsState.length + pendingExamsState.length,
  }), [pendingQuestionsState, pendingExamsState]);

  // Handlers
  const handleApproveQuestion = (question: PendingQuestion) => {
    // Add to course question pool
    setCourses(prev => prev.map(course => {
      if (course.code === question.courseCode) {
        const newQuestion: Question = {
          ...question,
          id: `Q${String(course.questions.length + 1).padStart(3, '0')}`,
          status: 'new',
          approvalStatus: 'approved',
        };
        return {
          ...course,
          questions: [...course.questions, newQuestion],
        };
      }
      return course;
    }));

    // Remove from pending
    setPendingQuestionsState(prev => prev.filter(q => q.id !== question.id));
    setReviewingQuestion(null);

    // Send notification to teacher
    notifyQuestionApproved(
      question.text,
      approverName,
      question.courseCode,
      question.createdBy // Using createdBy as teacherId (in real app, this would be actual ID)
    );
  };

  const handleRejectQuestion = (question: PendingQuestion, reason: string) => {
    setPendingQuestionsState(prev => prev.filter(q => q.id !== question.id));
    setReviewingQuestion(null);

    // Send notification to teacher
    notifyQuestionRejected(
      question.text,
      approverName,
      reason,
      question.courseCode,
      question.createdBy
    );
  };

  const handleApproveExam = (exam: Exam) => {
    setPendingExamsState(prev => prev.filter(e => e.id !== exam.id));
    setReviewingExam(null);

    // Send notification to teacher
    notifyExamApproved(
      exam.name,
      approverName,
      exam.teacherName // Using teacherName as teacherId
    );
  };

  const handleRejectExam = (exam: Exam, reason: string) => {
    setPendingExamsState(prev => prev.filter(e => e.id !== exam.id));
    setReviewingExam(null);

    // Send notification to teacher
    notifyExamRejected(
      exam.name,
      approverName,
      reason,
      exam.teacherName
    );
  };

  const handleQuestionFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddQuestionModal = () => {
    setQuestionModalMode('add');
    setEditingQuestionId(null);
    setQuestionForm({
      text: '',
      type: 'multiple-choice',
      difficulty: 'Easy',
      status: 'new',
      points: '5',
    });
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (question: Question) => {
    setQuestionModalMode('edit');
    setEditingQuestionId(question.id);
    setQuestionForm({
      text: question.text,
      type: question.type,
      difficulty: question.difficulty,
      status: question.status,
      points: String(question.points),
    });
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleQuestionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setCourses((prev) =>
      prev.map((course) => {
        if (course.code !== selectedCourse.code) return course;

        if (questionModalMode === 'add') {
          const nextIndex = course.questions.length + 1;
          const newId = `Q${String(nextIndex).padStart(3, '0')}`;

          const newQuestion: Question = {
            id: newId,
            text: questionForm.text,
            type: questionForm.type,
            difficulty: questionForm.difficulty,
            status: questionForm.status,
            points: Number(questionForm.points),
            courseCode: course.code,
            createdBy: 'Admin',
            createdAt: new Date().toISOString(),
            approvalStatus: 'approved',
          };

          return {
            ...course,
            questions: [...course.questions, newQuestion],
          };
        }

        if (questionModalMode === 'edit' && editingQuestionId) {
          return {
            ...course,
            questions: course.questions.map((q) =>
              q.id === editingQuestionId
                ? {
                    ...q,
                    text: questionForm.text,
                    type: questionForm.type,
                    difficulty: questionForm.difficulty,
                    status: questionForm.status,
                    points: Number(questionForm.points),
                  }
                : q
            ),
          };
        }

        return course;
      })
    );

    closeQuestionModal();
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedCourse) return;

    setCourses((prev) =>
      prev.map((course) => {
        if (course.code !== selectedCourse.code) return course;
        return {
          ...course,
          questions: course.questions.filter((q) => q.id !== questionId),
        };
      })
    );
  };

  // Overview screen (no course selected, show approval dashboard)
  if (!selectedCourseCode) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Exams &amp; Quizzes Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review pending approvals and manage question pools
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className={cn(
                'border-b-2 px-1 pb-3 flex items-center gap-2',
                activeTab === 'approvals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              Pending Approvals
              {pendingStats.total > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  {pendingStats.total}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={cn(
                'border-b-2 px-1 pb-3',
                activeTab === 'questions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              Question Pools
            </button>
          </nav>
        </div>

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 rounded-xl border">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">Total Pending</span>
                </div>
                <div className="text-2xl font-bold text-amber-600">{pendingStats.total}</div>
              </Card>
              <Card className="p-4 rounded-xl border">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Questions</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{pendingStats.questions}</div>
              </Card>
              <Card className="p-4 rounded-xl border">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <BookCheck className="h-4 w-4" />
                  <span className="text-xs">Exams</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{pendingStats.exams}</div>
              </Card>
            </div>

            {/* Approval Sub-tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setApprovalTab('questions')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  approvalTab === 'questions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Questions ({pendingStats.questions})
              </button>
              <button
                onClick={() => setApprovalTab('exams')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  approvalTab === 'exams'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Exams ({pendingStats.exams})
              </button>
            </div>

            {/* Pending Questions List */}
            {approvalTab === 'questions' && (
              <Card className="rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">Pending Question Approvals</h3>
                  <p className="text-sm text-gray-500">Questions submitted by teachers for review</p>
                </div>

                {pendingQuestionsState.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
                    <p className="mt-4 text-gray-500">No pending questions to review</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {pendingQuestionsState.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setReviewingQuestion(question)}
                      >
                        <div className="p-3 rounded-xl bg-amber-50">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-gray-900 line-clamp-1">{question.text}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                              {question.courseCode}
                            </span>
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', difficultyColors[question.difficulty])}>
                              {question.difficulty}
                            </span>
                            <span>By {question.teacherName}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formatDateTime(question.submittedAt)}
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Pending Exams List */}
            {approvalTab === 'exams' && (
              <Card className="rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">Pending Exam Approvals</h3>
                  <p className="text-sm text-gray-500">Exams submitted by teachers for review</p>
                </div>

                {pendingExamsState.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
                    <p className="mt-4 text-gray-500">No pending exams to review</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {pendingExamsState.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setReviewingExam(exam)}
                      >
                        <div className="p-3 rounded-xl bg-purple-50">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{exam.name}</span>
                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', examApprovalStatusColors[exam.approvalStatus])}>
                              {examApprovalStatusLabels[exam.approvalStatus]}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{exam.courseCode} - {exam.courseName}</span>
                            <span>By {exam.teacherName}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium text-gray-900">{formatDate(exam.date)}</div>
                          <div className="text-gray-500">{exam.startTime} • {exam.durationMinutes}min</div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Question Pools Tab - Course Selection */}
        {activeTab === 'questions' && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select a Course to Manage Question Pool</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => {
                const totalExams = course.exams.length;
                const totalQuestions = course.questions.length;

                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => {
                      setSelectedCourseCode(course.code);
                    }}
                    className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {course.code}
                        </p>
                        <p className="mt-4 text-sm text-gray-700">
                          {course.lecturer}
                        </p>
                      </div>
                      <ChevronRight className="text-blue-500 h-5 w-5" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Questions
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {totalQuestions}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Exams
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {totalExams}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Review Modals */}
        {reviewingQuestion && (
          <QuestionReviewModal
            question={reviewingQuestion}
            onClose={() => setReviewingQuestion(null)}
            onApprove={() => handleApproveQuestion(reviewingQuestion)}
            onReject={(reason) => handleRejectQuestion(reviewingQuestion, reason)}
          />
        )}
        {reviewingExam && (
          <ExamReviewModal
            exam={reviewingExam}
            onClose={() => setReviewingExam(null)}
            onApprove={() => handleApproveExam(reviewingExam)}
            onReject={(reason) => handleRejectExam(reviewingExam, reason)}
          />
        )}
      </div>
    );
  }

  // Detail view for selected course
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCourse?.title}
          </h1>
          <p className="mt-1 text-gray-500">{selectedCourse?.code} - Question Pool</p>
        </div>

        <Button
          variant="outline"
          onClick={() => setSelectedCourseCode(null)}
          className="self-start md:self-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
        >
          &larr; Back
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-gray-500">
            Total Questions
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {totalQuestions}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-gray-500">
            New Questions
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {newQuestions}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-gray-500">
            Old Questions
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {oldQuestions}
          </p>
        </Card>
      </div>

      {/* Questions Table */}
      <Card className="mt-4 space-y-4 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full md:w-64 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pl-9 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
            />
          </div>

          <Button
            className="whitespace-nowrap px-5"
            onClick={openAddQuestionModal}
          >
            + Add Question
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Question</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Difficulty</th>
                <th className="py-3 pr-4">Points</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 pr-4 text-gray-700">{q.id}</td>
                  <td className="py-3 pr-4 text-gray-900 max-w-xs truncate">{q.text}</td>
                  <td className="py-3 pr-4 text-gray-600 capitalize">{q.type.replace('-', ' ')}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', difficultyColors[q.difficulty])}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{q.points}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                        q.status === 'new'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {q.status === 'new' ? 'New' : 'Old'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditQuestionModal(q)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredQuestions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {questionModalMode === 'add'
                    ? 'Add New Question'
                    : 'Edit Question'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {questionModalMode === 'add'
                    ? 'Create a new question for this course.'
                    : 'Update the question details below.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeQuestionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Question Text
                </label>
                <textarea
                  name="text"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter the question text..."
                  value={questionForm.text}
                  onChange={handleQuestionFieldChange}
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={questionForm.type}
                    onChange={handleQuestionFieldChange}
                    required
                  >
                    {questionTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('-', ' ').replace('_', '/')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={questionForm.difficulty}
                    onChange={handleQuestionFieldChange}
                    required
                  >
                    {questionDifficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    min="1"
                    max="100"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={questionForm.points}
                    onChange={handleQuestionFieldChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={questionForm.status}
                    onChange={handleQuestionFieldChange}
                    required
                  >
                    <option value="new">New</option>
                    <option value="old">Old</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeQuestionModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {questionModalMode === 'add'
                    ? 'Add Question'
                    : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
