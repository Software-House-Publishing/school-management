"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  Check,
  AlertCircle,
  Clock,
  Users,
  Eye,
  Pencil,
  X,
  Save,
  Info,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import {
  TeacherAvailabilityWithInfo,
  AvailabilitySlot,
  AvailabilityStatus,
  DAYS_OF_WEEK,
  AVAILABILITY_STATUS_CONFIG,
  DayOfWeek,
  AuditLogEntry,
} from "@/types/timetable"
import { SAMPLE_TEACHER_AVAILABILITY } from "@/data/timetableSampleData"

// -------------------- TYPES --------------------

type CompletionFilter = "all" | "complete" | "partial" | "pending"
type DepartmentFilter = string | "all"

// -------------------- CONSTANTS --------------------

const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "08:00" },
  { start: "09:00", end: "10:00", label: "09:00" },
  { start: "10:00", end: "11:00", label: "10:00" },
  { start: "11:00", end: "12:00", label: "11:00" },
  { start: "13:00", end: "14:00", label: "13:00" },
  { start: "14:00", end: "15:00", label: "14:00" },
  { start: "15:00", end: "16:00", label: "15:00" },
]

const WORKING_DAYS = DAYS_OF_WEEK.filter(d =>
  ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(d.key)
)

// -------------------- UTILITY FUNCTIONS --------------------

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function getCompletionIcon(status: "complete" | "partial" | "pending") {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "partial":
      return <MinusCircle className="h-4 w-4 text-amber-600" />
    case "pending":
      return <XCircle className="h-4 w-4 text-red-600" />
  }
}

function getCompletionBadge(status: "complete" | "partial" | "pending") {
  switch (status) {
    case "complete":
      return "bg-green-100 text-green-700 border-green-200"
    case "partial":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "pending":
      return "bg-red-100 text-red-700 border-red-200"
  }
}

// -------------------- COMPONENTS --------------------

function TeacherCard({
  teacher,
  onView,
  onEdit,
}: {
  teacher: TeacherAvailabilityWithInfo
  onView: () => void
  onEdit: () => void
}) {
  const availableCount = teacher.template?.slots.filter(s => s.status === "available" || s.status === "preferred").length || 0
  const totalSlots = teacher.template?.slots.length || 35 // 7 periods * 5 days

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
            {teacher.teacherName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{teacher.teacherName}</h3>
            <p className="text-sm text-slate-500">{teacher.department}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-1 rounded-full border px-2 py-1", getCompletionBadge(teacher.completionStatus))}>
          {getCompletionIcon(teacher.completionStatus)}
          <span className="text-xs font-medium capitalize">{teacher.completionStatus}</span>
        </div>
      </div>

      {teacher.template ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Available Slots</span>
            <span className="font-medium text-slate-900">{availableCount}/{totalSlots}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(availableCount / totalSlots) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Last updated: {new Date(teacher.lastUpdated!).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
          <p className="text-sm text-slate-500">No availability submitted yet</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Override
        </button>
      </div>
    </div>
  )
}

function AvailabilityViewModal({
  isOpen,
  onClose,
  teacher,
  isEditMode,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  teacher: TeacherAvailabilityWithInfo | null
  isEditMode: boolean
  onSave?: (slots: AvailabilitySlot[], reason: string) => void
}) {
  const [editedSlots, setEditedSlots] = useState<AvailabilitySlot[]>([])
  const [overrideReason, setOverrideReason] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>("available")
  const [isDragging, setIsDragging] = useState(false)

  // Initialize slots when modal opens
  useMemo(() => {
    if (teacher?.template?.slots) {
      setEditedSlots([...teacher.template.slots])
    } else {
      // Generate default available slots
      const slots: AvailabilitySlot[] = []
      WORKING_DAYS.forEach(day => {
        TIME_SLOTS.forEach((time, index) => {
          slots.push({
            id: `${teacher?.teacherId}-${day.key}-${index}`,
            dayOfWeek: day.key,
            startTime: time.start,
            endTime: time.end,
            status: "available",
          })
        })
      })
      setEditedSlots(slots)
    }
  }, [teacher])

  const getSlot = useCallback((day: DayOfWeek, startTime: string): AvailabilitySlot | undefined => {
    return editedSlots.find(s => s.dayOfWeek === day && s.startTime === startTime)
  }, [editedSlots])

  const updateSlot = useCallback((day: DayOfWeek, startTime: string, status: AvailabilityStatus) => {
    setEditedSlots(prev => prev.map(slot =>
      slot.dayOfWeek === day && slot.startTime === startTime
        ? { ...slot, status }
        : slot
    ))
  }, [])

  const handleCellInteraction = useCallback((day: DayOfWeek, startTime: string) => {
    if (isEditMode) {
      updateSlot(day, startTime, selectedStatus)
    }
  }, [isEditMode, selectedStatus, updateSlot])

  const handleSave = () => {
    if (!overrideReason.trim() && isEditMode) {
      toast.error("Please provide a reason for the override")
      return
    }
    onSave?.(editedSlots, overrideReason)
    onClose()
  }

  if (!isOpen || !teacher) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {teacher.teacherName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditMode ? "Override Availability" : "View Availability"}
              </h2>
              <p className="text-sm text-slate-500">{teacher.teacherName} - {teacher.department}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border", config.bgColor)} />
                <span className="text-slate-600">{config.label}</span>
              </div>
            ))}
          </div>

          {/* Edit Mode Controls */}
          {isEditMode && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-amber-800">Paint with:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedStatus(key as AvailabilityStatus)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                        config.bgColor,
                        selectedStatus === key && "ring-2 ring-offset-1 ring-slate-400"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weekly Grid */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-20">
                    Time
                  </th>
                  {WORKING_DAYS.map(day => (
                    <th key={day.key} className="px-2 py-3 text-center text-sm font-semibold text-slate-900">
                      {day.shortLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((time, timeIndex) => (
                  <tr key={time.start} className={timeIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-1 text-sm font-medium text-slate-600 border-r border-slate-200">
                      {time.label}
                    </td>
                    {WORKING_DAYS.map(day => {
                      const slot = getSlot(day.key, time.start)
                      const config = slot ? AVAILABILITY_STATUS_CONFIG[slot.status] : AVAILABILITY_STATUS_CONFIG.available
                      return (
                        <td key={`${day.key}-${time.start}`} className="px-1 py-1">
                          <button
                            type="button"
                            disabled={!isEditMode}
                            onMouseDown={() => {
                              if (isEditMode) {
                                setIsDragging(true)
                                handleCellInteraction(day.key, time.start)
                              }
                            }}
                            onMouseEnter={() => {
                              if (isDragging && isEditMode) {
                                handleCellInteraction(day.key, time.start)
                              }
                            }}
                            onMouseUp={() => setIsDragging(false)}
                            className={cn(
                              "w-full h-10 rounded-lg border-2 transition-all duration-150",
                              config.bgColor,
                              isEditMode && "cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-slate-300",
                              !isEditMode && "cursor-default"
                            )}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Teacher Preferences */}
          {teacher.template?.preferences && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Teacher Preferences</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Max/Day:</span>
                  <span className="ml-2 font-medium text-slate-900">
                    {teacher.template.preferences.maxPeriodsPerDay || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Max/Week:</span>
                  <span className="ml-2 font-medium text-slate-900">
                    {teacher.template.preferences.maxPeriodsPerWeek || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Avoid First:</span>
                  <span className="ml-2 font-medium text-slate-900">
                    {teacher.template.preferences.avoidFirstPeriod ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Avoid Last:</span>
                  <span className="ml-2 font-medium text-slate-900">
                    {teacher.template.preferences.avoidLastPeriod ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {teacher.template.preferences.notes && (
                <div className="mt-3 text-sm">
                  <span className="text-slate-500">Notes:</span>
                  <p className="mt-1 text-slate-700">{teacher.template.preferences.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Override Reason (Edit Mode) */}
          {isEditMode && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Override Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={2}
                placeholder="Explain why you're overriding this teacher's availability..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                This will be logged for audit purposes.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {isEditMode ? "Cancel" : "Close"}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Override
            </button>
          )}
        </div>
      </div>

      {/* Mouse up listener for drag */}
      {isDragging && (
        <div
          className="fixed inset-0 z-[60]"
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />
      )}
    </div>
  )
}

// -------------------- MAIN COMPONENT --------------------

export default function TeacherAvailabilityAdmin() {
  // Data state
  const [teachers, setTeachers] = useState<TeacherAvailabilityWithInfo[]>(SAMPLE_TEACHER_AVAILABILITY)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("all")
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>("all")
  const [completionDropdownOpen, setCompletionDropdownOpen] = useState(false)
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false)

  // Modal state
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAvailabilityWithInfo | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(teachers.map(t => t.department))
    return Array.from(depts).sort()
  }, [teachers])

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !teacher.teacherName.toLowerCase().includes(query) &&
          !teacher.email.toLowerCase().includes(query) &&
          !teacher.department.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Completion filter
      if (completionFilter !== "all" && teacher.completionStatus !== completionFilter) {
        return false
      }

      // Department filter
      if (departmentFilter !== "all" && teacher.department !== departmentFilter) {
        return false
      }

      return true
    })
  }, [teachers, searchQuery, completionFilter, departmentFilter])

  // Stats
  const stats = useMemo(() => {
    const complete = teachers.filter(t => t.completionStatus === "complete").length
    const partial = teachers.filter(t => t.completionStatus === "partial").length
    const pending = teachers.filter(t => t.completionStatus === "pending").length
    return { complete, partial, pending, total: teachers.length }
  }, [teachers])

  // Handlers
  const handleView = (teacher: TeacherAvailabilityWithInfo) => {
    setSelectedTeacher(teacher)
    setIsEditMode(false)
    setIsViewModalOpen(true)
  }

  const handleEdit = (teacher: TeacherAvailabilityWithInfo) => {
    setSelectedTeacher(teacher)
    setIsEditMode(true)
    setIsViewModalOpen(true)
  }

  const handleSaveOverride = (slots: AvailabilitySlot[], reason: string) => {
    if (!selectedTeacher) return

    // Update teacher availability
    setTeachers(prev => prev.map(t => {
      if (t.teacherId === selectedTeacher.teacherId) {
        return {
          ...t,
          template: {
            id: t.template?.id || `template-${t.teacherId}`,
            teacherId: t.teacherId,
            slots,
            preferences: t.template?.preferences || {},
            createdAt: t.template?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          completionStatus: "complete" as const,
          lastUpdated: new Date().toISOString(),
        }
      }
      return t
    }))

    // Add audit log
    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      action: "availability_override",
      entityType: "availability",
      entityId: selectedTeacher.teacherId,
      userId: "admin-001",
      userName: "Admin User",
      userRole: "school_administrator",
      timestamp: new Date().toISOString(),
      reason,
      metadata: {
        teacherName: selectedTeacher.teacherName,
      },
    }
    setAuditLogs(prev => [auditEntry, ...prev])

    toast.success(`Availability override saved for ${selectedTeacher.teacherName}`)
  }

  const sendReminder = (teacher: TeacherAvailabilityWithInfo) => {
    toast.success(`Reminder sent to ${teacher.teacherName}`)
  }

  const sendBulkReminder = () => {
    const pendingTeachers = teachers.filter(t => t.completionStatus === "pending")
    toast.success(`Reminders sent to ${pendingTeachers.length} teachers`)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teacher Availability</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage teacher availability for scheduling
          </p>
        </div>
        <button
          type="button"
          onClick={sendBulkReminder}
          disabled={stats.pending === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="h-4 w-4" />
          Send Reminders ({stats.pending})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Teachers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.complete}</p>
              <p className="text-sm text-green-600">Complete</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <MinusCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{stats.partial}</p>
              <p className="text-sm text-amber-600">Partial</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.pending}</p>
              <p className="text-sm text-red-600">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Completion Progress</span>
          <span className="text-sm text-slate-500">
            {Math.round((stats.complete / stats.total) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(stats.complete / stats.total) * 100}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${(stats.partial / stats.total) * 100}%` }}
          />
          <div
            className="h-full bg-red-200 transition-all"
            style={{ width: `${(stats.pending / stats.total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Complete
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-200" /> Pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Completion Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCompletionDropdownOpen(!completionDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Status: {completionFilter === "all" ? "All" : completionFilter}
            <ChevronDown className="h-4 w-4" />
          </button>
          {completionDropdownOpen && (
            <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              {(["all", "complete", "partial", "pending"] as CompletionFilter[]).map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setCompletionFilter(status)
                    setCompletionDropdownOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                    completionFilter === status && "bg-slate-100"
                  )}
                >
                  <span className="capitalize">{status}</span>
                  {completionFilter === status && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Department Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Department: {departmentFilter === "all" ? "All" : departmentFilter}
            <ChevronDown className="h-4 w-4" />
          </button>
          {departmentDropdownOpen && (
            <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg max-h-60 overflow-auto">
              <button
                type="button"
                onClick={() => {
                  setDepartmentFilter("all")
                  setDepartmentDropdownOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                  departmentFilter === "all" && "bg-slate-100"
                )}
              >
                <span>All Departments</span>
                {departmentFilter === "all" && <Check className="h-4 w-4 text-blue-600" />}
              </button>
              {departments.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => {
                    setDepartmentFilter(dept)
                    setDepartmentDropdownOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                    departmentFilter === dept && "bg-slate-100"
                  )}
                >
                  <span>{dept}</span>
                  {departmentFilter === dept && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No teachers found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTeachers.map(teacher => (
            <TeacherCard
              key={teacher.teacherId}
              teacher={teacher}
              onView={() => handleView(teacher)}
              onEdit={() => handleEdit(teacher)}
            />
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Managing Teacher Availability</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><strong>View:</strong> See a teacher's current availability settings</li>
              <li><strong>Override:</strong> Modify availability for emergencies (logged for audit)</li>
              <li><strong>Send Reminders:</strong> Notify teachers who haven't submitted availability</li>
            </ul>
            <p className="mt-2 text-blue-600">
              All overrides are logged with reason and timestamp for accountability.
            </p>
          </div>
        </div>
      </div>

      {/* View/Edit Modal */}
      <AvailabilityViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedTeacher(null)
        }}
        teacher={selectedTeacher}
        isEditMode={isEditMode}
        onSave={handleSaveOverride}
      />
    </div>
  )
}
