import React, {
  useMemo,
  useState,
  FormEvent,
  ChangeEvent,
} from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type QuestionStatus = 'new' | 'old';
type QuestionType = 'multiple-choice' | 'short-answer' | 'essay';
type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
}

type ExamStatus = 'Draft' | 'Published';

interface Exam {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  questionIds: string[]; // question IDs from this course
  status: ExamStatus;
}

interface CourseExamsData {
  code: string;
  title: string;
  lecturer: string;
  questions: Question[];
  exams: Exam[];
}

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
      },
      {
        id: 'Q002',
        text: 'Solve: 2x + 5 = 13',
        type: 'short-answer',
        difficulty: 'Medium',
        status: 'old',
      },
      {
        id: 'Q003',
        text: 'What is calculus?',
        type: 'essay',
        difficulty: 'Hard',
        status: 'new',
      },
    ],
    exams: [
      {
        id: 'EXAM001',
        name: 'Mathematics Mid-Term',
        date: '2025-01-15',
        durationMinutes: 120,
        questionIds: ['Q001', 'Q002'],
        status: 'Published',
      },
      {
        id: 'EXAM003',
        name: 'Math Quiz 1',
        date: '2025-01-10',
        durationMinutes: 45,
        questionIds: ['Q001'],
        status: 'Published',
      },
    ],
  },
  {
    code: 'ENG101',
    title: 'English Literature',
    lecturer: 'Prof. Sarah Johnson',
    questions: [],
    exams: [],
  },
  {
    code: 'SCI101',
    title: 'Science',
    lecturer: 'Dr. Michael Brown',
    questions: [],
    exams: [],
  },
  {
    code: 'HIS101',
    title: 'History',
    lecturer: 'Prof. Emily Davis',
    questions: [],
    exams: [],
  },
  {
    code: 'COMP101',
    title: 'Computer Science',
    lecturer: 'Dr. Robert Wilson',
    questions: [],
    exams: [],
  },
];

type TabKey = 'questions' | 'exams';
type ModalMode = 'add' | 'edit';

const questionTypes: QuestionType[] = [
  'multiple-choice',
  'short-answer',
  'essay',
];

const questionDifficulties: QuestionDifficulty[] = [
  'Easy',
  'Medium',
  'Hard',
];

const examStatuses: ExamStatus[] = ['Draft', 'Published'];

export default function SchoolExams() {
  const [courses, setCourses] = useState<CourseExamsData[]>(initialCourses);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabKey>('questions');
  const [questionSearch, setQuestionSearch] = useState('');

  // QUESTION MODAL STATE
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionModalMode, setQuestionModalMode] =
    useState<ModalMode>('add');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'multiple-choice' as QuestionType,
    difficulty: 'Easy' as QuestionDifficulty,
    status: 'new' as QuestionStatus,
  });

  // EXAM MODAL STATE
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examModalMode, setExamModalMode] = useState<ModalMode>('add');
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examForm, setExamForm] = useState({
    name: '',
    date: '',
    durationMinutes: '',
    status: 'Draft' as ExamStatus,
    questionIds: [] as string[],
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
  const newQuestions =
    selectedCourse?.questions.filter((q) => q.status === 'new').length ?? 0;
  const oldQuestions = totalQuestions - newQuestions;

  const getUsedInCount = (questionId: string): number => {
    if (!selectedCourse) return 0;
    return selectedCourse.exams.reduce(
      (acc, exam) =>
        exam.questionIds.includes(questionId) ? acc + 1 : acc,
      0
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
          questions: course.questions.filter(
            (q) => q.id !== questionId
          ),
          exams: course.exams.map((exam) => ({
            ...exam,
            questionIds: exam.questionIds.filter(
              (id) => id !== questionId
            ),
          })),
        };
      })
    );
  };

  // ---- EXAM MODAL HANDLERS ----

  const handleExamFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExamQuestionToggle = (questionId: string) => {
    setExamForm((prev) => {
      const exists = prev.questionIds.includes(questionId);
      return {
        ...prev,
        questionIds: exists
          ? prev.questionIds.filter((id) => id !== questionId)
          : [...prev.questionIds, questionId],
      };
    });
  };

  const openAddExamModal = () => {
    setExamModalMode('add');
    setEditingExamId(null);
    setExamForm({
      name: '',
      date: '',
      durationMinutes: '',
      status: 'Draft',
      questionIds: [],
    });
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (exam: Exam) => {
    setExamModalMode('edit');
    setEditingExamId(exam.id);
    setExamForm({
      name: exam.name,
      date: exam.date,
      durationMinutes: String(exam.durationMinutes),
      status: exam.status,
      questionIds: exam.questionIds,
    });
    setIsExamModalOpen(true);
  };

  const closeExamModal = () => {
    setIsExamModalOpen(false);
    setEditingExamId(null);
  };

  const handleExamSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!examForm.name || !examForm.date || !examForm.durationMinutes) {
      return;
    }

    const duration = Number(examForm.durationMinutes) || 0;

    setCourses((prev) =>
      prev.map((course) => {
        if (course.code !== selectedCourse.code) return course;

        if (examModalMode === 'add') {
          const nextIndex = course.exams.length + 1;
          const newId = `EXAM${String(nextIndex).padStart(3, '0')}`;

          const newExam: Exam = {
            id: newId,
            name: examForm.name,
            date: examForm.date,
            durationMinutes: duration,
            questionIds: examForm.questionIds,
            status: examForm.status,
          };

          return { ...course, exams: [...course.exams, newExam] };
        }

        if (examModalMode === 'edit' && editingExamId) {
          return {
            ...course,
            exams: course.exams.map((exam) =>
              exam.id === editingExamId
                ? {
                  ...exam,
                  name: examForm.name,
                  date: examForm.date,
                  durationMinutes: duration,
                  questionIds: examForm.questionIds,
                  status: examForm.status,
                }
                : exam
            ),
          };
        }

        return course;
      })
    );

    closeExamModal();
  };

  const handleDeleteExam = (examId: string) => {
    if (!selectedCourse) return;

    setCourses((prev) =>
      prev.map((course) => {
        if (course.code !== selectedCourse.code) return course;
        return {
          ...course,
          exams: course.exams.filter((exam) => exam.id !== examId),
        };
      })
    );
  };

  // Overview screen
  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Exams &amp; Quizzes Management
          </h1>
          <p className="mt-2 text-gray-600">
            Select a course to manage exams and question pool.
          </p>
        </div>

        <Card className="p-6">
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
                    setActiveTab('questions');
                    setQuestionSearch('');
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
                    <span className="text-blue-500 text-xl">{'→'}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm">
                      <p className="text-xs font-medium text-gray-500">
                        Total Exams
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {totalExams}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm">
                      <p className="text-xs font-medium text-gray-500">
                        Questions
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {totalQuestions}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // Detail view for selected course
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCourse.title}
          </h1>
          <p className="mt-1 text-gray-500">{selectedCourse.code}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => setSelectedCourseCode(null)}
          className="self-start md:self-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
        >
          ← Back to Courses
        </Button>

      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`border-b-2 px-1 pb-2 ${activeTab === 'questions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Question Pool
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`border-b-2 px-1 pb-2 ${activeTab === 'exams'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Exams
          </button>
        </nav>
      </div>


      {activeTab === 'questions' && (
        <>

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

          <Card className="mt-4 space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
              />

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
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Used In</th>
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
                      <td className="py-3 pr-4 text-gray-900">{q.text}</td>
                      <td className="py-3 pr-4 text-gray-600">{q.type}</td>
                      <td className="py-3 pr-4 text-gray-600">
                        {q.difficulty}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${q.status === 'new'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {q.status === 'new' ? 'New' : 'Old'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {getUsedInCount(q.id)} exams
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
                        No questions found. Try a different search term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'exams' && (
        <Card className="space-y-4 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Exams
            </h2>
            <Button
              className="whitespace-nowrap px-5"
              onClick={openAddExamModal}
            >
              + Create Exam
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">Exam ID</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Duration</th>
                  <th className="py-3 pr-4">Questions</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.exams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 pr-4 text-gray-700">{exam.id}</td>
                    <td className="py-3 pr-4 text-gray-900">{exam.name}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {exam.date}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {exam.durationMinutes} min
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {exam.questionIds.length}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${exam.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditExamModal(exam)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {selectedCourse.exams.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      No exams created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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
                ✕
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

              <div className="grid gap-4 md:grid-cols-3">
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
                        {t}
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

      {isExamModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {examModalMode === 'add'
                    ? 'Create Exam'
                    : 'Edit Exam'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {examModalMode === 'add'
                    ? 'Configure the exam details and select questions from the question pool.'
                    : 'Update the exam details and selected questions.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeExamModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g., Mathematics Mid-Term"
                    value={examForm.name}
                    onChange={handleExamFieldChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={examForm.date}
                    onChange={handleExamFieldChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    min={0}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g., 90"
                    value={examForm.durationMinutes}
                    onChange={handleExamFieldChange}
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
                    value={examForm.status}
                    onChange={handleExamFieldChange}
                    required
                  >
                    {examStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Select Questions from Question Pool
                </p>
                {selectedCourse.questions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No questions available yet. Add questions in the
                    Question Pool tab first.
                  </p>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3">
                    {selectedCourse.questions.map((q) => {
                      const checked = examForm.questionIds.includes(
                        q.id
                      );
                      return (
                        <label
                          key={q.id}
                          className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleExamQuestionToggle(q.id)
                            }
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-medium text-gray-900">
                              {q.id} – {q.text}
                            </p>
                            <p className="text-xs text-gray-500">
                              {q.type} • {q.difficulty}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeExamModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {examModalMode === 'add'
                    ? 'Create Exam'
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
