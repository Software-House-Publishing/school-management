"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Save,
  RotateCcw,
  Copy,
  Calendar,
  Clock,
  Info,
  ChevronDown,
  Check,
  AlertCircle,
  CalendarPlus,
  X,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import {
  AvailabilitySlot,
  AvailabilityStatus,
  AvailabilityException,
  TeacherPreferences,
  DAYS_OF_WEEK,
  AVAILABILITY_STATUS_CONFIG,
  DayOfWeek,
} from "@/types/timetable"

// -------------------- TYPES --------------------

interface TimeSlotCell {
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  status: AvailabilityStatus
}

// -------------------- CONSTANTS --------------------

const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "08:00" },
  { start: "09:00", end: "10:00", label: "09:00" },
  { start: "10:00", end: "11:00", label: "10:00" },
  { start: "11:00", end: "12:00", label: "11:00" },
  { start: "12:00", end: "13:00", label: "12:00" },
  { start: "13:00", end: "14:00", label: "13:00" },
  { start: "14:00", end: "15:00", label: "14:00" },
  { start: "15:00", end: "16:00", label: "15:00" },
  { start: "16:00", end: "17:00", label: "16:00" },
]

const WORKING_DAYS = DAYS_OF_WEEK.filter(d =>
  ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(d.key)
)

// -------------------- UTILITY FUNCTIONS --------------------

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function generateInitialSlots(): TimeSlotCell[] {
  const slots: TimeSlotCell[] = []
  WORKING_DAYS.forEach(day => {
    TIME_SLOTS.forEach(time => {
      slots.push({
        dayOfWeek: day.key,
        startTime: time.start,
        endTime: time.end,
        status: "available",
      })
    })
  })
  return slots
}

// -------------------- COMPONENTS --------------------

function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
        <div key={key} className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded border", config.bgColor)} />
          <span className="text-slate-600">{config.label}</span>
        </div>
      ))}
    </div>
  )
}

function PreferencesPanel({
  preferences,
  onChange,
}: {
  preferences: TeacherPreferences
  onChange: (prefs: TeacherPreferences) => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Teaching Preferences
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Max Periods Per Day
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={preferences.maxPeriodsPerDay || 6}
            onChange={(e) => onChange({ ...preferences, maxPeriodsPerDay: parseInt(e.target.value) || 6 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Max Periods Per Week
          </label>
          <input
            type="number"
            min={1}
            max={40}
            value={preferences.maxPeriodsPerWeek || 25}
            onChange={(e) => onChange({ ...preferences, maxPeriodsPerWeek: parseInt(e.target.value) || 25 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Preferred Break Duration (min)
          </label>
          <input
            type="number"
            min={5}
            max={60}
            value={preferences.preferredBreakDuration || 15}
            onChange={(e) => onChange({ ...preferences, preferredBreakDuration: parseInt(e.target.value) || 15 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="preferConsecutive"
            checked={preferences.preferConsecutiveClasses || false}
            onChange={(e) => onChange({ ...preferences, preferConsecutiveClasses: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="preferConsecutive" className="text-sm text-slate-700">
            Prefer consecutive classes
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="avoidFirst"
            checked={preferences.avoidFirstPeriod || false}
            onChange={(e) => onChange({ ...preferences, avoidFirstPeriod: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="avoidFirst" className="text-sm text-slate-700">
            Avoid first period
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="avoidLast"
            checked={preferences.avoidLastPeriod || false}
            onChange={(e) => onChange({ ...preferences, avoidLastPeriod: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="avoidLast" className="text-sm text-slate-700">
            Avoid last period
          </label>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Additional Notes
        </label>
        <textarea
          value={preferences.notes || ""}
          onChange={(e) => onChange({ ...preferences, notes: e.target.value })}
          rows={2}
          placeholder="Any additional preferences or constraints..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

function ExceptionModal({
  isOpen,
  onClose,
  onSave,
  exception,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (exception: Omit<AvailabilityException, "id" | "createdAt" | "createdBy" | "teacherId">) => void
  exception?: AvailabilityException | null
}) {
  const [date, setDate] = useState(exception?.date || "")
  const [startTime, setStartTime] = useState(exception?.slots[0]?.startTime || "08:00")
  const [endTime, setEndTime] = useState(exception?.slots[0]?.endTime || "17:00")
  const [status, setStatus] = useState<AvailabilityStatus>(exception?.slots[0]?.status || "unavailable")
  const [reason, setReason] = useState(exception?.reason || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast.error("Please select a date")
      return
    }
    onSave({
      date,
      slots: [{ startTime, endTime, status }],
      reason,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {exception ? "Edit Exception" : "Add Exception"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g., Doctor's appointment, Conference..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
              {exception ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------- MAIN COMPONENT --------------------

export default function TeacherAvailability() {
  // State
  const [slots, setSlots] = useState<TimeSlotCell[]>(generateInitialSlots)
  const [preferences, setPreferences] = useState<TeacherPreferences>({
    maxPeriodsPerDay: 6,
    maxPeriodsPerWeek: 25,
    preferredBreakDuration: 15,
    preferConsecutiveClasses: true,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
  })
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([])
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>("available")
  const [isDragging, setIsDragging] = useState(false)
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  // Get slot by day and time
  const getSlot = useCallback((day: DayOfWeek, startTime: string): TimeSlotCell | undefined => {
    return slots.find(s => s.dayOfWeek === day && s.startTime === startTime)
  }, [slots])

  // Update slot status
  const updateSlot = useCallback((day: DayOfWeek, startTime: string, status: AvailabilityStatus) => {
    setSlots(prev => prev.map(slot =>
      slot.dayOfWeek === day && slot.startTime === startTime
        ? { ...slot, status }
        : slot
    ))
    setHasUnsavedChanges(true)
  }, [])

  // Handle cell click/drag
  const handleCellInteraction = useCallback((day: DayOfWeek, startTime: string) => {
    updateSlot(day, startTime, selectedStatus)
  }, [selectedStatus, updateSlot])

  // Copy pattern from one day to all days
  const copyDayPattern = useCallback((sourceDay: DayOfWeek) => {
    const sourceSlots = slots.filter(s => s.dayOfWeek === sourceDay)
    setSlots(prev => prev.map(slot => {
      if (slot.dayOfWeek === sourceDay) return slot
      const sourceSlot = sourceSlots.find(s => s.startTime === slot.startTime)
      return sourceSlot ? { ...slot, status: sourceSlot.status } : slot
    }))
    setHasUnsavedChanges(true)
    toast.success(`Copied ${DAYS_OF_WEEK.find(d => d.key === sourceDay)?.label} pattern to all days`)
  }, [slots])

  // Reset all slots
  const resetAll = useCallback(() => {
    setSlots(generateInitialSlots())
    setHasUnsavedChanges(true)
    toast.success("Reset all slots to available")
  }, [])

  // Save availability
  const handleSave = useCallback(() => {
    // In real app, this would call an API
    console.log("Saving availability:", { slots, preferences, exceptions })
    setHasUnsavedChanges(false)
    toast.success("Availability saved successfully!")
  }, [slots, preferences, exceptions])

  // Add exception
  const handleAddException = useCallback((exceptionData: Omit<AvailabilityException, "id" | "createdAt" | "createdBy" | "teacherId">) => {
    const newException: AvailabilityException = {
      id: `exc-${Date.now()}`,
      teacherId: "current-teacher",
      ...exceptionData,
      createdAt: new Date().toISOString(),
      createdBy: "current-teacher",
    }
    setExceptions(prev => [...prev, newException])
    setHasUnsavedChanges(true)
    toast.success("Exception added")
  }, [])

  // Delete exception
  const deleteException = useCallback((id: string) => {
    setExceptions(prev => prev.filter(e => e.id !== id))
    setHasUnsavedChanges(true)
    toast.success("Exception removed")
  }, [])

  // Stats
  const stats = useMemo(() => {
    const available = slots.filter(s => s.status === "available").length
    const preferred = slots.filter(s => s.status === "preferred").length
    const unavailable = slots.filter(s => s.status === "unavailable").length
    const avoid = slots.filter(s => s.status === "avoid").length
    return { available, preferred, unavailable, avoid, total: slots.length }
  }, [slots])

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Availability</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set your weekly availability for class scheduling
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Availability
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="text-2xl font-bold text-green-700">{stats.available}</div>
          <div className="text-sm text-green-600">Available Slots</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="text-2xl font-bold text-blue-700">{stats.preferred}</div>
          <div className="text-sm text-blue-600">Preferred Slots</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-2xl font-bold text-amber-700">{stats.avoid}</div>
          <div className="text-sm text-amber-600">Avoid if Possible</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="text-2xl font-bold text-red-700">{stats.unavailable}</div>
          <div className="text-sm text-red-600">Unavailable Slots</div>
        </div>
      </div>

      {/* Legend and Status Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <StatusLegend />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Paint with:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                  AVAILABILITY_STATUS_CONFIG[selectedStatus].bgColor
                )}
              >
                {AVAILABILITY_STATUS_CONFIG[selectedStatus].label}
                <ChevronDown className="h-4 w-4" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {Object.entries(AVAILABILITY_STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(key as AvailabilityStatus)
                        setStatusDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition hover:bg-slate-50",
                        selectedStatus === key && "bg-slate-100"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded border", config.bgColor)} />
                      {config.label}
                      {selectedStatus === key && <Check className="h-4 w-4 ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          <Info className="h-3 w-3" />
          Click or drag on cells to set availability. Click a day header to copy that day's pattern to all days.
        </p>
      </div>

      {/* Weekly Grid */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-20">
                  Time
                </th>
                {WORKING_DAYS.map(day => (
                  <th key={day.key} className="px-2 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => copyDayPattern(day.key)}
                      className="group flex flex-col items-center gap-1 w-full hover:bg-slate-100 rounded-lg p-1 transition"
                      title={`Copy ${day.label} to all days`}
                    >
                      <span className="text-sm font-semibold text-slate-900">{day.label}</span>
                      <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy
                      </span>
                    </button>
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
                          onMouseDown={() => {
                            setIsDragging(true)
                            handleCellInteraction(day.key, time.start)
                          }}
                          onMouseEnter={() => {
                            if (isDragging) {
                              handleCellInteraction(day.key, time.start)
                            }
                          }}
                          onMouseUp={() => setIsDragging(false)}
                          className={cn(
                            "w-full h-12 rounded-lg border-2 transition-all duration-150",
                            "hover:ring-2 hover:ring-offset-1 hover:ring-slate-300",
                            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
                            config.bgColor
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
      </div>

      {/* Preferences */}
      <PreferencesPanel preferences={preferences} onChange={setPreferences} />

      {/* Exceptions Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Exceptions
          </h3>
          <button
            type="button"
            onClick={() => setIsExceptionModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <CalendarPlus className="h-4 w-4" />
            Add Exception
          </button>
        </div>

        {exceptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No date exceptions added</p>
            <p className="text-xs text-slate-400 mt-1">
              Add exceptions for specific dates when your regular availability changes
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {exceptions.map(exception => {
              const config = AVAILABILITY_STATUS_CONFIG[exception.slots[0]?.status || "unavailable"]
              return (
                <div
                  key={exception.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", config.bgColor.replace("bg-", "bg-").split(" ")[0])} />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(exception.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-slate-500">
                        {exception.slots[0]?.startTime} - {exception.slots[0]?.endTime} • {config.label}
                        {exception.reason && ` • ${exception.reason}`}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteException(exception.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How availability works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><strong>Available:</strong> You can be scheduled for classes during these times</li>
              <li><strong>Preferred:</strong> Your ideal teaching times - scheduler will prioritize these</li>
              <li><strong>Avoid if possible:</strong> Can be scheduled if necessary, but not preferred</li>
              <li><strong>Unavailable:</strong> Cannot be scheduled under any circumstances</li>
            </ul>
            <p className="mt-2 text-blue-600">
              Date exceptions override your regular weekly pattern for specific dates.
            </p>
          </div>
        </div>
      </div>

      {/* Exception Modal */}
      <ExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        onSave={handleAddException}
      />

      {/* Mouse up listener for drag */}
      {isDragging && (
        <div
          className="fixed inset-0 z-40"
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />
      )}
    </div>
  )
}
