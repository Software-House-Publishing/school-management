export type TeacherStatus = 'active' | 'on_leave' | 'resigned';
export type EmploymentType = 'full_time' | 'part_time' | 'visiting';

export interface CourseAssignment {
  courseCode: string;
  courseName: string;
  sections: number;
  students: number;
  schedule?: string;
}

export interface TeachingInfo {
  assignedCourses: CourseAssignment[];
  totalSections: number;
  totalStudents: number;
  weeklyHours: number;
  academicTerm: string;
}

export interface OperationsInfo {
  attendanceSubmissionRate: number; // percentage
  gradingProgress: {
    midterm: number;
    final: number;
  };
  pendingTasks: number;
  lateSubmissions: number;
}

export interface LeaveInfo {
  sickLeaveBalance: number;
  casualLeaveBalance: number;
  requests: Array<{
    type: string;
    startDate: string;
    endDate: string;
    status: 'approved' | 'pending' | 'rejected';
  }>;
}

export interface EmploymentInfo {
  type: EmploymentType;
  role: string;
  joinDate: string;
  contractStart?: string;
  contractEnd?: string;
  qualifications: string[];
  yearsOfExperience: number;
  teachingLicense?: string;
  salaryGrade?: string;
}

export interface SystemInfo {
  portalUsername?: string;
  portalActive?: boolean;
  lastLogin?: string;
  twoFactorEnabled?: boolean;
  staffQrId?: string;
}

export interface DocumentInfo {
  type: string;
  uploaded: boolean;
  url?: string;
}

export interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  photoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  department: string;
  status: TeacherStatus;
  office?: string;
  officeHours?: string;

  employment: EmploymentInfo;
  teaching: TeachingInfo;
  operations: OperationsInfo;
  leave: LeaveInfo;
  system?: SystemInfo;
  documents?: DocumentInfo[];
}

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    teacherId: 'TCH-2024-000001',
    firstName: 'David',
    lastName: 'Smith',
    gender: 'Male',
    dateOfBirth: '1985-03-15',
    address: '123 Oak Street, Springfield',
    phone: '+1 555-1001',
    email: 'david.smith@scitech.edu',
    emergencyContact: {
      name: 'Sarah Smith',
      phone: '+1 555-1002',
      relationship: 'Spouse',
    },
    department: 'Mathematics',
    status: 'active',
    office: 'Building A, Room 201',
    officeHours: 'Mon/Wed 2-4 PM',
    employment: {
      type: 'full_time',
      role: 'Senior Teacher',
      joinDate: '2018-08-15',
      contractStart: '2024-01-01',
      contractEnd: '2026-12-31',
      qualifications: ['Ph.D. Mathematics', 'M.Sc. Applied Math'],
      yearsOfExperience: 12,
      teachingLicense: 'TL-2018-0542',
      salaryGrade: 'Grade A',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'MATH101', courseName: 'Calculus I', sections: 2, students: 60, schedule: 'Mon/Wed 9-10:30 AM' },
        { courseCode: 'MATH201', courseName: 'Linear Algebra', sections: 1, students: 35, schedule: 'Tue/Thu 11 AM-12:30 PM' },
        { courseCode: 'MATH301', courseName: 'Differential Equations', sections: 1, students: 28, schedule: 'Fri 2-5 PM' },
      ],
      totalSections: 4,
      totalStudents: 123,
      weeklyHours: 16,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 98,
      gradingProgress: { midterm: 100, final: 45 },
      pendingTasks: 2,
      lateSubmissions: 0,
    },
    leave: {
      sickLeaveBalance: 8,
      casualLeaveBalance: 5,
      requests: [
        { type: 'Casual', startDate: '2024-11-20', endDate: '2024-11-22', status: 'approved' },
      ],
    },
    system: {
      portalUsername: 'david.smith',
      portalActive: true,
      lastLogin: '2024-12-20 09:15 AM',
      twoFactorEnabled: true,
      staffQrId: 'STAFF-QR-001',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: true },
      { type: 'Background Check', uploaded: true },
    ],
  },
  {
    id: '2',
    teacherId: 'TCH-2024-000002',
    firstName: 'Emily',
    lastName: 'Johnson',
    gender: 'Female',
    dateOfBirth: '1990-07-22',
    address: '456 Maple Ave, Springfield',
    phone: '+1 555-2001',
    email: 'emily.johnson@scitech.edu',
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '+1 555-2002',
      relationship: 'Brother',
    },
    department: 'English',
    status: 'active',
    office: 'Building B, Room 105',
    officeHours: 'Tue/Thu 1-3 PM',
    employment: {
      type: 'full_time',
      role: 'Teacher',
      joinDate: '2020-08-20',
      qualifications: ['M.A. English Literature', 'B.A. Creative Writing'],
      yearsOfExperience: 6,
      teachingLicense: 'TL-2020-1234',
      salaryGrade: 'Grade B',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'ENG101', courseName: 'English Composition', sections: 3, students: 90, schedule: 'Mon/Wed/Fri 10-11 AM' },
        { courseCode: 'ENG201', courseName: 'American Literature', sections: 2, students: 50, schedule: 'Tue/Thu 2-3:30 PM' },
      ],
      totalSections: 5,
      totalStudents: 140,
      weeklyHours: 18,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 95,
      gradingProgress: { midterm: 100, final: 30 },
      pendingTasks: 4,
      lateSubmissions: 1,
    },
    leave: {
      sickLeaveBalance: 10,
      casualLeaveBalance: 7,
      requests: [],
    },
    system: {
      portalUsername: 'emily.johnson',
      portalActive: true,
      lastLogin: '2024-12-19 02:30 PM',
      twoFactorEnabled: false,
      staffQrId: 'STAFF-QR-002',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: true },
      { type: 'Background Check', uploaded: false },
    ],
  },
  {
    id: '3',
    teacherId: 'TCH-2024-000003',
    firstName: 'Robert',
    lastName: 'Brown',
    gender: 'Male',
    dateOfBirth: '1978-11-08',
    address: '789 Pine Road, Springfield',
    phone: '+1 555-3001',
    email: 'robert.brown@scitech.edu',
    department: 'Science',
    status: 'active',
    office: 'Science Lab, Room 301',
    officeHours: 'Mon/Fri 3-5 PM',
    employment: {
      type: 'full_time',
      role: 'Head of Department',
      joinDate: '2010-08-01',
      contractStart: '2023-01-01',
      contractEnd: '2027-12-31',
      qualifications: ['Ph.D. Physics', 'M.Sc. Chemistry', 'B.Sc. Biology'],
      yearsOfExperience: 20,
      teachingLicense: 'TL-2010-0089',
      salaryGrade: 'Grade A+',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'PHY101', courseName: 'Physics I', sections: 2, students: 70, schedule: 'Mon/Wed 8-9:30 AM' },
        { courseCode: 'PHY201', courseName: 'Quantum Mechanics', sections: 1, students: 25, schedule: 'Thu 2-5 PM' },
        { courseCode: 'SCI100', courseName: 'Intro to Science', sections: 2, students: 80, schedule: 'Tue/Fri 10-11:30 AM' },
      ],
      totalSections: 5,
      totalStudents: 175,
      weeklyHours: 20,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 100,
      gradingProgress: { midterm: 100, final: 60 },
      pendingTasks: 1,
      lateSubmissions: 0,
    },
    leave: {
      sickLeaveBalance: 12,
      casualLeaveBalance: 10,
      requests: [],
    },
    system: {
      portalUsername: 'robert.brown',
      portalActive: true,
      lastLogin: '2024-12-20 08:00 AM',
      twoFactorEnabled: true,
      staffQrId: 'STAFF-QR-003',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: true },
      { type: 'Background Check', uploaded: true },
    ],
  },
  {
    id: '4',
    teacherId: 'TCH-2024-000004',
    firstName: 'Sarah',
    lastName: 'Wilson',
    gender: 'Female',
    dateOfBirth: '1992-04-18',
    address: '321 Elm Street, Springfield',
    phone: '+1 555-4001',
    email: 'sarah.wilson@scitech.edu',
    department: 'History',
    status: 'on_leave',
    office: 'Building C, Room 202',
    officeHours: 'Wed 10 AM-12 PM',
    employment: {
      type: 'full_time',
      role: 'Teacher',
      joinDate: '2021-08-15',
      qualifications: ['M.A. History', 'B.A. Political Science'],
      yearsOfExperience: 5,
      teachingLicense: 'TL-2021-2345',
      salaryGrade: 'Grade B',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'HIS101', courseName: 'World History', sections: 2, students: 55, schedule: 'Mon/Wed 1-2:30 PM' },
        { courseCode: 'HIS201', courseName: 'American History', sections: 1, students: 30, schedule: 'Fri 9 AM-12 PM' },
      ],
      totalSections: 3,
      totalStudents: 85,
      weeklyHours: 12,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 88,
      gradingProgress: { midterm: 90, final: 0 },
      pendingTasks: 6,
      lateSubmissions: 3,
    },
    leave: {
      sickLeaveBalance: 2,
      casualLeaveBalance: 0,
      requests: [
        { type: 'Medical', startDate: '2024-12-10', endDate: '2024-12-31', status: 'approved' },
      ],
    },
    system: {
      portalUsername: 'sarah.wilson',
      portalActive: true,
      lastLogin: '2024-12-09 04:00 PM',
      twoFactorEnabled: false,
      staffQrId: 'STAFF-QR-004',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: false },
      { type: 'Background Check', uploaded: true },
    ],
  },
  {
    id: '5',
    teacherId: 'TCH-2023-000005',
    firstName: 'Michael',
    lastName: 'Davis',
    gender: 'Male',
    dateOfBirth: '1988-09-25',
    address: '567 Cedar Lane, Springfield',
    phone: '+1 555-5001',
    email: 'michael.davis@scitech.edu',
    department: 'Computer Science',
    status: 'active',
    office: 'Tech Building, Room 401',
    officeHours: 'Tue/Thu 4-6 PM',
    employment: {
      type: 'full_time',
      role: 'Senior Teacher',
      joinDate: '2017-08-01',
      qualifications: ['M.Sc. Computer Science', 'B.Sc. Software Engineering'],
      yearsOfExperience: 10,
      teachingLicense: 'TL-2017-0678',
      salaryGrade: 'Grade A',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'CS101', courseName: 'Intro to Programming', sections: 3, students: 100, schedule: 'Mon/Wed/Fri 11 AM-12 PM' },
        { courseCode: 'CS201', courseName: 'Data Structures', sections: 2, students: 60, schedule: 'Tue/Thu 9-10:30 AM' },
        { courseCode: 'CS301', courseName: 'Algorithms', sections: 1, students: 35, schedule: 'Wed 2-5 PM' },
      ],
      totalSections: 6,
      totalStudents: 195,
      weeklyHours: 22,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 96,
      gradingProgress: { midterm: 100, final: 50 },
      pendingTasks: 3,
      lateSubmissions: 0,
    },
    leave: {
      sickLeaveBalance: 6,
      casualLeaveBalance: 4,
      requests: [],
    },
    system: {
      portalUsername: 'michael.davis',
      portalActive: true,
      lastLogin: '2024-12-20 10:45 AM',
      twoFactorEnabled: true,
      staffQrId: 'STAFF-QR-005',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: true },
      { type: 'Background Check', uploaded: true },
    ],
  },
  {
    id: '6',
    teacherId: 'TCH-2024-000006',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    gender: 'Female',
    dateOfBirth: '1995-01-12',
    address: '890 Birch Drive, Springfield',
    phone: '+1 555-6001',
    email: 'jennifer.martinez@scitech.edu',
    department: 'Art',
    status: 'active',
    office: 'Arts Building, Room 102',
    officeHours: 'Mon/Thu 1-3 PM',
    employment: {
      type: 'part_time',
      role: 'Teacher',
      joinDate: '2023-01-15',
      qualifications: ['M.F.A. Fine Arts', 'B.A. Art History'],
      yearsOfExperience: 3,
      salaryGrade: 'Grade C',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'ART101', courseName: 'Intro to Art', sections: 2, students: 45, schedule: 'Tue/Thu 10-11:30 AM' },
        { courseCode: 'ART201', courseName: 'Painting', sections: 1, students: 20, schedule: 'Fri 1-4 PM' },
      ],
      totalSections: 3,
      totalStudents: 65,
      weeklyHours: 10,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 92,
      gradingProgress: { midterm: 85, final: 20 },
      pendingTasks: 5,
      lateSubmissions: 2,
    },
    leave: {
      sickLeaveBalance: 5,
      casualLeaveBalance: 3,
      requests: [],
    },
    system: {
      portalUsername: 'jennifer.martinez',
      portalActive: true,
      lastLogin: '2024-12-18 11:20 AM',
      twoFactorEnabled: false,
      staffQrId: 'STAFF-QR-006',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Background Check', uploaded: false },
    ],
  },
  {
    id: '7',
    teacherId: 'TCH-2022-000007',
    firstName: 'William',
    lastName: 'Anderson',
    gender: 'Male',
    dateOfBirth: '1975-06-30',
    address: '234 Spruce Way, Springfield',
    phone: '+1 555-7001',
    email: 'william.anderson@scitech.edu',
    department: 'Physical Education',
    status: 'active',
    office: 'Gymnasium, Office 1',
    officeHours: 'Daily 7-8 AM',
    employment: {
      type: 'full_time',
      role: 'Head of Department',
      joinDate: '2008-08-01',
      qualifications: ['M.Ed. Physical Education', 'B.Sc. Sports Science', 'CPR Certified'],
      yearsOfExperience: 22,
      teachingLicense: 'TL-2008-0234',
      salaryGrade: 'Grade A',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'PE101', courseName: 'Physical Education', sections: 4, students: 150, schedule: 'Mon-Thu 8-9 AM' },
        { courseCode: 'PE201', courseName: 'Health & Fitness', sections: 2, students: 60, schedule: 'Fri 8-10 AM' },
      ],
      totalSections: 6,
      totalStudents: 210,
      weeklyHours: 18,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 100,
      gradingProgress: { midterm: 100, final: 70 },
      pendingTasks: 0,
      lateSubmissions: 0,
    },
    leave: {
      sickLeaveBalance: 15,
      casualLeaveBalance: 12,
      requests: [],
    },
    system: {
      portalUsername: 'william.anderson',
      portalActive: true,
      lastLogin: '2024-12-20 07:30 AM',
      twoFactorEnabled: true,
      staffQrId: 'STAFF-QR-007',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Teaching License', uploaded: true },
      { type: 'Background Check', uploaded: true },
      { type: 'CPR Certification', uploaded: true },
    ],
  },
  {
    id: '8',
    teacherId: 'TCH-2024-000008',
    firstName: 'Lisa',
    lastName: 'Thompson',
    gender: 'Female',
    dateOfBirth: '1993-12-05',
    address: '678 Walnut Court, Springfield',
    phone: '+1 555-8001',
    email: 'lisa.thompson@scitech.edu',
    department: 'Music',
    status: 'active',
    office: 'Music Hall, Room 201',
    officeHours: 'Wed/Fri 2-4 PM',
    employment: {
      type: 'visiting',
      role: 'Visiting Instructor',
      joinDate: '2024-08-01',
      contractStart: '2024-08-01',
      contractEnd: '2025-05-31',
      qualifications: ['D.M.A. Music Performance', 'M.M. Music Theory'],
      yearsOfExperience: 4,
      salaryGrade: 'Grade C',
    },
    teaching: {
      assignedCourses: [
        { courseCode: 'MUS101', courseName: 'Music Appreciation', sections: 2, students: 50, schedule: 'Tue/Thu 1-2:30 PM' },
        { courseCode: 'MUS201', courseName: 'Music Theory', sections: 1, students: 25, schedule: 'Mon 3-6 PM' },
      ],
      totalSections: 3,
      totalStudents: 75,
      weeklyHours: 12,
      academicTerm: 'Fall 2024',
    },
    operations: {
      attendanceSubmissionRate: 90,
      gradingProgress: { midterm: 95, final: 25 },
      pendingTasks: 4,
      lateSubmissions: 1,
    },
    leave: {
      sickLeaveBalance: 4,
      casualLeaveBalance: 2,
      requests: [],
    },
    system: {
      portalUsername: 'lisa.thompson',
      portalActive: true,
      lastLogin: '2024-12-19 03:15 PM',
      twoFactorEnabled: false,
      staffQrId: 'STAFF-QR-008',
    },
    documents: [
      { type: 'Employment Contract', uploaded: true },
      { type: 'ID Document', uploaded: true },
      { type: 'Degree Certificate', uploaded: true },
      { type: 'Background Check', uploaded: false },
    ],
  },
];

const STORAGE_KEY = 'school_teachers';
const STORAGE_VERSION_KEY = 'school_teachers_version';
const CURRENT_VERSION = '1';

export function loadTeachers(): Teacher[] {
  if (typeof window === 'undefined') return mockTeachers;

  try {
    const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTeachers));
      window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return mockTeachers;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockTeachers;

    const parsed = JSON.parse(raw) as Teacher[];
    if (!Array.isArray(parsed) || parsed.length === 0) return mockTeachers;

    return parsed;
  } catch {
    return mockTeachers;
  }
}

export function saveTeachers(teachers: Teacher[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}
