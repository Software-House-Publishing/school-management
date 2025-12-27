import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  GraduationCap,
  Search,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
  ArrowLeft,
  ChevronRight,
  Check,
  XCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  BarChart3,
  Library,
  Save,
  Send,
  FileQuestion,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  teacherExams,
  teacherCourses,
  Exam,
  Question,
  questionPool,
  getQuestionsByCourse,
  ExamSubmission,
  getExamSubmissions,
  formatDate,
  formatTime,
  formatDateTime,
} from '../data/teacherPortalData';
import {
  notifyQuestionSubmitted,
  notifyExamSubmitted,
} from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const statusColors = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-100',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-100',
  completed: 'bg-gray-50 text-gray-600 border-gray-100',
  grading: 'bg-purple-50 text-purple-700 border-purple-100',
  graded: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const approvalStatusColors = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  pending_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const approvalStatusLabels = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

const examTypeColors = {
  quiz: 'bg-indigo-50 text-indigo-700',
  midterm: 'bg-orange-50 text-orange-700',
  final: 'bg-red-50 text-red-700',
  assignment: 'bg-teal-50 text-teal-700',
};

const difficultyColors = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

const questionTypeLabels = {
  multiple_choice: 'Multiple Choice',
  short_answer: 'Short Answer',
  essay: 'Essay',
  true_false: 'True/False',
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE QUESTION MODAL - For teachers to create new questions
───────────────────────────────────────────────────────────────────────────── */
function CreateQuestionModal({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (question: Omit<Question, 'id' | 'usageCount' | 'createdAt' | 'createdBy'>) => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState(teacherCourses[0]?.courseCode || '');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<Question['type']>('multiple_choice');
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('medium');
  const [points, setPoints] = useState('5');
  const [tags, setTags] = useState('');

  // Multiple choice options
  const [options, setOptions] = useState([
    { id: 'a', text: '', isCorrect: true },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false },
  ]);

  // For true/false and short answer
  const [correctAnswer, setCorrectAnswer] = useState('');

  const courseName = teacherCourses.find(c => c.courseCode === selectedCourse)?.courseName || '';

  const updateOption = (id: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    setOptions(prev => prev.map(opt => {
      if (opt.id === id) {
        return { ...opt, [field]: value };
      }
      if (field === 'isCorrect' && value === true) {
        return { ...opt, isCorrect: false };
      }
      return opt;
    }));
  };

  const handleSubmit = () => {
    const question: Omit<Question, 'id' | 'usageCount' | 'createdAt' | 'createdBy'> = {
      courseCode: selectedCourse,
      courseName,
      questionText,
      type: questionType,
      difficulty,
      points: Number(points),
      isNew: true,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      approvalStatus: 'pending',
    };

    if (questionType === 'multiple_choice') {
      question.options = options.filter(o => o.text.trim());
    } else if (questionType === 'true_false') {
      question.correctAnswer = correctAnswer;
    } else if (questionType === 'short_answer') {
      question.correctAnswer = correctAnswer;
    }

    onSave(question);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Question</h2>
            <p className="text-sm text-gray-500">Add a new question to submit for admin approval</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              {teacherCourses.map((course) => (
                <option key={course.id} value={course.courseCode}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['multiple_choice', 'true_false', 'short_answer', 'essay'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setQuestionType(type)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium border transition-colors',
                    questionType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {questionTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              placeholder="Enter your question here..."
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Multiple Choice Options */}
          {questionType === 'multiple_choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
              <div className="space-y-2">
                {options.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <button
                      onClick={() => updateOption(option.id, 'isCorrect', true)}
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                        option.isCorrect
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      )}
                    >
                      {option.isCorrect && <Check className="h-4 w-4" />}
                    </button>
                    <span className="text-sm font-medium text-gray-500 w-6">{option.id.toUpperCase()}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                      placeholder={`Option ${option.id.toUpperCase()}`}
                      className="flex-1 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click the circle to mark the correct answer</p>
            </div>
          )}

          {/* True/False Answer */}
          {questionType === 'true_false' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setCorrectAnswer('true')}
                  className={cn(
                    'flex-1 py-3 rounded-lg border-2 font-medium transition-colors',
                    correctAnswer === 'true'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  True
                </button>
                <button
                  onClick={() => setCorrectAnswer('false')}
                  className={cn(
                    'flex-1 py-3 rounded-lg border-2 font-medium transition-colors',
                    correctAnswer === 'false'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  False
                </button>
              </div>
            </div>
          )}

          {/* Short Answer */}
          {questionType === 'short_answer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Answer</label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the expected answer..."
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Difficulty & Points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Question['difficulty'])}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                max="100"
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., derivatives, calculus, basics"
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Approval Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  This question will be submitted to the school admin for approval.
                  Once approved, it will be added to the {selectedCourse} question pool.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!questionText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Submit for Approval
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE EXAM MODAL - Enhanced with Question Pool and Approval
───────────────────────────────────────────────────────────────────────────── */
function CreateExamModal({
  onClose,
  onCreateQuestion,
}: {
  onClose: () => void;
  onCreateQuestion: () => void;
}) {
  const [step, setStep] = useState<'details' | 'questions'>('details');
  const [selectedCourse, setSelectedCourse] = useState(teacherCourses[0]?.courseCode || '');
  const [examType, setExamType] = useState<'quiz' | 'midterm' | 'final' | 'assignment'>('quiz');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const availableQuestions = useMemo(() => {
    // Only show approved questions
    let questions = getQuestionsByCourse(selectedCourse).filter(
      q => !q.approvalStatus || q.approvalStatus === 'approved'
    );

    if (difficultyFilter !== 'all') {
      questions = questions.filter(q => q.difficulty === difficultyFilter);
    }

    if (typeFilter !== 'all') {
      questions = questions.filter(q => q.type === typeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      questions = questions.filter(q =>
        q.questionText.toLowerCase().includes(term) ||
        q.tags?.some(t => t.toLowerCase().includes(term))
      );
    }

    return questions;
  }, [selectedCourse, difficultyFilter, typeFilter, searchTerm]);

  const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0);

  const toggleQuestion = (question: Question) => {
    setSelectedQuestions(prev => {
      const exists = prev.find(q => q.id === question.id);
      if (exists) {
        return prev.filter(q => q.id !== question.id);
      }
      return [...prev, question];
    });
  };

  const handleCreate = (asDraft: boolean) => {
    const status = asDraft ? 'Draft' : 'Pending Approval';
    alert(`Exam ${asDraft ? 'saved as draft' : 'submitted for approval'}!\n\nTitle: ${title}\nDate: ${date} at ${startTime}\nQuestions: ${selectedQuestions.length}\nTotal Points: ${totalPoints}\nStatus: ${status}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {step === 'details' ? 'Create New Exam' : 'Select Questions'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 'details' ? 'Step 1: Enter exam details' : 'Step 2: Choose questions from pool'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'details' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {teacherCourses.map((course) => (
                    <option key={course.id} value={course.courseCode}>
                      {course.courseCode} - Section {course.section} ({course.courseName})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as typeof examType)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="quiz">Quiz</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Midterm Examination"
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Exam Hall A"
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Time-based visibility info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Time-Based Visibility</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Students will only be able to see and take this exam at the scheduled date and time.
                      The exam will become available at {startTime || '--:--'} on {date || 'the selected date'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Question Pool Info */}
              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Library className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-blue-900">Question Pool for {selectedCourse}</span>
                    <span className="text-sm text-blue-700 ml-2">({availableQuestions.length} approved questions)</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onCreateQuestion();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Question
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>

              {/* Selected Summary */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm text-gray-600">
                  Selected: <span className="font-semibold text-gray-900">{selectedQuestions.length}</span> questions
                </span>
                <span className="text-sm text-gray-600">
                  Total Points: <span className="font-semibold text-blue-600">{totalPoints}</span>
                </span>
              </div>

              {/* Questions List */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {availableQuestions.map((question) => {
                  const isSelected = selectedQuestions.some(q => q.id === question.id);
                  return (
                    <div
                      key={question.id}
                      onClick={() => toggleQuestion(question)}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5',
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-gray-900">{question.id}</span>
                            {question.isNew && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
                                <Sparkles className="h-3 w-3" />
                                NEW
                              </span>
                            )}
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', difficultyColors[question.difficulty])}>
                              {question.difficulty}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {questionTypeLabels[question.type]}
                            </span>
                            <span className="text-xs text-gray-500">{question.points} pts</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{question.questionText}</p>
                          {question.usageCount > 0 && (
                            <p className="text-xs text-gray-400 mt-1">Used in {question.usageCount} exams</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {availableQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No questions found</p>
                    <button
                      onClick={() => {
                        onClose();
                        onCreateQuestion();
                      }}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create a new question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 p-6 border-t shrink-0">
          {step === 'details' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('questions')}
                disabled={!title || !date || !startTime}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Questions
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('details')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreate(true)}
                  disabled={selectedQuestions.length === 0}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleCreate(false)}
                  disabled={selectedQuestions.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Submit for Approval
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GRADING VIEW - Full page for grading submissions
───────────────────────────────────────────────────────────────────────────── */
function GradingView({
  exam,
  onBack,
}: {
  exam: Exam;
  onBack: () => void;
}) {
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => getExamSubmissions(exam.id));
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all');

  const filteredSubmissions = useMemo(() => {
    if (filter === 'all') return submissions;
    return submissions.filter(s => s.status === filter);
  }, [submissions, filter]);

  const stats = useMemo(() => {
    const graded = submissions.filter(s => s.status === 'graded').length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const avgScore = submissions.filter(s => s.totalScore !== undefined)
      .reduce((sum, s) => sum + (s.totalScore || 0), 0) / (graded || 1);
    return { total: submissions.length, graded, pending, avgScore: Math.round(avgScore * 10) / 10 };
  }, [submissions]);

  const handleSaveGrade = (submissionId: string, totalScore: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: 'graded',
          totalScore,
          overallFeedback: feedback,
          gradedBy: 'David Smith',
          gradedAt: new Date().toISOString(),
        };
      }
      return s;
    }));
    setSelectedSubmission(null);
  };

  if (selectedSubmission) {
    return (
      <GradeSubmissionView
        submission={selectedSubmission}
        exam={exam}
        onBack={() => setSelectedSubmission(null)}
        onSave={handleSaveGrade}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Exams</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
        <p className="text-sm text-gray-500">{exam.courseCode} - Section {exam.section} | {formatDate(exam.date)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Total Submissions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Graded</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.graded}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Average Score</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.avgScore}/{exam.maxScore}</div>
        </Card>
      </div>

      {/* Submissions List */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Student Submissions</h3>
          <div className="flex gap-2">
            {(['all', 'pending', 'graded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize',
                  filter === f
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                {submission.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{submission.studentName}</div>
                <div className="text-sm text-gray-500">
                  Submitted {formatDateTime(submission.submittedAt)}
                </div>
              </div>
              <div className="text-right">
                {submission.status === 'graded' ? (
                  <div className="text-lg font-bold text-emerald-600">
                    {submission.totalScore}/{submission.maxScore}
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    Needs Grading
                  </span>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No submissions found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GRADE SUBMISSION VIEW - Grade individual submission
───────────────────────────────────────────────────────────────────────────── */
function GradeSubmissionView({
  submission,
  exam,
  onBack,
  onSave,
}: {
  submission: ExamSubmission;
  exam: Exam;
  onBack: () => void;
  onSave: (submissionId: string, totalScore: number, feedback: string) => void;
}) {
  const [answers, setAnswers] = useState(submission.answers);
  const [feedback, setFeedback] = useState(submission.overallFeedback || '');

  const totalScore = answers.reduce((sum, a) => sum + (a.earnedPoints || 0), 0);

  const updateAnswer = (questionId: string, earnedPoints: number, answerFeedback?: string) => {
    setAnswers(prev => prev.map(a => {
      if (a.questionId === questionId) {
        return { ...a, earnedPoints, feedback: answerFeedback, needsManualGrading: false };
      }
      return a;
    }));
  };

  const handleSave = () => {
    onSave(submission.id, totalScore, feedback);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Submissions</span>
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{submission.studentName}</h1>
          <p className="text-sm text-gray-500">
            {submission.studentId} | Submitted {formatDateTime(submission.submittedAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{totalScore}/{submission.maxScore}</div>
          <div className="text-sm text-gray-500">Current Score</div>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        {answers.map((answer, idx) => (
          <Card key={answer.questionId} className="rounded-xl border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Question {idx + 1}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                    {questionTypeLabels[answer.questionType]}
                  </span>
                  {answer.needsManualGrading && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Needs Review
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{answer.points} pts</span>
              </div>
              <p className="mt-2 text-gray-700">{answer.questionText}</p>
            </div>

            <div className="p-4 space-y-4">
              {/* Student Answer */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Student Answer
                </label>
                <div className={cn(
                  'p-3 rounded-lg text-sm',
                  answer.isCorrect === true ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
                  answer.isCorrect === false ? 'bg-red-50 text-red-900 border border-red-200' :
                  'bg-gray-50 text-gray-900 border border-gray-200'
                )}>
                  {answer.studentAnswer}
                  {answer.isCorrect !== undefined && (
                    <span className="ml-2">
                      {answer.isCorrect ? (
                        <Check className="inline h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="inline h-4 w-4 text-red-600" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Correct Answer */}
              {answer.correctAnswer && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Correct Answer
                  </label>
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-sm">
                    {answer.correctAnswer}
                  </div>
                </div>
              )}

              {/* Grading Controls */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Points Earned
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={answer.points}
                    value={answer.earnedPoints ?? ''}
                    onChange={(e) => updateAnswer(answer.questionId, Number(e.target.value), answer.feedback)}
                    className="w-24 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-sm text-gray-500 ml-2">/ {answer.points}</span>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Feedback (optional)
                  </label>
                  <input
                    type="text"
                    value={answer.feedback || ''}
                    onChange={(e) => updateAnswer(answer.questionId, answer.earnedPoints || 0, e.target.value)}
                    placeholder="Add feedback for this question..."
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Overall Feedback */}
      <Card className="rounded-xl border p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          placeholder="Add overall feedback for the student..."
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
        />
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Grade ({totalScore}/{submission.maxScore})
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXAM DETAIL MODAL - Enhanced with approval status
───────────────────────────────────────────────────────────────────────────── */
function ExamDetailModal({
  exam,
  onClose,
  onGrade,
  onSubmitForApproval,
}: {
  exam: Exam;
  onClose: () => void;
  onGrade: () => void;
  onSubmitForApproval?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium border',
                approvalStatusColors[exam.approvalStatus]
              )}>
                {approvalStatusLabels[exam.approvalStatus]}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {exam.courseCode} - Section {exam.section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Rejection Reason */}
          {exam.approvalStatus === 'rejected' && exam.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                  <p className="text-sm text-red-700 mt-1">{exam.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Exam Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Date & Time</span>
              </div>
              <div className="font-medium text-gray-900">{formatDate(exam.date)}</div>
              <div className="text-sm text-gray-500">{formatTime(exam.startTime)}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Duration</span>
              </div>
              <div className="font-medium text-gray-900">{exam.duration} minutes</div>
              <div className="text-sm text-gray-500">{exam.location}</div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 rounded-xl border">
              <div className="text-sm text-gray-500">Total Students</div>
              <div className="text-2xl font-bold text-gray-900">{exam.totalStudents}</div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="text-sm text-gray-500">Graded</div>
              <div className="text-2xl font-bold text-emerald-600">
                {exam.gradedCount}/{exam.totalStudents}
              </div>
            </Card>
            <Card className="p-4 rounded-xl border">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(exam.gradedCount / exam.totalStudents) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((exam.gradedCount / exam.totalStudents) * 100)}%
              </div>
            </Card>
          </div>

          {/* Score Statistics */}
          {exam.averageScore !== undefined && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Score Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 rounded-xl border text-center">
                  <div className="text-sm text-gray-500">Average</div>
                  <div className="text-2xl font-bold text-blue-600">{exam.averageScore}</div>
                </Card>
                <Card className="p-4 rounded-xl border text-center">
                  <div className="text-sm text-gray-500">Highest</div>
                  <div className="text-2xl font-bold text-emerald-600">{exam.highestScore}</div>
                </Card>
                <Card className="p-4 rounded-xl border text-center">
                  <div className="text-sm text-gray-500">Lowest</div>
                  <div className="text-2xl font-bold text-red-600">{exam.lowestScore}</div>
                </Card>
              </div>
            </div>
          )}

          {/* Approval Info */}
          {exam.approvalStatus === 'approved' && exam.approvedBy && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">
                  Approved by <span className="font-medium">{exam.approvedBy}</span>
                  {exam.approvedAt && ` on ${formatDateTime(exam.approvedAt)}`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>

          {exam.approvalStatus === 'draft' && onSubmitForApproval && (
            <button
              onClick={onSubmitForApproval}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit for Approval
            </button>
          )}

          {exam.approvalStatus === 'rejected' && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Revise & Resubmit
            </button>
          )}

          {exam.approvalStatus === 'approved' && (exam.status === 'grading' || exam.status === 'completed' || exam.status === 'graded') && (
            <button
              onClick={onGrade}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              {exam.status === 'graded' ? 'View Grades' : 'Grade Submissions'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function TeacherExams() {
  const { user } = useAuthStore();
  const teacherName = user ? `${user.firstName} ${user.lastName}` : 'Teacher';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [gradingExam, setGradingExam] = useState<Exam | null>(null);

  const filteredExams = useMemo(() => {
    let exams = teacherExams;

    if (statusFilter !== 'all') {
      exams = exams.filter((e) => e.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      exams = exams.filter((e) => e.examType === typeFilter);
    }

    if (approvalFilter !== 'all') {
      exams = exams.filter((e) => e.approvalStatus === approvalFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      exams = exams.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.courseCode.toLowerCase().includes(term) ||
          e.courseName.toLowerCase().includes(term)
      );
    }

    return exams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, statusFilter, typeFilter, approvalFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: teacherExams.length,
      pending: teacherExams.filter((e) => e.approvalStatus === 'pending_approval').length,
      approved: teacherExams.filter((e) => e.approvalStatus === 'approved').length,
      drafts: teacherExams.filter((e) => e.approvalStatus === 'draft').length,
      needsGrading: teacherExams.filter((e) => e.status === 'grading' || e.status === 'completed').length,
    };
  }, []);

  const handleSaveQuestion = (question: Omit<Question, 'id' | 'usageCount' | 'createdAt' | 'createdBy'>) => {
    // In a real app, this would save to backend
    console.log('New question submitted for approval:', question);

    // Get course name from courseCode
    const course = teacherCourses.find(c => c.courseCode === question.courseCode);
    const courseName = course?.courseName || question.courseCode;

    // Send notification to school admin
    notifyQuestionSubmitted(
      1,
      teacherName,
      question.courseCode,
      courseName
    );
  };

  // Show grading view
  if (gradingExam) {
    return (
      <GradingView
        exam={gradingExam}
        onBack={() => setGradingExam(null)}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Exams & Assessments</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create and manage exams. All exams require school admin approval before students can see them.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-6">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs">Total Exams</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs">Drafts</span>
          </div>
          <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Pending Approval</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Approved</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Needs Grading</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.needsGrading}</div>
        </Card>
      </div>

      {/* Filters & Create Buttons */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Approval Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="grading">Grading</option>
              <option value="graded">Graded</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FileQuestion className="h-4 w-4" />
              New Question
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Exam
            </button>
          </div>
        </div>

        {/* Exam List */}
        <div className="divide-y">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedExam(exam)}
            >
              <div className={cn('p-3 rounded-xl', examTypeColors[exam.examType])}>
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{exam.title}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', approvalStatusColors[exam.approvalStatus])}>
                    {approvalStatusLabels[exam.approvalStatus]}
                  </span>
                  {exam.approvalStatus === 'approved' && (
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', statusColors[exam.status])}>
                      {exam.status.replace('_', ' ')}
                    </span>
                  )}
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

              <div className="text-right">
                {exam.approvalStatus === 'approved' && (
                  <>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{exam.gradedCount}/{exam.totalStudents}</span>
                    </div>
                    {exam.averageScore && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Avg: {exam.averageScore}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
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

      {/* Modals */}
      {showCreateModal && (
        <CreateExamModal
          onClose={() => setShowCreateModal(false)}
          onCreateQuestion={() => {
            setShowCreateModal(false);
            setShowCreateQuestionModal(true);
          }}
        />
      )}
      {showCreateQuestionModal && (
        <CreateQuestionModal
          onClose={() => setShowCreateQuestionModal(false)}
          onSave={handleSaveQuestion}
        />
      )}
      {selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onGrade={() => {
            setGradingExam(selectedExam);
            setSelectedExam(null);
          }}
          onSubmitForApproval={() => {
            // Send notification to school admin
            if (selectedExam) {
              notifyExamSubmitted(
                selectedExam.title,
                teacherName,
                selectedExam.courseCode,
                selectedExam.courseName,
                selectedExam.id
              );
            }
            setSelectedExam(null);
          }}
        />
      )}
    </div>
  );
}
