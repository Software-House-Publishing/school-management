

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
    studentId: 'STU-2400001',
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
    studentId: 'STU-2400002',
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
  {
    id: '3',
    studentId: 'STU-2400003',
    firstName: 'Emma',
    lastName: 'Williams',
    gender: 'Female',
    dateOfBirth: '2010-07-22',
    address: '789 Pine Rd, Springfield',
    phone: '+1 555-0300',
    email: 'emma.w@school.com',
    language: 'English',
    guardians: [
      {
        name: 'Sarah Williams',
        relationship: 'Mother',
        phone: '+1 555-0301',
        email: 's.williams@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2021-09-01',
      grade: '9',
      section: 'A',
      rollNumber: '9-A-05',
      status: 'active',
      homeroomTeacher: 'Mrs. Davis',
    },
    academics: {
      gpa: 3.9,
      currentSubjects: ['Math', 'Science', 'English', 'Music'],
      lastExamScore: 95,
      remarks: 'Excellent student with strong leadership skills.',
    },
    attendance: {
      totalDays: 180,
      presentDays: 178,
      absentDays: 2,
      attendancePercentage: 98.9,
      lastAbsentDate: '2025-10-05',
    },
    activities: {
      clubs: ['Music Club', 'Drama Club'],
      sports: ['Swimming'],
      awards: ['Academic Excellence 2024'],
    },
    finance: {
      feePlan: 'Premium',
      totalDue: 7500,
      totalPaid: 7500,
      outstanding: 0,
      lastPaymentDate: '2025-08-15',
    },
    system: {
      portalUsername: 'emma.w',
      portalActive: true,
      rfidCardId: 'RFID-003',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
    ],
  },
  {
    id: '4',
    studentId: 'STU-2400004',
    firstName: 'Noah',
    lastName: 'Brown',
    gender: 'Male',
    dateOfBirth: '2009-04-18',
    address: '321 Elm St, Springfield',
    phone: '+1 555-0400',
    email: 'noah.b@school.com',
    language: 'English, Spanish',
    guardians: [
      {
        name: 'David Brown',
        relationship: 'Father',
        phone: '+1 555-0401',
        email: 'd.brown@example.com',
        isEmergencyContact: true,
      },
      {
        name: 'Maria Brown',
        relationship: 'Mother',
        phone: '+1 555-0402',
        email: 'm.brown@example.com',
        isEmergencyContact: false,
      },
    ],
    enrollment: {
      admissionDate: '2018-09-01',
      grade: '11',
      section: 'A',
      rollNumber: '11-A-02',
      status: 'active',
      homeroomTeacher: 'Mr. Thompson',
    },
    academics: {
      gpa: 3.5,
      currentSubjects: ['Math', 'Physics', 'English', 'Computer Science'],
      lastExamScore: 85,
    },
    attendance: {
      totalDays: 180,
      presentDays: 165,
      absentDays: 15,
      attendancePercentage: 91.7,
      lastAbsentDate: '2025-11-15',
    },
    activities: {
      clubs: ['Robotics Club', 'Chess Club'],
      sports: ['Soccer'],
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 4000,
      outstanding: 1000,
      lastPaymentDate: '2025-11-01',
    },
    system: {
      portalUsername: 'noah.b',
      portalActive: true,
      rfidCardId: 'RFID-004',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
    ],
  },
  {
    id: '5',
    studentId: 'STU-2400005',
    firstName: 'Olivia',
    lastName: 'Garcia',
    gender: 'Female',
    dateOfBirth: '2011-01-30',
    address: '567 Cedar Ln, Springfield',
    phone: '+1 555-0500',
    email: 'olivia.g@school.com',
    language: 'English, Spanish',
    guardians: [
      {
        name: 'Carlos Garcia',
        relationship: 'Father',
        phone: '+1 555-0501',
        email: 'c.garcia@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2022-09-01',
      grade: '8',
      section: 'B',
      rollNumber: '8-B-08',
      status: 'active',
      homeroomTeacher: 'Ms. Martinez',
    },
    academics: {
      gpa: 3.7,
      currentSubjects: ['Math', 'Science', 'English', 'Spanish'],
      lastExamScore: 88,
    },
    attendance: {
      totalDays: 180,
      presentDays: 175,
      absentDays: 5,
      attendancePercentage: 97.2,
      lastAbsentDate: '2025-09-20',
    },
    activities: {
      clubs: ['Art Club', 'Language Club'],
      sports: ['Volleyball'],
      awards: ['Best Art Project 2024'],
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 5000,
      outstanding: 0,
      lastPaymentDate: '2025-09-01',
    },
    system: {
      portalUsername: 'olivia.g',
      portalActive: true,
      rfidCardId: 'RFID-005',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
    ],
  },
  {
    id: '6',
    studentId: 'STU-2400006',
    firstName: 'James',
    lastName: 'Miller',
    gender: 'Male',
    dateOfBirth: '2008-09-12',
    address: '890 Birch Dr, Springfield',
    phone: '+1 555-0600',
    email: 'james.m@school.com',
    language: 'English',
    guardians: [
      {
        name: 'Robert Miller',
        relationship: 'Father',
        phone: '+1 555-0601',
        email: 'r.miller@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2017-09-01',
      grade: '12',
      section: 'A',
      rollNumber: '12-A-01',
      status: 'active',
      homeroomTeacher: 'Dr. Anderson',
    },
    academics: {
      gpa: 3.95,
      currentSubjects: ['Advanced Math', 'Physics', 'Chemistry', 'Computer Science'],
      lastExamScore: 97,
      remarks: 'Top performer, preparing for college applications.',
    },
    attendance: {
      totalDays: 180,
      presentDays: 180,
      absentDays: 0,
      attendancePercentage: 100,
    },
    activities: {
      clubs: ['Science Club', 'Debate Club'],
      sports: ['Track and Field'],
      awards: ['National Merit Scholar', 'Valedictorian Candidate'],
    },
    finance: {
      feePlan: 'Premium',
      totalDue: 7500,
      totalPaid: 7500,
      outstanding: 0,
      lastPaymentDate: '2025-08-01',
      scholarship: 'Academic Excellence (50%)',
    },
    system: {
      portalUsername: 'james.m',
      portalActive: true,
      rfidCardId: 'RFID-006',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
      { type: 'College Recommendation', uploaded: true },
    ],
  },
  {
    id: '7',
    studentId: 'STU-2400007',
    firstName: 'Sophia',
    lastName: 'Davis',
    gender: 'Female',
    dateOfBirth: '2010-12-05',
    address: '234 Maple Ave, Springfield',
    phone: '+1 555-0700',
    email: 'sophia.d@school.com',
    language: 'English, French',
    guardians: [
      {
        name: 'Jennifer Davis',
        relationship: 'Mother',
        phone: '+1 555-0701',
        email: 'j.davis@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2021-09-01',
      grade: '9',
      section: 'B',
      rollNumber: '9-B-12',
      status: 'active',
      homeroomTeacher: 'Mrs. Wilson',
    },
    academics: {
      gpa: 3.6,
      currentSubjects: ['Math', 'Biology', 'English', 'French'],
      lastExamScore: 86,
    },
    attendance: {
      totalDays: 180,
      presentDays: 172,
      absentDays: 8,
      attendancePercentage: 95.6,
      lastAbsentDate: '2025-11-28',
    },
    activities: {
      clubs: ['French Club', 'Environmental Club'],
      sports: ['Tennis'],
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 3000,
      outstanding: 2000,
      lastPaymentDate: '2025-10-01',
    },
    system: {
      portalUsername: 'sophia.d',
      portalActive: true,
      rfidCardId: 'RFID-007',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: false },
    ],
  },
  {
    id: '8',
    studentId: 'STU-2400008',
    firstName: 'William',
    lastName: 'Taylor',
    gender: 'Male',
    dateOfBirth: '2007-06-25',
    address: '678 Walnut St, Springfield',
    phone: '+1 555-0800',
    email: 'william.t@school.com',
    language: 'English',
    guardians: [
      {
        name: 'Thomas Taylor',
        relationship: 'Father',
        phone: '+1 555-0801',
        email: 't.taylor@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2016-09-01',
      grade: '12',
      section: 'B',
      rollNumber: '12-B-05',
      status: 'graduated',
      homeroomTeacher: 'Dr. Anderson',
    },
    academics: {
      gpa: 3.7,
      currentSubjects: ['Math', 'Physics', 'English', 'Economics'],
      lastExamScore: 90,
    },
    attendance: {
      totalDays: 180,
      presentDays: 176,
      absentDays: 4,
      attendancePercentage: 97.8,
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 5000,
      outstanding: 0,
      lastPaymentDate: '2025-05-15',
    },
    system: {
      portalUsername: 'william.t',
      portalActive: false,
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Graduation Certificate', uploaded: true },
    ],
  },
  {
    id: '9',
    studentId: 'STU-2400009',
    firstName: 'Ava',
    lastName: 'Martinez',
    gender: 'Female',
    dateOfBirth: '2011-08-14',
    address: '901 Cherry Ln, Springfield',
    phone: '+1 555-0900',
    email: 'ava.m@school.com',
    language: 'English, Spanish',
    guardians: [
      {
        name: 'Luis Martinez',
        relationship: 'Father',
        phone: '+1 555-0901',
        email: 'l.martinez@example.com',
        isEmergencyContact: true,
      },
      {
        name: 'Rosa Martinez',
        relationship: 'Mother',
        phone: '+1 555-0902',
        email: 'r.martinez@example.com',
        isEmergencyContact: false,
      },
    ],
    enrollment: {
      admissionDate: '2023-09-01',
      grade: '7',
      section: 'A',
      rollNumber: '7-A-03',
      status: 'active',
      previousSchool: 'Lincoln Elementary',
      homeroomTeacher: 'Mr. Rodriguez',
    },
    academics: {
      gpa: 3.3,
      currentSubjects: ['Math', 'Science', 'English', 'Social Studies'],
      lastExamScore: 79,
    },
    attendance: {
      totalDays: 180,
      presentDays: 168,
      absentDays: 12,
      attendancePercentage: 93.3,
      lastAbsentDate: '2025-12-10',
    },
    health: {
      allergies: 'None',
      medicalNotes: 'Wears glasses',
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 5000,
      totalPaid: 2500,
      outstanding: 2500,
      lastPaymentDate: '2025-09-15',
    },
    system: {
      portalUsername: 'ava.m',
      portalActive: true,
      rfidCardId: 'RFID-009',
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Transfer Certificate', uploaded: true },
      { type: 'Parent Consent Form', uploaded: true },
    ],
  },
  {
    id: '10',
    studentId: 'STU-2400010',
    firstName: 'Ethan',
    lastName: 'Anderson',
    gender: 'Male',
    dateOfBirth: '2009-02-28',
    address: '345 Spruce Rd, Springfield',
    phone: '+1 555-1000',
    email: 'ethan.a@school.com',
    language: 'English',
    guardians: [
      {
        name: 'Mark Anderson',
        relationship: 'Father',
        phone: '+1 555-1001',
        email: 'm.anderson@example.com',
        isEmergencyContact: true,
      },
    ],
    enrollment: {
      admissionDate: '2020-09-01',
      grade: '10',
      section: 'A',
      rollNumber: '10-A-08',
      status: 'transferred',
      homeroomTeacher: 'Mr. Smith',
    },
    academics: {
      gpa: 3.2,
      currentSubjects: ['Math', 'Science', 'English', 'History'],
      lastExamScore: 78,
    },
    attendance: {
      totalDays: 90,
      presentDays: 85,
      absentDays: 5,
      attendancePercentage: 94.4,
      lastAbsentDate: '2025-06-01',
    },
    finance: {
      feePlan: 'Standard',
      totalDue: 2500,
      totalPaid: 2500,
      outstanding: 0,
      lastPaymentDate: '2025-06-15',
    },
    system: {
      portalUsername: 'ethan.a',
      portalActive: false,
    },
    documents: [
      { type: 'Birth Certificate', uploaded: true },
      { type: 'Transfer Certificate', uploaded: true },
    ],
  },
];

const STORAGE_KEY = 'school_students';
const STORAGE_VERSION_KEY = 'school_students_version';
const CURRENT_VERSION = '3'; // Increment this when mock data changes

export function loadStudents(): Student[] {
  if (typeof window === 'undefined') return mockStudents;

  try {
    // Check version - if outdated, reset to new mock data
    const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStudents));
      window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return mockStudents;
    }

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
