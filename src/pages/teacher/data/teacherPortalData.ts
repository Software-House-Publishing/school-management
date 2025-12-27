// Teacher Portal Mock Data
// This file contains all mock data for the teacher portal

export type GradeKey = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F' | '-';

export const GRADE_POINTS: Record<Exclude<GradeKey, '-'>, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0,
};

// ============ TEACHER PROFILE ============
export interface TeacherProfile {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  department: string;
  role: string;
  status: 'active' | 'on_leave' | 'resigned';
  office: string;
  officeHours: string;
  joinDate: string;
  qualifications: string[];
  yearsOfExperience: number;
  teachingLicense?: string;
  employmentType: 'full_time' | 'part_time' | 'visiting';
  staffQrId: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export const currentTeacher: TeacherProfile = {
  id: '1',
  teacherId: 'TCH-2024-000001',
  firstName: 'David',
  lastName: 'Smith',
  email: 'david.smith@scitech.edu',
  phone: '+1 555-1001',
  department: 'Mathematics',
  role: 'Senior Teacher',
  status: 'active',
  office: 'Building A, Room 201',
  officeHours: 'Mon/Wed 2-4 PM',
  joinDate: '2018-08-15',
  qualifications: ['Ph.D. Mathematics', 'M.Sc. Applied Math'],
  yearsOfExperience: 12,
  teachingLicense: 'TL-2018-0542',
  employmentType: 'full_time',
  staffQrId: 'STAFF-QR-001',
  twoFactorEnabled: true,
  lastLogin: '2024-12-20 09:15 AM',
};

// ============ COURSES ============
export interface CourseStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  enrollmentDate: string;
  attendancePercentage: number;
  currentGrade: GradeKey;
  midtermGrade: GradeKey;
  finalGrade: GradeKey;
  assignmentScores: { name: string; score: number; maxScore: number; submittedAt?: string }[];
  status: 'active' | 'dropped' | 'withdrawn';
}

export interface CourseAnnouncement {
  id: string;
  title: string;
  body: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  author: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document' | 'image';
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface CourseScheduleSlot {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string;
  endTime: string;
  room: string;
}

export interface TeacherCourse {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  semester: string;
  credits: number;
  schedule: CourseScheduleSlot[];
  room: string;
  students: CourseStudent[];
  announcements: CourseAnnouncement[];
  materials: CourseMaterial[];
  gradingProgress: {
    midterm: number;
    final: number;
  };
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'teal';
}

// Generate mock students for courses
function generateStudents(count: number, courseCode: string): CourseStudent[] {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
  const grades: GradeKey[] = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', '-'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${courseCode}-STU-${String(i + 1).padStart(3, '0')}`,
    studentId: `STU-2024-${String(1000 + i).padStart(6, '0')}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@student.edu`,
    enrollmentDate: '2024-08-20',
    attendancePercentage: Math.floor(75 + Math.random() * 25),
    currentGrade: grades[Math.floor(Math.random() * grades.length)],
    midtermGrade: grades[Math.floor(Math.random() * (grades.length - 1))],
    finalGrade: '-',
    assignmentScores: [
      { name: 'Assignment 1', score: Math.floor(70 + Math.random() * 30), maxScore: 100, submittedAt: '2024-09-15' },
      { name: 'Assignment 2', score: Math.floor(70 + Math.random() * 30), maxScore: 100, submittedAt: '2024-10-01' },
      { name: 'Quiz 1', score: Math.floor(15 + Math.random() * 10), maxScore: 25, submittedAt: '2024-09-20' },
      { name: 'Assignment 3', score: Math.floor(70 + Math.random() * 30), maxScore: 100, submittedAt: '2024-10-20' },
      { name: 'Midterm Project', score: Math.floor(80 + Math.random() * 20), maxScore: 100, submittedAt: '2024-11-01' },
    ],
    status: Math.random() > 0.95 ? 'dropped' : 'active',
  }));
}

export const teacherCourses: TeacherCourse[] = [
  {
    id: 'course-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    semester: 'Fall 2024',
    credits: 3,
    schedule: [
      { day: 'Mon', startTime: '09:00', endTime: '10:30', room: 'SM217' },
      { day: 'Wed', startTime: '09:00', endTime: '10:30', room: 'SM217' },
    ],
    room: 'SM217',
    students: generateStudents(32, 'MATH101'),
    announcements: [
      { id: 'ann-1', title: 'Midterm Exam Next Week', body: 'The midterm exam will be held next Monday. Please review chapters 1-5.', priority: 'urgent', createdAt: '2024-12-20', author: 'David Smith' },
      { id: 'ann-2', title: 'Office Hours Change', body: 'Office hours this week will be on Tuesday instead of Monday due to faculty meeting.', priority: 'important', createdAt: '2024-12-18', author: 'David Smith' },
    ],
    materials: [
      { id: 'mat-1', title: 'Chapter 1 - Limits', type: 'pdf', url: '#', uploadedAt: '2024-08-25', size: '2.4 MB' },
      { id: 'mat-2', title: 'Chapter 2 - Derivatives', type: 'pdf', url: '#', uploadedAt: '2024-09-10', size: '3.1 MB' },
      { id: 'mat-3', title: 'Practice Problems Set 1', type: 'document', url: '#', uploadedAt: '2024-09-15', size: '1.2 MB' },
      { id: 'mat-4', title: 'Lecture Recording - Week 5', type: 'video', url: '#', uploadedAt: '2024-10-01', size: '245 MB' },
    ],
    gradingProgress: { midterm: 100, final: 45 },
    color: 'blue',
  },
  {
    id: 'course-2',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'B',
    semester: 'Fall 2024',
    credits: 3,
    schedule: [
      { day: 'Tue', startTime: '14:00', endTime: '15:30', room: 'SM220' },
      { day: 'Thu', startTime: '14:00', endTime: '15:30', room: 'SM220' },
    ],
    room: 'SM220',
    students: generateStudents(28, 'MATH101-B'),
    announcements: [
      { id: 'ann-3', title: 'Assignment 4 Posted', body: 'Assignment 4 is now available. Due date is next Friday.', priority: 'normal', createdAt: '2024-12-19', author: 'David Smith' },
    ],
    materials: [
      { id: 'mat-5', title: 'Chapter 1 - Limits', type: 'pdf', url: '#', uploadedAt: '2024-08-25', size: '2.4 MB' },
      { id: 'mat-6', title: 'Chapter 2 - Derivatives', type: 'pdf', url: '#', uploadedAt: '2024-09-10', size: '3.1 MB' },
    ],
    gradingProgress: { midterm: 100, final: 32 },
    color: 'blue',
  },
  {
    id: 'course-3',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    semester: 'Fall 2024',
    credits: 4,
    schedule: [
      { day: 'Mon', startTime: '11:00', endTime: '12:30', room: 'SM305' },
      { day: 'Wed', startTime: '11:00', endTime: '12:30', room: 'SM305' },
      { day: 'Fri', startTime: '11:00', endTime: '12:00', room: 'SM305' },
    ],
    room: 'SM305',
    students: generateStudents(35, 'MATH201'),
    announcements: [
      { id: 'ann-4', title: 'Guest Lecture on Friday', body: 'Dr. Chen will give a guest lecture on applications of linear algebra in machine learning.', priority: 'important', createdAt: '2024-12-17', author: 'David Smith' },
    ],
    materials: [
      { id: 'mat-7', title: 'Vector Spaces Introduction', type: 'pdf', url: '#', uploadedAt: '2024-08-28', size: '1.8 MB' },
      { id: 'mat-8', title: 'Matrix Operations', type: 'pdf', url: '#', uploadedAt: '2024-09-05', size: '2.2 MB' },
      { id: 'mat-9', title: 'Eigenvalues Tutorial', type: 'video', url: '#', uploadedAt: '2024-10-15', size: '180 MB' },
    ],
    gradingProgress: { midterm: 100, final: 20 },
    color: 'green',
  },
  {
    id: 'course-4',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    section: 'A',
    semester: 'Fall 2024',
    credits: 4,
    schedule: [
      { day: 'Tue', startTime: '09:00', endTime: '10:30', room: 'SM401' },
      { day: 'Thu', startTime: '09:00', endTime: '10:30', room: 'SM401' },
    ],
    room: 'SM401',
    students: generateStudents(28, 'MATH301'),
    announcements: [],
    materials: [
      { id: 'mat-10', title: 'First Order ODEs', type: 'pdf', url: '#', uploadedAt: '2024-08-30', size: '2.6 MB' },
      { id: 'mat-11', title: 'Second Order ODEs', type: 'pdf', url: '#', uploadedAt: '2024-09-20', size: '3.0 MB' },
    ],
    gradingProgress: { midterm: 95, final: 0 },
    color: 'purple',
  },
];

// ============ TODAY'S SCHEDULE ============
export interface TodayClass {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  startTime: string;
  endTime: string;
  room: string;
  studentCount: number;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'teal';
}

export function getTodayClasses(): TodayClass[] {
  const today = new Date();
  const dayIndex = today.getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = days[dayIndex];

  const classes: TodayClass[] = [];

  teacherCourses.forEach(course => {
    course.schedule.forEach(slot => {
      if (slot.day === todayName) {
        classes.push({
          id: `${course.id}-${slot.day}-${slot.startTime}`,
          courseCode: course.courseCode,
          courseName: course.courseName,
          section: course.section,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          studentCount: course.students.filter(s => s.status === 'active').length,
          color: course.color,
        });
      }
    });
  });

  return classes.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

// For demo purposes, always show some classes
export const mockTodayClasses: TodayClass[] = [
  {
    id: 'today-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    startTime: '09:00',
    endTime: '10:30',
    room: 'SM217',
    studentCount: 32,
    color: 'blue',
  },
  {
    id: 'today-2',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    startTime: '11:00',
    endTime: '12:30',
    room: 'SM305',
    studentCount: 35,
    color: 'green',
  },
  {
    id: 'today-3',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'B',
    startTime: '14:00',
    endTime: '15:30',
    room: 'SM220',
    studentCount: 28,
    color: 'blue',
  },
];

// ============ QUESTION POOL ============
export interface Question {
  id: string;
  courseCode: string;
  courseName: string;
  questionText: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  options?: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  isNew: boolean; // New vs Old indicator
  usageCount: number;
  createdAt: string;
  createdBy: string;
  tags?: string[];
  // For approval workflow - questions created by teachers need admin approval
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  submittedForApprovalAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export const questionPool: Question[] = [
  // MATH101 - Calculus I Questions
  {
    id: 'Q001',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'What is the derivative of f(x) = x³ + 2x² - 5x + 3?',
    type: 'multiple_choice',
    difficulty: 'easy',
    points: 5,
    options: [
      { id: 'a', text: '3x² + 4x - 5', isCorrect: true },
      { id: 'b', text: '3x² + 4x + 5', isCorrect: false },
      { id: 'c', text: 'x² + 4x - 5', isCorrect: false },
      { id: 'd', text: '3x² + 2x - 5', isCorrect: false },
    ],
    isNew: false,
    usageCount: 8,
    createdAt: '2024-01-15',
    createdBy: 'David Smith',
    tags: ['derivatives', 'polynomial'],
  },
  {
    id: 'Q002',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'Evaluate the limit: lim(x→0) (sin x)/x',
    type: 'multiple_choice',
    difficulty: 'medium',
    points: 5,
    options: [
      { id: 'a', text: '0', isCorrect: false },
      { id: 'b', text: '1', isCorrect: true },
      { id: 'c', text: '∞', isCorrect: false },
      { id: 'd', text: 'Does not exist', isCorrect: false },
    ],
    isNew: false,
    usageCount: 12,
    createdAt: '2024-01-10',
    createdBy: 'David Smith',
    tags: ['limits', 'trigonometry'],
  },
  {
    id: 'Q003',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'Find the integral: ∫(2x + 3)dx',
    type: 'short_answer',
    difficulty: 'easy',
    points: 10,
    correctAnswer: 'x² + 3x + C',
    isNew: true,
    usageCount: 0,
    createdAt: '2024-12-15',
    createdBy: 'David Smith',
    tags: ['integration', 'basic'],
  },
  {
    id: 'Q004',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'The derivative of a constant is always zero.',
    type: 'true_false',
    difficulty: 'easy',
    points: 2,
    correctAnswer: 'true',
    isNew: false,
    usageCount: 15,
    createdAt: '2024-02-01',
    createdBy: 'David Smith',
    tags: ['derivatives', 'basics'],
  },
  {
    id: 'Q005',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'Explain the concept of continuity at a point. Include the three conditions that must be satisfied for a function to be continuous at x = a.',
    type: 'essay',
    difficulty: 'hard',
    points: 20,
    isNew: true,
    usageCount: 0,
    createdAt: '2024-12-18',
    createdBy: 'David Smith',
    tags: ['continuity', 'theory'],
  },
  {
    id: 'Q006',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'Use the chain rule to find the derivative of f(x) = sin(x²).',
    type: 'short_answer',
    difficulty: 'medium',
    points: 10,
    correctAnswer: '2x·cos(x²)',
    isNew: false,
    usageCount: 6,
    createdAt: '2024-03-10',
    createdBy: 'David Smith',
    tags: ['derivatives', 'chain rule'],
  },
  {
    id: 'Q007',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    questionText: 'What is the derivative of ln(x)?',
    type: 'multiple_choice',
    difficulty: 'easy',
    points: 5,
    options: [
      { id: 'a', text: '1/x', isCorrect: true },
      { id: 'b', text: 'x', isCorrect: false },
      { id: 'c', text: 'ln(x)', isCorrect: false },
      { id: 'd', text: 'e^x', isCorrect: false },
    ],
    isNew: false,
    usageCount: 10,
    createdAt: '2024-01-20',
    createdBy: 'David Smith',
    tags: ['derivatives', 'logarithm'],
  },
  // MATH201 - Linear Algebra Questions
  {
    id: 'Q008',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
    type: 'multiple_choice',
    difficulty: 'easy',
    points: 5,
    options: [
      { id: 'a', text: 'ad - bc', isCorrect: true },
      { id: 'b', text: 'ad + bc', isCorrect: false },
      { id: 'c', text: 'ab - cd', isCorrect: false },
      { id: 'd', text: 'ac - bd', isCorrect: false },
    ],
    isNew: false,
    usageCount: 14,
    createdAt: '2024-02-05',
    createdBy: 'David Smith',
    tags: ['determinant', 'matrices'],
  },
  {
    id: 'Q009',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
    type: 'short_answer',
    difficulty: 'hard',
    points: 15,
    correctAnswer: '5, 2',
    isNew: true,
    usageCount: 0,
    createdAt: '2024-12-10',
    createdBy: 'David Smith',
    tags: ['eigenvalues', 'matrices'],
  },
  {
    id: 'Q010',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    questionText: 'Explain the geometric interpretation of eigenvalues and eigenvectors. Provide at least one real-world application.',
    type: 'essay',
    difficulty: 'hard',
    points: 25,
    isNew: false,
    usageCount: 3,
    createdAt: '2024-09-15',
    createdBy: 'David Smith',
    tags: ['eigenvalues', 'theory', 'applications'],
  },
  {
    id: 'Q011',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
    type: 'true_false',
    difficulty: 'medium',
    points: 3,
    correctAnswer: 'true',
    isNew: false,
    usageCount: 9,
    createdAt: '2024-03-01',
    createdBy: 'David Smith',
    tags: ['invertibility', 'determinant'],
  },
  // MATH301 - Differential Equations Questions
  {
    id: 'Q012',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    questionText: 'Solve the first-order ODE: dy/dx = 2x, given y(0) = 1',
    type: 'short_answer',
    difficulty: 'easy',
    points: 10,
    correctAnswer: 'y = x² + 1',
    isNew: false,
    usageCount: 7,
    createdAt: '2024-04-10',
    createdBy: 'David Smith',
    tags: ['first-order', 'initial value'],
  },
  {
    id: 'Q013',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    questionText: 'Which method is most appropriate for solving y\'\' + 4y = 0?',
    type: 'multiple_choice',
    difficulty: 'medium',
    points: 5,
    options: [
      { id: 'a', text: 'Separation of variables', isCorrect: false },
      { id: 'b', text: 'Characteristic equation', isCorrect: true },
      { id: 'c', text: 'Exact equations', isCorrect: false },
      { id: 'd', text: 'Bernoulli equation', isCorrect: false },
    ],
    isNew: true,
    usageCount: 0,
    createdAt: '2024-12-20',
    createdBy: 'David Smith',
    tags: ['second-order', 'methods'],
  },
  {
    id: 'Q014',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    questionText: 'Discuss the applications of differential equations in modeling population growth. Include both the exponential and logistic models.',
    type: 'essay',
    difficulty: 'hard',
    points: 30,
    isNew: true,
    usageCount: 0,
    createdAt: '2024-12-19',
    createdBy: 'David Smith',
    tags: ['applications', 'modeling', 'population'],
  },
];

// Helper to get questions by course
export function getQuestionsByCourse(courseCode: string): Question[] {
  return questionPool.filter(q => q.courseCode === courseCode);
}

// ============ EXAMS ============
export interface ExamQuestion {
  questionId: string;
  order: number;
  points: number;
}

export interface Exam {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  section: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment';
  title: string;
  date: string;
  startTime: string;
  duration: number; // in minutes
  location: string;
  maxScore: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'grading' | 'graded';
  gradedCount: number;
  totalStudents: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  questions?: ExamQuestion[]; // Questions assigned to this exam
  // Approval workflow - exams need admin approval before students can see them
  approvalStatus: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  submittedForApprovalAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
}

export const teacherExams: Exam[] = [
  {
    id: 'exam-1',
    courseId: 'course-1',
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
    gradedCount: 32,
    totalStudents: 32,
    averageScore: 78.5,
    highestScore: 98,
    lowestScore: 52,
    approvalStatus: 'approved',
    approvedBy: 'Dr. Robert Brown',
    approvedAt: '2024-10-10T10:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-10-01T09:00:00',
  },
  {
    id: 'exam-2',
    courseId: 'course-1',
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
    status: 'scheduled',
    gradedCount: 0,
    totalStudents: 32,
    approvalStatus: 'approved',
    approvedBy: 'Dr. Robert Brown',
    approvedAt: '2024-12-20T14:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-12-15T10:00:00',
  },
  {
    id: 'exam-3',
    courseId: 'course-2',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'B',
    examType: 'midterm',
    title: 'Midterm Examination',
    date: '2024-10-16',
    startTime: '14:00',
    duration: 120,
    location: 'Exam Hall B',
    maxScore: 100,
    status: 'graded',
    gradedCount: 28,
    totalStudents: 28,
    averageScore: 75.2,
    highestScore: 95,
    lowestScore: 48,
    approvalStatus: 'approved',
    approvedBy: 'Dr. Robert Brown',
    approvedAt: '2024-10-11T11:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-10-02T09:00:00',
  },
  {
    id: 'exam-4',
    courseId: 'course-3',
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
    status: 'grading',
    gradedCount: 20,
    totalStudents: 35,
    averageScore: 19.5,
    highestScore: 25,
    lowestScore: 12,
    approvalStatus: 'approved',
    approvedBy: 'Dr. Robert Brown',
    approvedAt: '2024-12-18T09:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-12-15T08:00:00',
  },
  {
    id: 'exam-5',
    courseId: 'course-4',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    section: 'A',
    examType: 'midterm',
    title: 'Midterm Examination',
    date: '2024-10-18',
    startTime: '09:00',
    duration: 120,
    location: 'SM401',
    maxScore: 100,
    status: 'graded',
    gradedCount: 28,
    totalStudents: 28,
    averageScore: 82.3,
    highestScore: 100,
    lowestScore: 58,
    approvalStatus: 'approved',
    approvedBy: 'Dr. Robert Brown',
    approvedAt: '2024-10-13T10:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-10-05T09:00:00',
  },
  {
    id: 'exam-6',
    courseId: 'course-3',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    examType: 'final',
    title: 'Final Examination',
    date: '2024-12-30',
    startTime: '11:00',
    duration: 180,
    location: 'Exam Hall C',
    maxScore: 100,
    status: 'scheduled',
    gradedCount: 0,
    totalStudents: 35,
    approvalStatus: 'pending_approval',
    submittedForApprovalAt: '2024-12-25T10:00:00',
    createdBy: 'David Smith',
    createdAt: '2024-12-24T14:00:00',
  },
  // Example of a draft exam (not yet submitted for approval)
  {
    id: 'exam-7',
    courseId: 'course-4',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    section: 'A',
    examType: 'quiz',
    title: 'Quiz 4 - Laplace Transforms',
    date: '2025-01-10',
    startTime: '09:00',
    duration: 45,
    location: 'SM401',
    maxScore: 30,
    status: 'scheduled',
    gradedCount: 0,
    totalStudents: 28,
    approvalStatus: 'draft',
    createdBy: 'David Smith',
    createdAt: '2024-12-27T11:00:00',
  },
  // Example of a rejected exam
  {
    id: 'exam-8',
    courseId: 'course-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    examType: 'quiz',
    title: 'Pop Quiz - Integrals',
    date: '2025-01-05',
    startTime: '10:00',
    duration: 20,
    location: 'SM217',
    maxScore: 20,
    status: 'scheduled',
    gradedCount: 0,
    totalStudents: 32,
    approvalStatus: 'rejected',
    submittedForApprovalAt: '2024-12-22T09:00:00',
    rejectionReason: 'Questions overlap with upcoming final exam. Please revise.',
    createdBy: 'David Smith',
    createdAt: '2024-12-21T16:00:00',
  },
];

// ============ ANNOUNCEMENTS ============
export interface Announcement {
  id: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  section?: string;
  scope: 'course' | 'department' | 'school';
  title: string;
  body: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  author: string;
  isOwn: boolean;
  readCount?: number;
  totalRecipients?: number;
}

export const teacherAnnouncements: Announcement[] = [
  // Own announcements (course-specific)
  {
    id: 'tann-1',
    courseId: 'course-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    scope: 'course',
    title: 'Midterm Exam Next Week',
    body: 'The midterm exam will be held next Monday. Please review chapters 1-5. Make sure to bring your student ID and a calculator.',
    priority: 'urgent',
    createdAt: '2024-12-20T10:30:00',
    author: 'David Smith',
    isOwn: true,
    readCount: 28,
    totalRecipients: 32,
  },
  {
    id: 'tann-2',
    courseId: 'course-1',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'A',
    scope: 'course',
    title: 'Office Hours Change',
    body: 'Office hours this week will be on Tuesday instead of Monday due to faculty meeting.',
    priority: 'important',
    createdAt: '2024-12-18T14:00:00',
    author: 'David Smith',
    isOwn: true,
    readCount: 25,
    totalRecipients: 32,
  },
  {
    id: 'tann-3',
    courseId: 'course-3',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    section: 'A',
    scope: 'course',
    title: 'Guest Lecture on Friday',
    body: 'Dr. Chen will give a guest lecture on applications of linear algebra in machine learning. Attendance is mandatory.',
    priority: 'important',
    createdAt: '2024-12-17T09:00:00',
    author: 'David Smith',
    isOwn: true,
    readCount: 30,
    totalRecipients: 35,
  },
  {
    id: 'tann-4',
    courseId: 'course-2',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    section: 'B',
    scope: 'course',
    title: 'Assignment 4 Posted',
    body: 'Assignment 4 is now available on the course portal. Due date is next Friday. Late submissions will receive a 10% penalty per day.',
    priority: 'normal',
    createdAt: '2024-12-19T11:00:00',
    author: 'David Smith',
    isOwn: true,
    readCount: 22,
    totalRecipients: 28,
  },
  // Department/School announcements (read-only for teacher)
  {
    id: 'tann-5',
    scope: 'department',
    title: 'Faculty Meeting - December 22',
    body: 'All Mathematics department faculty are required to attend the end-of-semester meeting. Agenda includes curriculum review and spring semester planning.',
    priority: 'important',
    createdAt: '2024-12-15T08:00:00',
    author: 'Dr. Robert Brown (HOD)',
    isOwn: false,
  },
  {
    id: 'tann-6',
    scope: 'school',
    title: 'Winter Break Schedule',
    body: 'The university will be closed from December 24 to January 2. All grades must be submitted before December 23.',
    priority: 'urgent',
    createdAt: '2024-12-10T10:00:00',
    author: 'Academic Office',
    isOwn: false,
  },
  {
    id: 'tann-7',
    scope: 'school',
    title: 'New Learning Management System',
    body: 'We are transitioning to a new LMS next semester. Training sessions will be held in January. More details to follow.',
    priority: 'normal',
    createdAt: '2024-12-05T14:00:00',
    author: 'IT Department',
    isOwn: false,
  },
];

// ============ LEAVE MANAGEMENT ============
export interface LeaveRequest {
  id: string;
  type: 'sick' | 'casual' | 'medical' | 'personal' | 'conference';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerComments?: string;
}

export interface LeaveBalance {
  sick: { total: number; used: number; remaining: number };
  casual: { total: number; used: number; remaining: number };
  personal: { total: number; used: number; remaining: number };
}

export const leaveBalance: LeaveBalance = {
  sick: { total: 12, used: 4, remaining: 8 },
  casual: { total: 10, used: 5, remaining: 5 },
  personal: { total: 5, used: 2, remaining: 3 },
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    type: 'casual',
    startDate: '2024-11-20',
    endDate: '2024-11-22',
    days: 3,
    reason: 'Family event',
    status: 'approved',
    submittedAt: '2024-11-15T10:00:00',
    reviewedBy: 'Dr. Robert Brown',
    reviewedAt: '2024-11-16T14:00:00',
    reviewerComments: 'Approved. Please ensure class coverage.',
  },
  {
    id: 'leave-2',
    type: 'sick',
    startDate: '2024-10-05',
    endDate: '2024-10-06',
    days: 2,
    reason: 'Fever and cold',
    status: 'approved',
    submittedAt: '2024-10-05T08:00:00',
    reviewedBy: 'Dr. Robert Brown',
    reviewedAt: '2024-10-05T09:00:00',
  },
  {
    id: 'leave-3',
    type: 'conference',
    startDate: '2025-01-15',
    endDate: '2025-01-18',
    days: 4,
    reason: 'Attending International Mathematics Conference in Boston',
    status: 'pending',
    submittedAt: '2024-12-18T11:00:00',
  },
];

// ============ DOCUMENTS ============
export interface TeacherDocument {
  id: string;
  name: string;
  type: 'contract' | 'certificate' | 'license' | 'id' | 'other';
  status: 'uploaded' | 'pending' | 'expired';
  uploadedAt?: string;
  expiresAt?: string;
  fileUrl?: string;
  fileSize?: string;
}

export const teacherDocuments: TeacherDocument[] = [
  { id: 'doc-1', name: 'Employment Contract', type: 'contract', status: 'uploaded', uploadedAt: '2024-01-01', fileSize: '1.2 MB' },
  { id: 'doc-2', name: 'Ph.D. Certificate', type: 'certificate', status: 'uploaded', uploadedAt: '2018-06-15', fileSize: '2.4 MB' },
  { id: 'doc-3', name: 'Teaching License', type: 'license', status: 'uploaded', uploadedAt: '2023-08-01', expiresAt: '2026-08-01', fileSize: '0.8 MB' },
  { id: 'doc-4', name: 'National ID', type: 'id', status: 'uploaded', uploadedAt: '2024-01-01', fileSize: '0.5 MB' },
  { id: 'doc-5', name: 'Background Check', type: 'other', status: 'uploaded', uploadedAt: '2024-01-01', fileSize: '0.3 MB' },
  { id: 'doc-6', name: 'First Aid Certificate', type: 'certificate', status: 'expired', uploadedAt: '2022-03-01', expiresAt: '2024-03-01', fileSize: '0.6 MB' },
];

// ============ PENDING TASKS / ACTION ITEMS ============
export interface ActionItem {
  id: string;
  type: 'grade' | 'attendance' | 'material' | 'exam' | 'document';
  title: string;
  description: string;
  courseCode?: string;
  courseName?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  link?: string;
}

export const actionItems: ActionItem[] = [
  {
    id: 'action-1',
    type: 'grade',
    title: 'Submit Final Grades - MATH101 Section A',
    description: '15 students still need final grades',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    dueDate: '2024-12-23',
    priority: 'high',
  },
  {
    id: 'action-2',
    type: 'grade',
    title: 'Complete Quiz Grading - MATH201',
    description: '15 quizzes pending review',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    dueDate: '2024-12-22',
    priority: 'high',
  },
  {
    id: 'action-3',
    type: 'attendance',
    title: 'Submit Attendance - MATH301',
    description: 'Today\'s attendance not yet submitted',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    priority: 'medium',
  },
  {
    id: 'action-4',
    type: 'material',
    title: 'Upload Final Review Materials',
    description: 'Students requesting review materials for finals',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    dueDate: '2024-12-24',
    priority: 'medium',
  },
  {
    id: 'action-5',
    type: 'document',
    title: 'Renew First Aid Certificate',
    description: 'Certificate expired on March 2024',
    priority: 'low',
  },
];

// ============ WEEKLY SCHEDULE ============
export interface WeeklyScheduleSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  section: string;
  room: string;
  studentCount: number;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'teal';
}

export function getWeeklySchedule(): WeeklyScheduleSlot[] {
  const slots: WeeklyScheduleSlot[] = [];

  teacherCourses.forEach(course => {
    course.schedule.forEach(slot => {
      slots.push({
        id: `${course.id}-${slot.day}-${slot.startTime}`,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        courseCode: course.courseCode,
        courseName: course.courseName,
        section: course.section,
        room: slot.room,
        studentCount: course.students.filter(s => s.status === 'active').length,
        color: course.color,
      });
    });
  });

  return slots;
}

// ============ ATTENDANCE DATA ============
export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface CourseAttendance {
  courseId: string;
  records: AttendanceRecord[];
}

// Generate mock attendance for the current month
export function generateAttendanceData(courseId: string, students: CourseStudent[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: ('present' | 'absent' | 'late' | 'excused')[] = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'late', 'absent'];

  // Generate for last 10 class days
  const dates = [
    '2024-12-02', '2024-12-04', '2024-12-06', '2024-12-09', '2024-12-11',
    '2024-12-13', '2024-12-16', '2024-12-18', '2024-12-20',
  ];

  dates.forEach(date => {
    students.forEach(student => {
      if (student.status === 'active') {
        records.push({
          date,
          studentId: student.id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
    });
  });

  return records;
}

// ============ STUDENT SUBMISSIONS ============
export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  assignmentName: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'late';
  score?: number;
  maxScore: number;
  feedback?: string;
}

export const recentSubmissions: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'STU-2024-001001',
    studentName: 'Emma Johnson',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    assignmentName: 'Assignment 4 - Integration',
    submittedAt: '2024-12-20T14:30:00',
    status: 'pending',
    maxScore: 100,
  },
  {
    id: 'sub-2',
    studentId: 'STU-2024-001002',
    studentName: 'Liam Williams',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    assignmentName: 'Assignment 4 - Integration',
    submittedAt: '2024-12-20T13:45:00',
    status: 'pending',
    maxScore: 100,
  },
  {
    id: 'sub-3',
    studentId: 'STU-2024-001003',
    studentName: 'Olivia Brown',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    assignmentName: 'Problem Set 5',
    submittedAt: '2024-12-20T11:20:00',
    status: 'pending',
    maxScore: 50,
  },
  {
    id: 'sub-4',
    studentId: 'STU-2024-001004',
    studentName: 'Noah Jones',
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    assignmentName: 'Lab Report 3',
    submittedAt: '2024-12-19T23:55:00',
    status: 'late',
    maxScore: 100,
  },
  {
    id: 'sub-5',
    studentId: 'STU-2024-001005',
    studentName: 'Ava Garcia',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    assignmentName: 'Assignment 3 - Derivatives',
    submittedAt: '2024-12-15T10:00:00',
    status: 'graded',
    score: 92,
    maxScore: 100,
    feedback: 'Excellent work! Good understanding of chain rule.',
  },
];

// ============ DASHBOARD STATS ============
export interface DashboardStats {
  activeCourses: number;
  totalSections: number;
  totalStudents: number;
  pendingGrades: number;
  upcomingExams: number;
  attendanceRate: number;
  pendingSubmissions: number;
}

export function getDashboardStats(): DashboardStats {
  const uniqueCourses = new Set(teacherCourses.map(c => c.courseCode));
  const totalStudents = teacherCourses.reduce((sum, c) => sum + c.students.filter(s => s.status === 'active').length, 0);
  const pendingGrades = teacherCourses.reduce((sum, c) => {
    const ungradedFinal = c.students.filter(s => s.status === 'active' && s.finalGrade === '-').length;
    return sum + Math.floor(ungradedFinal * (1 - c.gradingProgress.final / 100));
  }, 0);
  const upcomingExams = teacherExams.filter(e => e.status === 'scheduled').length;

  return {
    activeCourses: uniqueCourses.size,
    totalSections: teacherCourses.length,
    totalStudents,
    pendingGrades,
    upcomingExams,
    attendanceRate: 96,
    pendingSubmissions: recentSubmissions.filter(s => s.status === 'pending').length,
  };
}

// ============ HELPER FUNCTIONS ============
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatDateTime(dateTimeStr: string): string {
  return new Date(dateTimeStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getGradeColor(grade: GradeKey): string {
  if (grade === '-') return 'text-slate-400';
  if (grade.startsWith('A')) return 'text-emerald-600';
  if (grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('C')) return 'text-amber-600';
  return 'text-red-600';
}

export function getCourseColor(color: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
    teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200' },
  };
  return colors[color] || colors.blue;
}

// ============ EXAM SUBMISSIONS (For Grading) ============
export interface QuestionAnswer {
  questionId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  studentAnswer: string;
  correctAnswer?: string;
  isCorrect?: boolean; // For auto-graded questions
  points: number;
  earnedPoints?: number;
  feedback?: string;
  needsManualGrading: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'partial';
  totalScore?: number;
  maxScore: number;
  answers: QuestionAnswer[];
  overallFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

// Generate mock exam submissions for grading
export function getExamSubmissions(examId: string): ExamSubmission[] {
  // For the grading exam (exam-4: Quiz 3 - Eigenvalues)
  if (examId === 'exam-4') {
    return [
      {
        id: 'esub-1',
        examId: 'exam-4',
        studentId: 'STU-2024-001000',
        studentName: 'Emma Johnson',
        submittedAt: '2024-12-20T11:28:00',
        status: 'graded',
        totalScore: 22,
        maxScore: 25,
        answers: [
          {
            questionId: 'Q008',
            questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
            questionType: 'multiple_choice',
            studentAnswer: 'a',
            correctAnswer: 'a',
            isCorrect: true,
            points: 5,
            earnedPoints: 5,
            needsManualGrading: false,
          },
          {
            questionId: 'Q009',
            questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
            questionType: 'short_answer',
            studentAnswer: '5, 2',
            correctAnswer: '5, 2',
            isCorrect: true,
            points: 15,
            earnedPoints: 15,
            needsManualGrading: false,
          },
          {
            questionId: 'Q011',
            questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
            questionType: 'true_false',
            studentAnswer: 'true',
            correctAnswer: 'true',
            isCorrect: true,
            points: 3,
            earnedPoints: 3,
            needsManualGrading: false,
          },
        ],
        gradedBy: 'System (Auto)',
        gradedAt: '2024-12-20T11:30:00',
      },
      {
        id: 'esub-2',
        examId: 'exam-4',
        studentId: 'STU-2024-001001',
        studentName: 'Liam Williams',
        submittedAt: '2024-12-20T11:25:00',
        status: 'graded',
        totalScore: 18,
        maxScore: 25,
        answers: [
          {
            questionId: 'Q008',
            questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
            questionType: 'multiple_choice',
            studentAnswer: 'a',
            correctAnswer: 'a',
            isCorrect: true,
            points: 5,
            earnedPoints: 5,
            needsManualGrading: false,
          },
          {
            questionId: 'Q009',
            questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
            questionType: 'short_answer',
            studentAnswer: '4, 3',
            correctAnswer: '5, 2',
            isCorrect: false,
            points: 15,
            earnedPoints: 10,
            feedback: 'Partial credit - correct method but calculation error',
            needsManualGrading: false,
          },
          {
            questionId: 'Q011',
            questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
            questionType: 'true_false',
            studentAnswer: 'true',
            correctAnswer: 'true',
            isCorrect: true,
            points: 3,
            earnedPoints: 3,
            needsManualGrading: false,
          },
        ],
        gradedBy: 'David Smith',
        gradedAt: '2024-12-20T14:00:00',
      },
      {
        id: 'esub-3',
        examId: 'exam-4',
        studentId: 'STU-2024-001002',
        studentName: 'Olivia Brown',
        submittedAt: '2024-12-20T11:29:00',
        status: 'pending',
        maxScore: 25,
        answers: [
          {
            questionId: 'Q008',
            questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
            questionType: 'multiple_choice',
            studentAnswer: 'b',
            correctAnswer: 'a',
            isCorrect: false,
            points: 5,
            earnedPoints: 0,
            needsManualGrading: false,
          },
          {
            questionId: 'Q009',
            questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
            questionType: 'short_answer',
            studentAnswer: 'λ = 5, λ = 2',
            correctAnswer: '5, 2',
            points: 15,
            needsManualGrading: true, // Format different, needs review
          },
          {
            questionId: 'Q011',
            questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
            questionType: 'true_false',
            studentAnswer: 'false',
            correctAnswer: 'true',
            isCorrect: false,
            points: 3,
            earnedPoints: 0,
            needsManualGrading: false,
          },
        ],
      },
      {
        id: 'esub-4',
        examId: 'exam-4',
        studentId: 'STU-2024-001003',
        studentName: 'Noah Jones',
        submittedAt: '2024-12-20T11:27:00',
        status: 'pending',
        maxScore: 25,
        answers: [
          {
            questionId: 'Q008',
            questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
            questionType: 'multiple_choice',
            studentAnswer: 'a',
            correctAnswer: 'a',
            isCorrect: true,
            points: 5,
            earnedPoints: 5,
            needsManualGrading: false,
          },
          {
            questionId: 'Q009',
            questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
            questionType: 'short_answer',
            studentAnswer: '5 and 2',
            correctAnswer: '5, 2',
            points: 15,
            needsManualGrading: true,
          },
          {
            questionId: 'Q011',
            questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
            questionType: 'true_false',
            studentAnswer: 'true',
            correctAnswer: 'true',
            isCorrect: true,
            points: 3,
            earnedPoints: 3,
            needsManualGrading: false,
          },
        ],
      },
      {
        id: 'esub-5',
        examId: 'exam-4',
        studentId: 'STU-2024-001004',
        studentName: 'Ava Garcia',
        submittedAt: '2024-12-20T11:30:00',
        status: 'graded',
        totalScore: 25,
        maxScore: 25,
        answers: [
          {
            questionId: 'Q008',
            questionText: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
            questionType: 'multiple_choice',
            studentAnswer: 'a',
            correctAnswer: 'a',
            isCorrect: true,
            points: 5,
            earnedPoints: 5,
            needsManualGrading: false,
          },
          {
            questionId: 'Q009',
            questionText: 'Find the eigenvalues of the matrix [[4, 2], [1, 3]].',
            questionType: 'short_answer',
            studentAnswer: '5, 2',
            correctAnswer: '5, 2',
            isCorrect: true,
            points: 15,
            earnedPoints: 15,
            needsManualGrading: false,
          },
          {
            questionId: 'Q011',
            questionText: 'A matrix is invertible if and only if its determinant is non-zero.',
            questionType: 'true_false',
            studentAnswer: 'true',
            correctAnswer: 'true',
            isCorrect: true,
            points: 3,
            earnedPoints: 3,
            needsManualGrading: false,
          },
        ],
        overallFeedback: 'Perfect score! Excellent understanding of the material.',
        gradedBy: 'System (Auto)',
        gradedAt: '2024-12-20T11:32:00',
      },
    ];
  }

  // For midterm exam (exam-1)
  if (examId === 'exam-1') {
    const students = teacherCourses[0].students.slice(0, 10);
    return students.map((student, idx) => ({
      id: `esub-mid-${idx}`,
      examId: 'exam-1',
      studentId: student.studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      submittedAt: '2024-10-15T11:00:00',
      status: 'graded' as const,
      totalScore: 65 + Math.floor(Math.random() * 35),
      maxScore: 100,
      answers: [],
      gradedBy: 'David Smith',
      gradedAt: '2024-10-18T14:00:00',
    }));
  }

  return [];
}
