"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Save,
  Send,
  Wand2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  Clock,
  Users,
  BookOpen,
  MapPin,
  Loader2,
  Info,
  GripVertical,
} from "lucide-react"
import { toast } from "sonner"
import {
  TimetableSlot,
  ClassTimetable,
  TimetableConflict,
  ValidationResult,
  SchoolScheduleConfig,
  SubjectRequirement,
  TeacherAvailabilityWithInfo,
  Subject,
  Room,
  Grade,
  Section,
  DayOfWeek,
  DAYS_OF_WEEK,
  AVAILABILITY_STATUS_CONFIG,
} from "@/types/timetable"
import {
  SAMPLE_GRADES,
  SAMPLE_SECTIONS,
  SAMPLE_SUBJECTS,
  SAMPLE_ROOMS,
  SAMPLE_SCHOOL_CONFIG,
  SAMPLE_SUBJECT_REQUIREMENTS,
  SAMPLE_TEACHER_AVAILABILITY,
  SAMPLE_TIMETABLE_SLOTS,
  SAMPLE_CLASS_TIMETABLE,
  getTeacherById,
  getSubjectById,
  getRoomById,
  getSectionsByGrade,
} from "@/data/timetableSampleData"

// -------------------- UTILITY --------------------

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// -------------------- SCHEDULING ALGORITHM --------------------

interface SchedulingContext {
  slots: TimetableSlot[]
  requirements: SubjectRequirement[]
  teacherAvailability: TeacherAvailabilityWithInfo[]
  schoolConfig: SchoolScheduleConfig
  rooms: Room[]
  subjects: Subject[]
}

function validateTimetable(context: SchedulingContext): ValidationResult {
  const conflicts: TimetableConflict[] = []
  const warnings: TimetableConflict[] = []
  const { slots, requirements, teacherAvailability, schoolConfig } = context

  // Group slots by teacher and day for workload check
  const teacherDaySlots = new Map<string, TimetableSlot[]>()
  const teacherWeekSlots = new Map<string, TimetableSlot[]>()

  slots.forEach(slot => {
    const key = `${slot.teacherId}-${slot.dayOfWeek}`
    if (!teacherDaySlots.has(key)) teacherDaySlots.set(key, [])
    teacherDaySlots.get(key)!.push(slot)

    if (!teacherWeekSlots.has(slot.teacherId)) teacherWeekSlots.set(slot.teacherId, [])
    teacherWeekSlots.get(slot.teacherId)!.push(slot)
  })

  // Check for teacher double-booking
  const slotsByPeriod = new Map<string, TimetableSlot[]>()
  slots.forEach(slot => {
    const key = `${slot.dayOfWeek}-${slot.periodNumber}`
    if (!slotsByPeriod.has(key)) slotsByPeriod.set(key, [])
    slotsByPeriod.get(key)!.push(slot)
  })

  slotsByPeriod.forEach((periodSlots, key) => {
    const teacherCounts = new Map<string, number>()
    periodSlots.forEach(slot => {
      teacherCounts.set(slot.teacherId, (teacherCounts.get(slot.teacherId) || 0) + 1)
    })
    teacherCounts.forEach((count, teacherId) => {
      if (count > 1) {
        const teacher = getTeacherById(teacherId)
        const [day, period] = key.split('-')
        conflicts.push({
          id: `conflict-double-${teacherId}-${key}`,
          type: 'teacher_double_booking',
          severity: 'error',
          message: `${teacher?.name || 'Unknown teacher'} is assigned to ${count} classes at the same time`,
          details: {
            dayOfWeek: day as DayOfWeek,
            periodNumber: parseInt(period),
            teacherId,
            teacherName: teacher?.name,
          },
          suggestions: ['Remove one assignment', 'Assign a different teacher'],
        })
      }
    })
  })

  // Check teacher availability
  slots.forEach(slot => {
    const teacher = teacherAvailability.find(t => t.teacherId === slot.teacherId)
    if (teacher?.template) {
      const availSlot = teacher.template.slots.find(
        s => s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime
      )
      if (availSlot?.status === 'unavailable') {
        const teacherInfo = getTeacherById(slot.teacherId)
        conflicts.push({
          id: `conflict-unavail-${slot.id}`,
          type: 'teacher_unavailable',
          severity: 'error',
          message: `${teacherInfo?.name || 'Teacher'} is unavailable during this slot`,
          details: {
            dayOfWeek: slot.dayOfWeek,
            periodNumber: slot.periodNumber,
            teacherId: slot.teacherId,
            teacherName: teacherInfo?.name,
          },
          suggestions: ['Move to an available slot', 'Assign a different teacher'],
        })
      } else if (availSlot?.status === 'avoid') {
        const teacherInfo = getTeacherById(slot.teacherId)
        warnings.push({
          id: `warning-avoid-${slot.id}`,
          type: 'teacher_unavailable',
          severity: 'warning',
          message: `${teacherInfo?.name || 'Teacher'} prefers to avoid this time slot`,
          details: {
            dayOfWeek: slot.dayOfWeek,
            periodNumber: slot.periodNumber,
            teacherId: slot.teacherId,
            teacherName: teacherInfo?.name,
          },
        })
      }
    }
  })

  // Check workload limits
  teacherDaySlots.forEach((daySlots, key) => {
    const [teacherId] = key.split('-')
    const teacher = teacherAvailability.find(t => t.teacherId === teacherId)
    const maxPerDay = teacher?.template?.preferences?.maxPeriodsPerDay || 6
    if (daySlots.length > maxPerDay) {
      const teacherInfo = getTeacherById(teacherId)
      warnings.push({
        id: `warning-workload-${key}`,
        type: 'workload_exceeded',
        severity: 'warning',
        message: `${teacherInfo?.name || 'Teacher'} exceeds max periods per day`,
        details: {
          teacherId,
          teacherName: teacherInfo?.name,
          currentValue: daySlots.length,
          maxValue: maxPerDay,
        },
        suggestions: ['Redistribute periods to other days'],
      })
    }
  })

  // Check subject requirements met
  requirements.forEach(req => {
    const subjectSlots = slots.filter(s => s.subjectId === req.subjectId)
    if (subjectSlots.length < req.periodsPerWeek) {
      const subject = getSubjectById(req.subjectId)
      warnings.push({
        id: `warning-insufficient-${req.id}`,
        type: 'insufficient_slots',
        severity: 'warning',
        message: `${subject?.name || 'Subject'} has insufficient periods`,
        details: {
          subjectId: req.subjectId,
          subjectName: subject?.name,
          currentValue: subjectSlots.length,
          requiredValue: req.periodsPerWeek,
        },
        suggestions: ['Add more periods for this subject'],
      })
    }
  })

  const lockedSlots = slots.filter(s => s.isLocked).length

  return {
    isValid: conflicts.length === 0,
    conflicts,
    warnings,
    summary: {
      totalSlots: schoolConfig.periods.filter(p => !p.isBreak).length * schoolConfig.workingDays.length,
      filledSlots: slots.length,
      emptySlots: (schoolConfig.periods.filter(p => !p.isBreak).length * schoolConfig.workingDays.length) - slots.length,
      lockedSlots,
      conflictCount: conflicts.length,
      warningCount: warnings.length,
    },
  }
}

function autoGenerateTimetable(context: SchedulingContext): { slots: TimetableSlot[], conflicts: TimetableConflict[] } {
  const { requirements, teacherAvailability, schoolConfig, rooms, subjects } = context
  const existingLocked = context.slots.filter(s => s.isLocked)
  const newSlots: TimetableSlot[] = [...existingLocked]
  const conflicts: TimetableConflict[] = []

  // Get available periods (not breaks)
  const periods = schoolConfig.periods.filter(p => !p.isBreak)
  const days = schoolConfig.workingDays

  // Track teacher assignments per slot
  const teacherAssignments = new Map<string, string>() // key: day-period, value: teacherId

  // Initialize with locked slots
  existingLocked.forEach(slot => {
    teacherAssignments.set(`${slot.dayOfWeek}-${slot.periodNumber}`, slot.teacherId)
  })

  // Sort requirements by periods needed (descending) for better scheduling
  const sortedReqs = [...requirements].sort((a, b) => b.periodsPerWeek - a.periodsPerWeek)

  sortedReqs.forEach(req => {
    if (!req.assignedTeacherId) return

    const subject = subjects.find(s => s.id === req.subjectId)
    const teacher = teacherAvailability.find(t => t.teacherId === req.assignedTeacherId)
    let periodsToAssign = req.periodsPerWeek

    // Find already assigned slots for this subject
    const existingSubjectSlots = newSlots.filter(s => s.subjectId === req.subjectId)
    periodsToAssign -= existingSubjectSlots.length

    if (periodsToAssign <= 0) return

    // Try to assign remaining periods
    for (const day of days) {
      if (periodsToAssign <= 0) break

      for (const period of periods) {
        if (periodsToAssign <= 0) break

        const slotKey = `${day}-${period.periodNumber}`

        // Check if slot is already taken
        if (newSlots.some(s => s.dayOfWeek === day && s.periodNumber === period.periodNumber)) {
          continue
        }

        // Check if teacher is already assigned this period
        if (teacherAssignments.has(slotKey)) {
          continue
        }

        // Check teacher availability
        const availSlot = teacher?.template?.slots.find(
          s => s.dayOfWeek === day && s.startTime === period.startTime
        )
        if (availSlot?.status === 'unavailable') {
          continue
        }

        // Find appropriate room
        let roomId = undefined
        if (req.roomRequirement) {
          const room = rooms.find(r => r.type === req.roomRequirement && r.isActive)
          roomId = room?.id
        }

        // Create slot
        const newSlot: TimetableSlot = {
          id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dayOfWeek: day,
          periodNumber: period.periodNumber,
          startTime: period.startTime,
          endTime: period.endTime,
          subjectId: req.subjectId,
          teacherId: req.assignedTeacherId!,
          roomId,
          isLocked: false,
        }

        newSlots.push(newSlot)
        teacherAssignments.set(slotKey, req.assignedTeacherId!)
        periodsToAssign--
      }
    }

    if (periodsToAssign > 0) {
      conflicts.push({
        id: `gen-conflict-${req.id}`,
        type: 'insufficient_slots',
        severity: 'warning',
        message: `Could not fully schedule ${subject?.name || 'subject'}`,
        details: {
          subjectId: req.subjectId,
          subjectName: subject?.name,
          requiredValue: req.periodsPerWeek,
          availableValue: req.periodsPerWeek - periodsToAssign,
        },
        suggestions: ['Try different time constraints', 'Check teacher availability'],
      })
    }
  })

  return { slots: newSlots, conflicts }
}

// -------------------- COMPONENTS --------------------

function GradeSelector({
  grades,
  sections,
  selectedGrade,
  selectedSection,
  onGradeChange,
  onSectionChange,
}: {
  grades: Grade[]
  sections: Section[]
  selectedGrade: string
  selectedSection: string
  onGradeChange: (gradeId: string) => void
  onSectionChange: (sectionId: string) => void
}) {
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false)
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false)

  const gradeSections = useMemo(() => {
    return sections.filter(s => s.gradeId === selectedGrade)
  }, [sections, selectedGrade])

  const selectedGradeObj = grades.find(g => g.id === selectedGrade)
  const selectedSectionObj = sections.find(s => s.id === selectedSection)

  return (
    <div className="flex items-center gap-3">
      {/* Grade Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {selectedGradeObj?.name || "Select Grade"}
          <ChevronDown className="h-4 w-4" />
        </button>
        {gradeDropdownOpen && (
          <div className="absolute top-full left-0 z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {grades.map(grade => (
              <button
                key={grade.id}
                type="button"
                onClick={() => {
                  onGradeChange(grade.id)
                  setGradeDropdownOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                  selectedGrade === grade.id && "bg-slate-100"
                )}
              >
                {grade.name}
                {selectedGrade === grade.id && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
          disabled={!selectedGrade}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {selectedSectionObj?.name || "Select Section"}
          <ChevronDown className="h-4 w-4" />
        </button>
        {sectionDropdownOpen && (
          <div className="absolute top-full left-0 z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {gradeSections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  onSectionChange(section.id)
                  setSectionDropdownOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                  selectedSection === section.id && "bg-slate-100"
                )}
              >
                {section.name}
                {selectedSection === section.id && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SlotCell({
  slot,
  period,
  day,
  subjects,
  onEdit,
  onDelete,
  onToggleLock,
  isBreak,
}: {
  slot?: TimetableSlot
  period: { periodNumber: number; startTime: string; endTime: string; breakName?: string }
  day: DayOfWeek
  subjects: Subject[]
  onEdit: () => void
  onDelete: () => void
  onToggleLock: () => void
  isBreak: boolean
}) {
  if (isBreak) {
    return (
      <td className="px-1 py-1">
        <div className="h-16 rounded-lg bg-slate-100 flex items-center justify-center">
          <span className="text-xs text-slate-500">{period.breakName || "Break"}</span>
        </div>
      </td>
    )
  }

  if (!slot) {
    return (
      <td className="px-1 py-1">
        <button
          type="button"
          onClick={onEdit}
          className="w-full h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <Plus className="h-4 w-4 text-slate-400" />
        </button>
      </td>
    )
  }

  const subject = subjects.find(s => s.id === slot.subjectId)
  const teacher = getTeacherById(slot.teacherId)
  const room = slot.roomId ? getRoomById(slot.roomId) : null

  return (
    <td className="px-1 py-1">
      <div
        className={cn(
          "relative group h-16 rounded-lg border-2 p-2 cursor-pointer transition-all hover:shadow-md",
          subject?.color || "bg-slate-100 border-slate-200 text-slate-800",
          slot.isLocked && "ring-2 ring-amber-400"
        )}
        onClick={onEdit}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate">{subject?.code || "?"}</div>
            <div className="text-[10px] truncate opacity-80">{teacher?.name?.split(" ").pop() || "?"}</div>
            {room && <div className="text-[10px] truncate opacity-60">{room.name}</div>}
          </div>
          {slot.isLocked && (
            <Lock className="h-3 w-3 flex-shrink-0 text-amber-600" />
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleLock()
            }}
            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700"
            title={slot.isLocked ? "Unlock" : "Lock"}
          >
            {slot.isLocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-red-600"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </td>
  )
}

function SlotEditModal({
  isOpen,
  onClose,
  onSave,
  slot,
  period,
  day,
  subjects,
  rooms,
  teacherAvailability,
  requirements,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (slot: Omit<TimetableSlot, "id">) => void
  slot?: TimetableSlot | null
  period: { periodNumber: number; startTime: string; endTime: string }
  day: DayOfWeek
  subjects: Subject[]
  rooms: Room[]
  teacherAvailability: TeacherAvailabilityWithInfo[]
  requirements: SubjectRequirement[]
}) {
  const [subjectId, setSubjectId] = useState(slot?.subjectId || "")
  const [teacherId, setTeacherId] = useState(slot?.teacherId || "")
  const [roomId, setRoomId] = useState(slot?.roomId || "")
  const [isLocked, setIsLocked] = useState(slot?.isLocked || false)

  // Get teachers for selected subject
  const availableTeachers = useMemo(() => {
    if (!subjectId) return []
    const req = requirements.find(r => r.subjectId === subjectId)
    if (req?.assignedTeacherId) {
      const teacher = teacherAvailability.find(t => t.teacherId === req.assignedTeacherId)
      return teacher ? [teacher] : []
    }
    return teacherAvailability
  }, [subjectId, requirements, teacherAvailability])

  // Get teacher availability for selected slot
  const selectedTeacherAvailability = useMemo(() => {
    if (!teacherId) return null
    const teacher = teacherAvailability.find(t => t.teacherId === teacherId)
    const availSlot = teacher?.template?.slots.find(
      s => s.dayOfWeek === day && s.startTime === period.startTime
    )
    return availSlot
  }, [teacherId, teacherAvailability, day, period])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectId || !teacherId) {
      toast.error("Please select subject and teacher")
      return
    }
    onSave({
      dayOfWeek: day,
      periodNumber: period.periodNumber,
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId,
      teacherId,
      roomId: roomId || undefined,
      isLocked,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {slot ? "Edit Slot" : "Add Class"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>{DAYS_OF_WEEK.find(d => d.key === day)?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Period {period.periodNumber}</span>
              <span className="text-slate-400">({period.startTime} - {period.endTime})</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value)
                setTeacherId("")
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teacher <span className="text-red-500">*</span>
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              disabled={!subjectId}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select teacher</option>
              {availableTeachers.map(teacher => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherName}
                </option>
              ))}
            </select>
            {selectedTeacherAvailability && (
              <div className={cn(
                "mt-2 flex items-center gap-2 text-xs rounded-lg px-2 py-1",
                AVAILABILITY_STATUS_CONFIG[selectedTeacherAvailability.status].bgColor
              )}>
                <span>Teacher availability: {AVAILABILITY_STATUS_CONFIG[selectedTeacherAvailability.status].label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Room (optional)
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No specific room</option>
              {rooms.filter(r => r.isActive).map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isLocked"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isLocked" className="text-sm text-slate-700">
              Lock this slot (prevent auto-regeneration changes)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {slot ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConflictPanel({
  validation,
  onClose,
}: {
  validation: ValidationResult
  onClose: () => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          {validation.isValid ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          Validation
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-auto">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-2">
            <span className="text-slate-500">Filled</span>
            <p className="font-semibold text-slate-900">{validation.summary.filledSlots}/{validation.summary.totalSlots}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <span className="text-slate-500">Locked</span>
            <p className="font-semibold text-slate-900">{validation.summary.lockedSlots}</p>
          </div>
        </div>

        {/* Conflicts */}
        {validation.conflicts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">
              Errors ({validation.conflicts.length})
            </h4>
            <div className="space-y-2">
              {validation.conflicts.map(conflict => (
                <div key={conflict.id} className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs">
                  <p className="font-medium text-red-800">{conflict.message}</p>
                  {conflict.suggestions && (
                    <p className="text-red-600 mt-1">Tip: {conflict.suggestions[0]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-2">
              Warnings ({validation.warnings.length})
            </h4>
            <div className="space-y-2">
              {validation.warnings.map(warning => (
                <div key={warning.id} className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs">
                  <p className="font-medium text-amber-800">{warning.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {validation.isValid && validation.warnings.length === 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">All validations passed!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------- MAIN COMPONENT --------------------

export default function TimetablePlanner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // State
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get("grade") || "grade-10")
  const [selectedSection, setSelectedSection] = useState(searchParams.get("section") || "sec-10-sci")
  const [slots, setSlots] = useState<TimetableSlot[]>(SAMPLE_TIMETABLE_SLOTS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConflictPanel, setShowConflictPanel] = useState(false)
  const [editingSlot, setEditingSlot] = useState<{ slot?: TimetableSlot; period: any; day: DayOfWeek } | null>(null)

  // Data
  const grades = SAMPLE_GRADES
  const sections = SAMPLE_SECTIONS
  const subjects = SAMPLE_SUBJECTS
  const rooms = SAMPLE_ROOMS
  const schoolConfig = SAMPLE_SCHOOL_CONFIG
  const requirements = SAMPLE_SUBJECT_REQUIREMENTS
  const teacherAvailability = SAMPLE_TEACHER_AVAILABILITY

  // Derived data
  const workingDays = DAYS_OF_WEEK.filter(d => schoolConfig.workingDays.includes(d.key))
  const periods = schoolConfig.periods

  // Validation
  const validation = useMemo(() => {
    return validateTimetable({
      slots,
      requirements,
      teacherAvailability,
      schoolConfig,
      rooms,
      subjects,
    })
  }, [slots, requirements, teacherAvailability, schoolConfig, rooms, subjects])

  // Get slot for a specific period and day
  const getSlot = useCallback((day: DayOfWeek, periodNumber: number): TimetableSlot | undefined => {
    return slots.find(s => s.dayOfWeek === day && s.periodNumber === periodNumber)
  }, [slots])

  // Handlers
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId)
    const newSections = getSectionsByGrade(gradeId)
    if (newSections.length > 0) {
      setSelectedSection(newSections[0].id)
    }
  }

  const handleAutoGenerate = async () => {
    setIsGenerating(true)
    toast.loading("Generating timetable...")

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const result = autoGenerateTimetable({
      slots,
      requirements,
      teacherAvailability,
      schoolConfig,
      rooms,
      subjects,
    })

    setSlots(result.slots)
    setIsGenerating(false)
    toast.dismiss()

    if (result.conflicts.length > 0) {
      toast.warning(`Generated with ${result.conflicts.length} issues`)
      setShowConflictPanel(true)
    } else {
      toast.success("Timetable generated successfully!")
    }
  }

  const handleSaveDraft = () => {
    // In real app, this would call an API
    toast.success("Draft saved successfully!")
  }

  const handlePublish = () => {
    if (!validation.isValid) {
      toast.error("Cannot publish: Please resolve all conflicts first")
      setShowConflictPanel(true)
      return
    }
    toast.success("Timetable published successfully!")
  }

  const handleSlotSave = (slotData: Omit<TimetableSlot, "id">) => {
    if (editingSlot?.slot) {
      // Update existing
      setSlots(prev => prev.map(s =>
        s.id === editingSlot.slot!.id ? { ...s, ...slotData } : s
      ))
      toast.success("Slot updated")
    } else {
      // Add new
      const newSlot: TimetableSlot = {
        ...slotData,
        id: `slot-${Date.now()}`,
      }
      setSlots(prev => [...prev, newSlot])
      toast.success("Slot added")
    }
    setEditingSlot(null)
  }

  const handleSlotDelete = (slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId))
    toast.success("Slot removed")
  }

  const handleToggleLock = (slotId: string) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, isLocked: !s.isLocked } : s
    ))
  }

  const handleClearAll = () => {
    const locked = slots.filter(s => s.isLocked)
    setSlots(locked)
    toast.success("Cleared all unlocked slots")
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/school-admin/timetable-dashboard")}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Timetable Planner</h1>
            <p className="text-sm text-gray-600">
              Create and manage class schedules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!validation.isValid}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <GradeSelector
          grades={grades}
          sections={sections}
          selectedGrade={selectedGrade}
          selectedSection={selectedSection}
          onGradeChange={handleGradeChange}
          onSectionChange={setSelectedSection}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConflictPanel(!showConflictPanel)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
              validation.isValid
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            {validation.isValid ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {validation.conflicts.length} errors, {validation.warnings.length} warnings
          </button>

          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Auto Generate
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Timetable Grid */}
        <div className="flex-1 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-24">
                    Period
                  </th>
                  {workingDays.map(day => (
                    <th key={day.key} className="px-2 py-3 text-center text-sm font-semibold text-slate-900">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period.periodNumber} className={period.isBreak ? "bg-slate-50" : ""}>
                    <td className="px-4 py-1 text-sm border-r border-slate-200">
                      <div className="font-medium text-slate-900">
                        {period.isBreak ? period.breakName : `Period ${Math.floor(period.periodNumber)}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {period.startTime} - {period.endTime}
                      </div>
                    </td>
                    {workingDays.map(day => (
                      <SlotCell
                        key={`${day.key}-${period.periodNumber}`}
                        slot={getSlot(day.key, period.periodNumber)}
                        period={period}
                        day={day.key}
                        subjects={subjects}
                        isBreak={period.isBreak}
                        onEdit={() => setEditingSlot({
                          slot: getSlot(day.key, period.periodNumber),
                          period,
                          day: day.key,
                        })}
                        onDelete={() => {
                          const slot = getSlot(day.key, period.periodNumber)
                          if (slot) handleSlotDelete(slot.id)
                        }}
                        onToggleLock={() => {
                          const slot = getSlot(day.key, period.periodNumber)
                          if (slot) handleToggleLock(slot.id)
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conflict Panel */}
        {showConflictPanel && (
          <div className="w-80 flex-shrink-0">
            <ConflictPanel
              validation={validation}
              onClose={() => setShowConflictPanel(false)}
            />
          </div>
        )}
      </div>

      {/* Subject Legend */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Subject Legend</h3>
        <div className="flex flex-wrap gap-2">
          {subjects.slice(0, 10).map(subject => (
            <div
              key={subject.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium",
                subject.color
              )}
            >
              <span className="font-bold">{subject.code}</span>
              <span className="opacity-75">{subject.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slot Edit Modal */}
      {editingSlot && (
        <SlotEditModal
          isOpen={!!editingSlot}
          onClose={() => setEditingSlot(null)}
          onSave={handleSlotSave}
          slot={editingSlot.slot}
          period={editingSlot.period}
          day={editingSlot.day}
          subjects={subjects}
          rooms={rooms}
          teacherAvailability={teacherAvailability}
          requirements={requirements}
        />
      )}
    </div>
  )
}
