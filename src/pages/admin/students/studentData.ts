

export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'withdrawn';

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isEmergencyContact?: boolean;
}

export interface EnrollmentInfo {
  admissionDate: string; 
  grade: string;        
  section?: string;      
  rollNumber?: string;
  status: StudentStatus;
  previousSchool?: string;
  homeroomTeacher?: string;
}

export interface AcademicInfo {
  gpa?: number;
  currentSubjects: string[];
  lastExamScore?: number;
  remarks?: string;
}

export interface AttendanceInfo {
  totalDays?: number;
  presentDays?: number;
  absentDays?: number;
  attendancePercentage?: number;
  lastAbsentDate?: string;
}

export interface ActivityInfo {
  clubs?: string[];
  sports?: string[];
  awards?: string[];
  disciplineNotes?: string;
}

export interface HealthInfo {
  allergies?: string;
  medicalNotes?: string;
  emergencyInstructions?: string;
}

export interface FinanceInfo {
  feePlan?: string;
  totalDue?: number;
  totalPaid?: number;
  outstanding?: number;
  lastPaymentDate?: string;
  scholarship?: string;
}

export interface SystemInfo {
  portalUsername?: string;
  portalActive?: boolean;
  rfidCardId?: string;
}

export interface DocumentInfo {
  type: string;
  uploaded: boolean;
  url?: string;
}

export interface Student {
  id: string;          // used in route /admin/students/:id
  studentId: string;   // human-readable ID (STU001)
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  photoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  language?: string;

  guardians: Guardian[];
  enrollment: EnrollmentInfo;
  academics: AcademicInfo;
  attendance: AttendanceInfo;
  activities?: ActivityInfo;
  health?: HealthInfo;
  finance?: FinanceInfo;
  system?: SystemInfo;
  documents?: DocumentInfo[];
}

export const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    firstName: 'Alice',
    lastName: 'Johnson',
    gender: 'Female',
    dateOfBirth: '2010-03-15',
    address: '123 Main St, Springfield',
    phone: '+1 555-0100',
    email: 'alice@school.com',
    language: 'English',
    guardians: [
      {
        name: 'Michael Johnson',
        relationship: 'Father',
        phone: '+1 555-0101',
        email: 'm.johnson@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2020-09-01',
      grade: '10',
      section: 'A',
      rollNumber: '10-A-01',
      status: 'active',
      previousSchool: 'Springfield Primary',
      homeroomTeacher: 'Mr. Smith',
    },
    academics: {
      gpa: 3.8,
      currentSubjects: ['Math', 'Science', 'English', 'History'],
      lastExamScore: 89,
      remarks: 'Very active and participates well in class.',
    },
    attendance: {
      totalDays: 180,
      presentDays: 170,
      absentDays: 10,
      attendancePercentage: 94.4,
      lastAbsentDate: '2025-11-20',
    },
    activities: {
      clubs: ['Science Club'],
      sports: ['Basketball'],
      awards: ['Science Fair Winner 2024'],
    },
    health: {
      allergies: 'Peanuts',
      medicalNotes: 'Carries EpiPen',
      emergencyInstructions: 'Call parents and ambulance if allergic reaction.',
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 3500,
      outstanding: 1500,
      lastPaymentDate: '2025-10-15',
      scholarship: 'STEM Scholarship (20%)',
    },
    system: {
      portalUsername: 'alice.j',
      portalActive: true,
      rfidCardId: 'RFID-001',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Transfer Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: false },
    ],
  },
  {
    id: '2',
    studentId: 'STU002',
    firstName: 'Liam',
    lastName: 'Nguyen',
    gender: 'Male',
    dateOfBirth: '2009-11-02',
    address: '456 Oak Ave, Springfield',
    phone: '+1 555-0200',
    email: 'liam.nguyen@example.com',
    language: 'English, Vietnamese',
    guardians: [
      {
        name: 'Anh Nguyen',
        relationship: 'Mother',
        phone: '+1 555-0201',
        email: 'anh.nguyen@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2019-09-01',
      grade: '10',
      section: 'B',
      rollNumber: '10-B-03',
      status: 'active',
    },
    academics: {
      gpa: 3.4,
      currentSubjects: ['Math', 'Science', 'English', 'Art'],
      lastExamScore: 82,
    },
    attendance: {
      totalDays: 180,
      presentDays: 160,
      absentDays: 20,
      attendancePercentage: 88.9,
      lastAbsentDate: '2025-12-01',
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 5000,
      outstanding: 0,
      lastPaymentDate: '2025-09-30',
    },
    system: {
      portalUsername: 'liam.n',
      portalActive: true,
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
    ],
  },
];

const STORAGE_KEY = 'school_students';

export function loadStudents(): Student[] {
  if (typeof window === 'undefined') return mockStudents;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockStudents;

    const parsed = JSON.parse(raw) as Student[];
    if (!Array.isArray(parsed) || parsed.length === 0) return mockStudents;

    return parsed;
  } catch {
    return mockStudents;
  }
}

export function saveStudents(students: Student[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}
