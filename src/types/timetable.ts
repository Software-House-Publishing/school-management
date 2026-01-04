// ============================================
// TIMETABLE PLANNER - TYPE DEFINITIONS
// ============================================

// -------------------- ENUMS & CONSTANTS --------------------

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type AvailabilityStatus = 'available' | 'unavailable' | 'preferred' | 'avoid';

export type TimetableStatus = 'draft' | 'published' | 'archived';

export type ConflictType =
  | 'teacher_double_booking'
  | 'teacher_unavailable'
  | 'room_conflict'
  | 'workload_exceeded'
  | 'insufficient_slots'
  | 'break_violation';

export type AuditAction =
  | 'availability_created'
  | 'availability_updated'
  | 'availability_override'
  | 'exception_added'
  | 'exception_removed'
  | 'timetable_generated'
  | 'timetable_published'
  | 'timetable_archived'
  | 'slot_locked'
  | 'slot_unlocked';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; shortLabel: string }[] = [
  { key: 'monday', label: 'Monday', shortLabel: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
  { key: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
  { key: 'friday', label: 'Friday', shortLabel: 'Fri' },
  { key: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
  { key: 'sunday', label: 'Sunday', shortLabel: 'Sun' },
];

export const AVAILABILITY_STATUS_CONFIG: Record<AvailabilityStatus, { label: string; color: string; bgColor: string }> = {
  available: { label: 'Available', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300' },
  unavailable: { label: 'Unavailable', color: 'text-red-700', bgColor: 'bg-red-100 border-red-300' },
  preferred: { label: 'Preferred', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' },
  avoid: { label: 'Avoid if possible', color: 'text-amber-700', bgColor: 'bg-amber-100 border-amber-300' },
};

// -------------------- TIME SLOT TYPES --------------------

export interface TimeRange {
  startTime: string; // HH:MM format (24h)
  endTime: string;   // HH:MM format (24h)
}

export interface TimeSlot extends TimeRange {
  id: string;
  dayOfWeek: DayOfWeek;
}

// -------------------- AVAILABILITY TYPES --------------------

export interface AvailabilitySlot extends TimeSlot {
  status: AvailabilityStatus;
}

export interface TeacherAvailabilityTemplate {
  id: string;
  teacherId: string;
  slots: AvailabilitySlot[];
  preferences: TeacherPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityException {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  slots: {
    startTime: string;
    endTime: string;
    status: AvailabilityStatus;
  }[];
  reason?: string;
  createdAt: string;
  createdBy: string; // User ID (teacher or admin)
}

export interface TeacherPreferences {
  maxPeriodsPerDay?: number;
  maxPeriodsPerWeek?: number;
  preferredBreakDuration?: number; // minutes
  preferConsecutiveClasses?: boolean;
  avoidFirstPeriod?: boolean;
  avoidLastPeriod?: boolean;
  notes?: string;
}

export interface TeacherAvailabilityWithInfo {
  teacherId: string;
  teacherName: string;
  department: string;
  email: string;
  avatar?: string;
  template: TeacherAvailabilityTemplate | null;
  exceptions: AvailabilityException[];
  completionStatus: 'complete' | 'partial' | 'pending';
  lastUpdated?: string;
}

// -------------------- SCHOOL CONFIGURATION --------------------

export interface SchoolPeriodConfig {
  periodNumber: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakName?: string; // e.g., "Recess", "Lunch"
}

export interface SchoolScheduleConfig {
  id: string;
  schoolId: string;
  academicYear: string;
  term: string;
  workingDays: DayOfWeek[];
  schoolStartTime: string; // e.g., "08:00"
  schoolEndTime: string;   // e.g., "15:00"
  periodDuration: number;  // minutes (45, 50, 60)
  periods: SchoolPeriodConfig[];
  createdAt: string;
  updatedAt: string;
}

// -------------------- CLASS & SUBJECT TYPES --------------------

export interface Grade {
  id: string;
  name: string; // e.g., "Grade 10", "Year 11"
  level: number;
}

export interface Section {
  id: string;
  gradeId: string;
  name: string; // e.g., "A", "B", "Science", "Arts"
  capacity: number;
  homeRoom?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  requiresLab?: boolean;
  requiresSpecialRoom?: string; // Room type if special room needed
  color: string; // For visual display
}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'computer_room' | 'auditorium' | 'gym' | 'library' | 'other';
  capacity: number;
  building?: string;
  floor?: number;
  facilities?: string[];
  isActive: boolean;
}

// -------------------- TEACHING ASSIGNMENT TYPES --------------------

export interface SubjectRequirement {
  id: string;
  gradeId: string;
  sectionId: string;
  subjectId: string;
  periodsPerWeek: number;
  assignedTeacherId?: string;
  preferredTeacherIds?: string[]; // For auto-assignment preference
  requiresDoubleLesson?: boolean; // Some subjects need 2 consecutive periods
  roomRequirement?: string; // Specific room type needed
}

export interface TeacherWorkloadRule {
  teacherId: string;
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
  minBreakBetweenClasses?: number; // minutes
}

// -------------------- TIMETABLE TYPES --------------------

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  isLocked: boolean; // Prevent auto-regeneration from changing this
  isDoubleLesson?: boolean;
  notes?: string;
}

export interface ClassTimetable {
  id: string;
  gradeId: string;
  sectionId: string;
  academicYear: string;
  term: string;
  slots: TimetableSlot[];
  status: TimetableStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publishedBy?: string;
}

export interface TimetableHeader {
  id: string;
  schoolId: string;
  academicYear: string;
  term: string;
  gradeId: string;
  sectionId: string;
  status: TimetableStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publishedBy?: string;
}

// -------------------- CONFLICT & VALIDATION TYPES --------------------

export interface TimetableConflict {
  id: string;
  type: ConflictType;
  severity: 'error' | 'warning';
  message: string;
  details: {
    dayOfWeek?: DayOfWeek;
    periodNumber?: number;
    teacherId?: string;
    teacherName?: string;
    subjectId?: string;
    subjectName?: string;
    roomId?: string;
    roomName?: string;
    gradeSection?: string;
    currentValue?: number;
    maxValue?: number;
    requiredValue?: number;
    availableValue?: number;
  };
  suggestions?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: TimetableConflict[];
  warnings: TimetableConflict[];
  summary: {
    totalSlots: number;
    filledSlots: number;
    emptySlots: number;
    lockedSlots: number;
    conflictCount: number;
    warningCount: number;
  };
}

// -------------------- SCHEDULING ENGINE TYPES --------------------

export interface SchedulingConstraints {
  schoolConfig: SchoolScheduleConfig;
  subjectRequirements: SubjectRequirement[];
  teacherWorkloadRules: TeacherWorkloadRule[];
  teacherAvailability: TeacherAvailabilityWithInfo[];
  rooms: Room[];
  existingLockedSlots?: TimetableSlot[];
  optimizationWeights?: {
    preferTeacherPreferred: number; // 0-1
    minimizeRoomChanges: number;
    balanceTeacherWorkload: number;
    groupConsecutiveLessons: number;
  };
}

export interface GenerationResult {
  success: boolean;
  timetable?: ClassTimetable;
  conflicts: TimetableConflict[];
  stats: {
    totalAttempts: number;
    successfulPlacements: number;
    failedPlacements: number;
    executionTimeMs: number;
  };
}

// -------------------- AUDIT LOG TYPES --------------------

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  entityType: 'availability' | 'timetable' | 'slot';
  entityId: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  reason?: string;
  metadata?: Record<string, unknown>;
}

// -------------------- DASHBOARD TYPES --------------------

export interface TimetableDashboardStats {
  totalClasses: number;
  scheduledClasses: number;
  unscheduledClasses: number;
  totalConflicts: number;
  totalWarnings: number;
  teachersWithAvailability: number;
  teachersPendingAvailability: number;
  publishedTimetables: number;
  draftTimetables: number;
}

export interface RecentActivity {
  id: string;
  type: 'timetable_published' | 'availability_updated' | 'conflict_resolved' | 'draft_created';
  description: string;
  timestamp: string;
  user: string;
  gradeSection?: string;
}

// -------------------- API REQUEST/RESPONSE TYPES --------------------

export interface GenerateTimetableRequest {
  gradeId: string;
  sectionId: string;
  academicYear: string;
  term: string;
  constraints: SchedulingConstraints;
  seed?: number; // For reproducibility
}

export interface GenerateTimetableResponse {
  success: boolean;
  timetable?: ClassTimetable;
  conflicts: TimetableConflict[];
  executionTime: number;
}

export interface ValidateTimetableRequest {
  timetable: ClassTimetable;
  constraints: SchedulingConstraints;
}

export interface SaveDraftRequest {
  timetable: ClassTimetable;
}

export interface PublishTimetableRequest {
  timetableId: string;
  notifyTeachers?: boolean;
  notifyStudents?: boolean;
}

// -------------------- SAMPLE DATA GENERATORS --------------------

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  periodDuration: number,
  breaks: { afterPeriod: number; duration: number; name: string }[]
): SchoolPeriodConfig[] {
  const periods: SchoolPeriodConfig[] = [];
  let currentTime = startTime;
  let periodNumber = 1;

  const addMinutes = (time: string, minutes: number): string => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + minutes;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  while (timeToMinutes(currentTime) < timeToMinutes(endTime)) {
    const periodEnd = addMinutes(currentTime, periodDuration);

    periods.push({
      periodNumber,
      startTime: currentTime,
      endTime: periodEnd,
      isBreak: false,
    });

    currentTime = periodEnd;

    // Check if there's a break after this period
    const breakConfig = breaks.find(b => b.afterPeriod === periodNumber);
    if (breakConfig && timeToMinutes(currentTime) < timeToMinutes(endTime)) {
      const breakEnd = addMinutes(currentTime, breakConfig.duration);
      periods.push({
        periodNumber: periodNumber + 0.5, // Use decimal to indicate break
        startTime: currentTime,
        endTime: breakEnd,
        isBreak: true,
        breakName: breakConfig.name,
      });
      currentTime = breakEnd;
    }

    periodNumber++;
  }

  return periods;
}

// -------------------- COLOR PALETTE FOR SUBJECTS --------------------

export const SUBJECT_COLORS = [
  { value: 'bg-blue-100 border-blue-300 text-blue-800', label: 'Blue' },
  { value: 'bg-green-100 border-green-300 text-green-800', label: 'Green' },
  { value: 'bg-purple-100 border-purple-300 text-purple-800', label: 'Purple' },
  { value: 'bg-amber-100 border-amber-300 text-amber-800', label: 'Amber' },
  { value: 'bg-rose-100 border-rose-300 text-rose-800', label: 'Rose' },
  { value: 'bg-cyan-100 border-cyan-300 text-cyan-800', label: 'Cyan' },
  { value: 'bg-orange-100 border-orange-300 text-orange-800', label: 'Orange' },
  { value: 'bg-indigo-100 border-indigo-300 text-indigo-800', label: 'Indigo' },
  { value: 'bg-teal-100 border-teal-300 text-teal-800', label: 'Teal' },
  { value: 'bg-pink-100 border-pink-300 text-pink-800', label: 'Pink' },
  { value: 'bg-lime-100 border-lime-300 text-lime-800', label: 'Lime' },
  { value: 'bg-violet-100 border-violet-300 text-violet-800', label: 'Violet' },
];
