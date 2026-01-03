import {
  Grade,
  Section,
  Subject,
  Room,
  TeacherAvailabilityWithInfo,
  SubjectRequirement,
  TeacherWorkloadRule,
  SchoolScheduleConfig,
  TimetableSlot,
  ClassTimetable,
  AvailabilitySlot,
  SUBJECT_COLORS,
  DayOfWeek,
  AvailabilityStatus,
  TimetableDashboardStats,
  RecentActivity,
  TimetableConflict,
} from '@/types/timetable';

// -------------------- GRADES --------------------
export const SAMPLE_GRADES: Grade[] = [
  { id: 'grade-7', name: 'Grade 7', level: 7 },
  { id: 'grade-8', name: 'Grade 8', level: 8 },
  { id: 'grade-9', name: 'Grade 9', level: 9 },
  { id: 'grade-10', name: 'Grade 10', level: 10 },
  { id: 'grade-11', name: 'Grade 11', level: 11 },
  { id: 'grade-12', name: 'Grade 12', level: 12 },
];

// -------------------- SECTIONS --------------------
export const SAMPLE_SECTIONS: Section[] = [
  { id: 'sec-7a', gradeId: 'grade-7', name: 'Section A', capacity: 35, homeRoom: 'Room 101' },
  { id: 'sec-7b', gradeId: 'grade-7', name: 'Section B', capacity: 35, homeRoom: 'Room 102' },
  { id: 'sec-8a', gradeId: 'grade-8', name: 'Section A', capacity: 35, homeRoom: 'Room 201' },
  { id: 'sec-8b', gradeId: 'grade-8', name: 'Section B', capacity: 35, homeRoom: 'Room 202' },
  { id: 'sec-9a', gradeId: 'grade-9', name: 'Section A', capacity: 35, homeRoom: 'Room 301' },
  { id: 'sec-9b', gradeId: 'grade-9', name: 'Section B', capacity: 35, homeRoom: 'Room 302' },
  { id: 'sec-10-sci', gradeId: 'grade-10', name: 'Science', capacity: 40, homeRoom: 'Room 401' },
  { id: 'sec-10-arts', gradeId: 'grade-10', name: 'Arts', capacity: 40, homeRoom: 'Room 402' },
  { id: 'sec-11-sci', gradeId: 'grade-11', name: 'Science', capacity: 40, homeRoom: 'Room 501' },
  { id: 'sec-11-arts', gradeId: 'grade-11', name: 'Arts', capacity: 40, homeRoom: 'Room 502' },
  { id: 'sec-12-sci', gradeId: 'grade-12', name: 'Science', capacity: 40, homeRoom: 'Room 601' },
  { id: 'sec-12-arts', gradeId: 'grade-12', name: 'Arts', capacity: 40, homeRoom: 'Room 602' },
];

// -------------------- SUBJECTS --------------------
export const SAMPLE_SUBJECTS: Subject[] = [
  { id: 'sub-math', code: 'MATH', name: 'Mathematics', department: 'Mathematics', color: SUBJECT_COLORS[0].value },
  { id: 'sub-eng', code: 'ENG', name: 'English', department: 'Languages', color: SUBJECT_COLORS[1].value },
  { id: 'sub-sci', code: 'SCI', name: 'Science', department: 'Science', requiresLab: true, color: SUBJECT_COLORS[2].value },
  { id: 'sub-phy', code: 'PHY', name: 'Physics', department: 'Science', requiresLab: true, color: SUBJECT_COLORS[3].value },
  { id: 'sub-chem', code: 'CHEM', name: 'Chemistry', department: 'Science', requiresLab: true, color: SUBJECT_COLORS[4].value },
  { id: 'sub-bio', code: 'BIO', name: 'Biology', department: 'Science', requiresLab: true, color: SUBJECT_COLORS[5].value },
  { id: 'sub-hist', code: 'HIST', name: 'History', department: 'Social Studies', color: SUBJECT_COLORS[6].value },
  { id: 'sub-geo', code: 'GEO', name: 'Geography', department: 'Social Studies', color: SUBJECT_COLORS[7].value },
  { id: 'sub-cs', code: 'CS', name: 'Computer Science', department: 'Technology', requiresSpecialRoom: 'computer_room', color: SUBJECT_COLORS[8].value },
  { id: 'sub-pe', code: 'PE', name: 'Physical Education', department: 'Sports', requiresSpecialRoom: 'gym', color: SUBJECT_COLORS[9].value },
  { id: 'sub-art', code: 'ART', name: 'Art', department: 'Arts', color: SUBJECT_COLORS[10].value },
  { id: 'sub-music', code: 'MUS', name: 'Music', department: 'Arts', color: SUBJECT_COLORS[11].value },
];

// -------------------- ROOMS --------------------
export const SAMPLE_ROOMS: Room[] = [
  { id: 'room-101', name: 'Room 101', type: 'classroom', capacity: 40, building: 'Main', floor: 1, isActive: true },
  { id: 'room-102', name: 'Room 102', type: 'classroom', capacity: 40, building: 'Main', floor: 1, isActive: true },
  { id: 'room-201', name: 'Room 201', type: 'classroom', capacity: 40, building: 'Main', floor: 2, isActive: true },
  { id: 'room-202', name: 'Room 202', type: 'classroom', capacity: 40, building: 'Main', floor: 2, isActive: true },
  { id: 'room-301', name: 'Room 301', type: 'classroom', capacity: 40, building: 'Main', floor: 3, isActive: true },
  { id: 'room-302', name: 'Room 302', type: 'classroom', capacity: 40, building: 'Main', floor: 3, isActive: true },
  { id: 'lab-phy', name: 'Physics Lab', type: 'lab', capacity: 30, building: 'Science', floor: 1, facilities: ['Lab Equipment', 'Safety Gear'], isActive: true },
  { id: 'lab-chem', name: 'Chemistry Lab', type: 'lab', capacity: 30, building: 'Science', floor: 1, facilities: ['Fume Hood', 'Safety Shower'], isActive: true },
  { id: 'lab-bio', name: 'Biology Lab', type: 'lab', capacity: 30, building: 'Science', floor: 2, facilities: ['Microscopes', 'Specimens'], isActive: true },
  { id: 'lab-comp', name: 'Computer Lab', type: 'computer_room', capacity: 35, building: 'Tech', floor: 1, facilities: ['40 PCs', 'Projector'], isActive: true },
  { id: 'gym-main', name: 'Main Gymnasium', type: 'gym', capacity: 100, building: 'Sports', floor: 1, facilities: ['Basketball Court', 'Volleyball Net'], isActive: true },
  { id: 'aud-main', name: 'Main Auditorium', type: 'auditorium', capacity: 500, building: 'Main', floor: 1, facilities: ['Stage', 'Sound System'], isActive: true },
];

// -------------------- TEACHERS --------------------
interface TeacherInfo {
  id: string;
  name: string;
  department: string;
  email: string;
  subjects: string[];
  avatar?: string;
}

export const SAMPLE_TEACHERS: TeacherInfo[] = [
  { id: 'tch-001', name: 'Dr. Sarah Johnson', department: 'Mathematics', email: 'sarah.johnson@school.edu', subjects: ['sub-math'] },
  { id: 'tch-002', name: 'Mr. Michael Chen', department: 'Mathematics', email: 'michael.chen@school.edu', subjects: ['sub-math'] },
  { id: 'tch-003', name: 'Ms. Emily Watson', department: 'Languages', email: 'emily.watson@school.edu', subjects: ['sub-eng'] },
  { id: 'tch-004', name: 'Mr. James Brown', department: 'Languages', email: 'james.brown@school.edu', subjects: ['sub-eng'] },
  { id: 'tch-005', name: 'Dr. Robert Miller', department: 'Science', email: 'robert.miller@school.edu', subjects: ['sub-phy'] },
  { id: 'tch-006', name: 'Ms. Amanda Garcia', department: 'Science', email: 'amanda.garcia@school.edu', subjects: ['sub-chem'] },
  { id: 'tch-007', name: 'Dr. David Lee', department: 'Science', email: 'david.lee@school.edu', subjects: ['sub-bio'] },
  { id: 'tch-008', name: 'Ms. Jennifer Taylor', department: 'Science', email: 'jennifer.taylor@school.edu', subjects: ['sub-sci'] },
  { id: 'tch-009', name: 'Mr. William Anderson', department: 'Social Studies', email: 'william.anderson@school.edu', subjects: ['sub-hist'] },
  { id: 'tch-010', name: 'Ms. Lisa Thompson', department: 'Social Studies', email: 'lisa.thompson@school.edu', subjects: ['sub-geo'] },
  { id: 'tch-011', name: 'Mr. Kevin Martinez', department: 'Technology', email: 'kevin.martinez@school.edu', subjects: ['sub-cs'] },
  { id: 'tch-012', name: 'Ms. Rachel White', department: 'Sports', email: 'rachel.white@school.edu', subjects: ['sub-pe'] },
  { id: 'tch-013', name: 'Mr. Daniel Harris', department: 'Arts', email: 'daniel.harris@school.edu', subjects: ['sub-art'] },
  { id: 'tch-014', name: 'Ms. Nicole Clark', department: 'Arts', email: 'nicole.clark@school.edu', subjects: ['sub-music'] },
];

// -------------------- HELPER FUNCTIONS --------------------

function generateAvailabilitySlots(teacherId: string, pattern: 'full' | 'partial' | 'preferred'): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const timeSlots = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
  ];

  days.forEach(day => {
    timeSlots.forEach((slot, index) => {
      let status: AvailabilityStatus = 'available';

      if (pattern === 'partial') {
        // Make some slots unavailable
        if ((day === 'wednesday' && index < 2) || (day === 'friday' && index > 4)) {
          status = 'unavailable';
        }
      } else if (pattern === 'preferred') {
        // Mark morning as preferred, afternoon as avoid
        if (index < 3) {
          status = 'preferred';
        } else if (index > 4) {
          status = 'avoid';
        }
      }

      slots.push({
        id: `${teacherId}-${day}-${index}`,
        dayOfWeek: day,
        startTime: slot.start,
        endTime: slot.end,
        status,
      });
    });
  });

  return slots;
}

// -------------------- TEACHER AVAILABILITY --------------------
export const SAMPLE_TEACHER_AVAILABILITY: TeacherAvailabilityWithInfo[] = SAMPLE_TEACHERS.map((teacher, index) => {
  const patterns: ('full' | 'partial' | 'preferred')[] = ['full', 'partial', 'preferred'];
  const pattern = patterns[index % 3];
  const hasTemplate = index < 10; // First 10 teachers have submitted availability

  return {
    teacherId: teacher.id,
    teacherName: teacher.name,
    department: teacher.department,
    email: teacher.email,
    template: hasTemplate ? {
      id: `template-${teacher.id}`,
      teacherId: teacher.id,
      slots: generateAvailabilitySlots(teacher.id, pattern),
      preferences: {
        maxPeriodsPerDay: 6,
        maxPeriodsPerWeek: 25,
        preferredBreakDuration: 15,
        preferConsecutiveClasses: true,
        avoidFirstPeriod: index % 4 === 0,
        avoidLastPeriod: index % 3 === 0,
      },
      createdAt: '2026-01-01T08:00:00Z',
      updatedAt: '2026-01-02T10:30:00Z',
    } : null,
    exceptions: [],
    completionStatus: hasTemplate ? 'complete' : 'pending',
    lastUpdated: hasTemplate ? '2026-01-02T10:30:00Z' : undefined,
  };
});

// -------------------- WORKLOAD RULES --------------------
export const SAMPLE_WORKLOAD_RULES: TeacherWorkloadRule[] = SAMPLE_TEACHERS.map(teacher => ({
  teacherId: teacher.id,
  maxPeriodsPerDay: 6,
  maxPeriodsPerWeek: 28,
  minBreakBetweenClasses: 5,
}));

// -------------------- SCHOOL SCHEDULE CONFIG --------------------
export const SAMPLE_SCHOOL_CONFIG: SchoolScheduleConfig = {
  id: 'config-2026-1',
  schoolId: 'school-001',
  academicYear: '2025-2026',
  term: 'Term 2',
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  schoolStartTime: '08:00',
  schoolEndTime: '16:00',
  periodDuration: 50,
  periods: [
    { periodNumber: 1, startTime: '08:00', endTime: '08:50', isBreak: false },
    { periodNumber: 2, startTime: '08:50', endTime: '09:40', isBreak: false },
    { periodNumber: 2.5, startTime: '09:40', endTime: '10:00', isBreak: true, breakName: 'Morning Break' },
    { periodNumber: 3, startTime: '10:00', endTime: '10:50', isBreak: false },
    { periodNumber: 4, startTime: '10:50', endTime: '11:40', isBreak: false },
    { periodNumber: 5, startTime: '11:40', endTime: '12:30', isBreak: false },
    { periodNumber: 5.5, startTime: '12:30', endTime: '13:30', isBreak: true, breakName: 'Lunch Break' },
    { periodNumber: 6, startTime: '13:30', endTime: '14:20', isBreak: false },
    { periodNumber: 7, startTime: '14:20', endTime: '15:10', isBreak: false },
    { periodNumber: 8, startTime: '15:10', endTime: '16:00', isBreak: false },
  ],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

// -------------------- SUBJECT REQUIREMENTS --------------------
export const SAMPLE_SUBJECT_REQUIREMENTS: SubjectRequirement[] = [
  // Grade 10 Science requirements
  { id: 'req-1', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-math', periodsPerWeek: 6, assignedTeacherId: 'tch-001' },
  { id: 'req-2', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-eng', periodsPerWeek: 5, assignedTeacherId: 'tch-003' },
  { id: 'req-3', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-phy', periodsPerWeek: 5, assignedTeacherId: 'tch-005', requiresDoubleLesson: true },
  { id: 'req-4', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-chem', periodsPerWeek: 5, assignedTeacherId: 'tch-006', requiresDoubleLesson: true },
  { id: 'req-5', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-bio', periodsPerWeek: 4, assignedTeacherId: 'tch-007' },
  { id: 'req-6', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-cs', periodsPerWeek: 3, assignedTeacherId: 'tch-011', roomRequirement: 'computer_room' },
  { id: 'req-7', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-pe', periodsPerWeek: 2, assignedTeacherId: 'tch-012', roomRequirement: 'gym' },
  { id: 'req-8', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-hist', periodsPerWeek: 3, assignedTeacherId: 'tch-009' },
  { id: 'req-9', gradeId: 'grade-10', sectionId: 'sec-10-sci', subjectId: 'sub-geo', periodsPerWeek: 2, assignedTeacherId: 'tch-010' },
];

// -------------------- SAMPLE TIMETABLE --------------------
export const SAMPLE_TIMETABLE_SLOTS: TimetableSlot[] = [
  // Monday
  { id: 'slot-1', dayOfWeek: 'monday', periodNumber: 1, startTime: '08:00', endTime: '08:50', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-2', dayOfWeek: 'monday', periodNumber: 2, startTime: '08:50', endTime: '09:40', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-3', dayOfWeek: 'monday', periodNumber: 3, startTime: '10:00', endTime: '10:50', subjectId: 'sub-eng', teacherId: 'tch-003', roomId: 'room-101', isLocked: true },
  { id: 'slot-4', dayOfWeek: 'monday', periodNumber: 4, startTime: '10:50', endTime: '11:40', subjectId: 'sub-phy', teacherId: 'tch-005', roomId: 'lab-phy', isLocked: false, isDoubleLesson: true },
  { id: 'slot-5', dayOfWeek: 'monday', periodNumber: 5, startTime: '11:40', endTime: '12:30', subjectId: 'sub-phy', teacherId: 'tch-005', roomId: 'lab-phy', isLocked: false, isDoubleLesson: true },
  { id: 'slot-6', dayOfWeek: 'monday', periodNumber: 6, startTime: '13:30', endTime: '14:20', subjectId: 'sub-cs', teacherId: 'tch-011', roomId: 'lab-comp', isLocked: false },
  { id: 'slot-7', dayOfWeek: 'monday', periodNumber: 7, startTime: '14:20', endTime: '15:10', subjectId: 'sub-hist', teacherId: 'tch-009', roomId: 'room-101', isLocked: false },

  // Tuesday
  { id: 'slot-8', dayOfWeek: 'tuesday', periodNumber: 1, startTime: '08:00', endTime: '08:50', subjectId: 'sub-eng', teacherId: 'tch-003', roomId: 'room-101', isLocked: false },
  { id: 'slot-9', dayOfWeek: 'tuesday', periodNumber: 2, startTime: '08:50', endTime: '09:40', subjectId: 'sub-chem', teacherId: 'tch-006', roomId: 'lab-chem', isLocked: false, isDoubleLesson: true },
  { id: 'slot-10', dayOfWeek: 'tuesday', periodNumber: 3, startTime: '10:00', endTime: '10:50', subjectId: 'sub-chem', teacherId: 'tch-006', roomId: 'lab-chem', isLocked: false, isDoubleLesson: true },
  { id: 'slot-11', dayOfWeek: 'tuesday', periodNumber: 4, startTime: '10:50', endTime: '11:40', subjectId: 'sub-bio', teacherId: 'tch-007', roomId: 'lab-bio', isLocked: false },
  { id: 'slot-12', dayOfWeek: 'tuesday', periodNumber: 5, startTime: '11:40', endTime: '12:30', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-13', dayOfWeek: 'tuesday', periodNumber: 6, startTime: '13:30', endTime: '14:20', subjectId: 'sub-pe', teacherId: 'tch-012', roomId: 'gym-main', isLocked: false },
  { id: 'slot-14', dayOfWeek: 'tuesday', periodNumber: 7, startTime: '14:20', endTime: '15:10', subjectId: 'sub-geo', teacherId: 'tch-010', roomId: 'room-101', isLocked: false },

  // Wednesday
  { id: 'slot-15', dayOfWeek: 'wednesday', periodNumber: 1, startTime: '08:00', endTime: '08:50', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-16', dayOfWeek: 'wednesday', periodNumber: 2, startTime: '08:50', endTime: '09:40', subjectId: 'sub-eng', teacherId: 'tch-003', roomId: 'room-101', isLocked: false },
  { id: 'slot-17', dayOfWeek: 'wednesday', periodNumber: 3, startTime: '10:00', endTime: '10:50', subjectId: 'sub-bio', teacherId: 'tch-007', roomId: 'lab-bio', isLocked: false },
  { id: 'slot-18', dayOfWeek: 'wednesday', periodNumber: 4, startTime: '10:50', endTime: '11:40', subjectId: 'sub-bio', teacherId: 'tch-007', roomId: 'lab-bio', isLocked: false },
  { id: 'slot-19', dayOfWeek: 'wednesday', periodNumber: 5, startTime: '11:40', endTime: '12:30', subjectId: 'sub-hist', teacherId: 'tch-009', roomId: 'room-101', isLocked: false },
  { id: 'slot-20', dayOfWeek: 'wednesday', periodNumber: 6, startTime: '13:30', endTime: '14:20', subjectId: 'sub-cs', teacherId: 'tch-011', roomId: 'lab-comp', isLocked: false },
  { id: 'slot-21', dayOfWeek: 'wednesday', periodNumber: 7, startTime: '14:20', endTime: '15:10', subjectId: 'sub-phy', teacherId: 'tch-005', roomId: 'lab-phy', isLocked: false },

  // Thursday
  { id: 'slot-22', dayOfWeek: 'thursday', periodNumber: 1, startTime: '08:00', endTime: '08:50', subjectId: 'sub-eng', teacherId: 'tch-003', roomId: 'room-101', isLocked: false },
  { id: 'slot-23', dayOfWeek: 'thursday', periodNumber: 2, startTime: '08:50', endTime: '09:40', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-24', dayOfWeek: 'thursday', periodNumber: 3, startTime: '10:00', endTime: '10:50', subjectId: 'sub-chem', teacherId: 'tch-006', roomId: 'lab-chem', isLocked: false },
  { id: 'slot-25', dayOfWeek: 'thursday', periodNumber: 4, startTime: '10:50', endTime: '11:40', subjectId: 'sub-chem', teacherId: 'tch-006', roomId: 'lab-chem', isLocked: false },
  { id: 'slot-26', dayOfWeek: 'thursday', periodNumber: 5, startTime: '11:40', endTime: '12:30', subjectId: 'sub-phy', teacherId: 'tch-005', roomId: 'lab-phy', isLocked: false },
  { id: 'slot-27', dayOfWeek: 'thursday', periodNumber: 6, startTime: '13:30', endTime: '14:20', subjectId: 'sub-pe', teacherId: 'tch-012', roomId: 'gym-main', isLocked: false },
  { id: 'slot-28', dayOfWeek: 'thursday', periodNumber: 7, startTime: '14:20', endTime: '15:10', subjectId: 'sub-hist', teacherId: 'tch-009', roomId: 'room-101', isLocked: false },

  // Friday
  { id: 'slot-29', dayOfWeek: 'friday', periodNumber: 1, startTime: '08:00', endTime: '08:50', subjectId: 'sub-math', teacherId: 'tch-001', roomId: 'room-101', isLocked: false },
  { id: 'slot-30', dayOfWeek: 'friday', periodNumber: 2, startTime: '08:50', endTime: '09:40', subjectId: 'sub-eng', teacherId: 'tch-003', roomId: 'room-101', isLocked: false },
  { id: 'slot-31', dayOfWeek: 'friday', periodNumber: 3, startTime: '10:00', endTime: '10:50', subjectId: 'sub-bio', teacherId: 'tch-007', roomId: 'lab-bio', isLocked: false },
  { id: 'slot-32', dayOfWeek: 'friday', periodNumber: 4, startTime: '10:50', endTime: '11:40', subjectId: 'sub-geo', teacherId: 'tch-010', roomId: 'room-101', isLocked: false },
  { id: 'slot-33', dayOfWeek: 'friday', periodNumber: 5, startTime: '11:40', endTime: '12:30', subjectId: 'sub-cs', teacherId: 'tch-011', roomId: 'lab-comp', isLocked: false },
  { id: 'slot-34', dayOfWeek: 'friday', periodNumber: 6, startTime: '13:30', endTime: '14:20', subjectId: 'sub-phy', teacherId: 'tch-005', roomId: 'lab-phy', isLocked: false },
];

export const SAMPLE_CLASS_TIMETABLE: ClassTimetable = {
  id: 'tt-10-sci-2026-t2',
  gradeId: 'grade-10',
  sectionId: 'sec-10-sci',
  academicYear: '2025-2026',
  term: 'Term 2',
  slots: SAMPLE_TIMETABLE_SLOTS,
  status: 'draft',
  version: 1,
  createdAt: '2026-01-02T08:00:00Z',
  updatedAt: '2026-01-03T10:00:00Z',
};

// -------------------- DASHBOARD STATS --------------------
export const SAMPLE_DASHBOARD_STATS: TimetableDashboardStats = {
  totalClasses: 12,
  scheduledClasses: 8,
  unscheduledClasses: 4,
  totalConflicts: 3,
  totalWarnings: 5,
  teachersWithAvailability: 10,
  teachersPendingAvailability: 4,
  publishedTimetables: 6,
  draftTimetables: 2,
};

// -------------------- RECENT ACTIVITY --------------------
export const SAMPLE_RECENT_ACTIVITY: RecentActivity[] = [
  { id: 'act-1', type: 'timetable_published', description: 'Grade 9 Section A timetable published', timestamp: '2026-01-03T09:30:00Z', user: 'Admin Smith', gradeSection: 'Grade 9 - A' },
  { id: 'act-2', type: 'availability_updated', description: 'Dr. Sarah Johnson updated availability', timestamp: '2026-01-03T08:45:00Z', user: 'Dr. Sarah Johnson' },
  { id: 'act-3', type: 'conflict_resolved', description: 'Room conflict resolved for Grade 10 Science', timestamp: '2026-01-02T16:20:00Z', user: 'Admin Smith', gradeSection: 'Grade 10 - Science' },
  { id: 'act-4', type: 'draft_created', description: 'New draft created for Grade 11 Arts', timestamp: '2026-01-02T14:00:00Z', user: 'Admin Smith', gradeSection: 'Grade 11 - Arts' },
  { id: 'act-5', type: 'availability_updated', description: 'Mr. Kevin Martinez submitted availability', timestamp: '2026-01-02T11:30:00Z', user: 'Mr. Kevin Martinez' },
];

// -------------------- SAMPLE CONFLICTS --------------------
export const SAMPLE_CONFLICTS: TimetableConflict[] = [
  {
    id: 'conflict-1',
    type: 'teacher_double_booking',
    severity: 'error',
    message: 'Dr. Sarah Johnson is assigned to two classes at the same time',
    details: {
      dayOfWeek: 'monday',
      periodNumber: 3,
      teacherId: 'tch-001',
      teacherName: 'Dr. Sarah Johnson',
      gradeSection: 'Grade 10-A & Grade 10-B',
    },
    suggestions: ['Move one class to period 4', 'Assign a different teacher for one section'],
  },
  {
    id: 'conflict-2',
    type: 'teacher_unavailable',
    severity: 'error',
    message: 'Mr. Michael Chen is unavailable during assigned slot',
    details: {
      dayOfWeek: 'wednesday',
      periodNumber: 1,
      teacherId: 'tch-002',
      teacherName: 'Mr. Michael Chen',
      subjectName: 'Mathematics',
    },
    suggestions: ['Move class to an available slot', 'Assign a different teacher'],
  },
  {
    id: 'conflict-3',
    type: 'workload_exceeded',
    severity: 'warning',
    message: 'Dr. Robert Miller exceeds maximum periods per day',
    details: {
      dayOfWeek: 'tuesday',
      teacherId: 'tch-005',
      teacherName: 'Dr. Robert Miller',
      currentValue: 7,
      maxValue: 6,
    },
    suggestions: ['Redistribute one period to another day'],
  },
];

// -------------------- HELPER: GET TEACHER BY ID --------------------
export function getTeacherById(id: string): TeacherInfo | undefined {
  return SAMPLE_TEACHERS.find(t => t.id === id);
}

// -------------------- HELPER: GET SUBJECT BY ID --------------------
export function getSubjectById(id: string): Subject | undefined {
  return SAMPLE_SUBJECTS.find(s => s.id === id);
}

// -------------------- HELPER: GET ROOM BY ID --------------------
export function getRoomById(id: string): Room | undefined {
  return SAMPLE_ROOMS.find(r => r.id === id);
}

// -------------------- HELPER: GET GRADE BY ID --------------------
export function getGradeById(id: string): Grade | undefined {
  return SAMPLE_GRADES.find(g => g.id === id);
}

// -------------------- HELPER: GET SECTION BY ID --------------------
export function getSectionById(id: string): Section | undefined {
  return SAMPLE_SECTIONS.find(s => s.id === id);
}

// -------------------- HELPER: GET SECTIONS BY GRADE --------------------
export function getSectionsByGrade(gradeId: string): Section[] {
  return SAMPLE_SECTIONS.filter(s => s.gradeId === gradeId);
}
