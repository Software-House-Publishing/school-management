"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, List, Dot, Sun, ChevronDown } from "lucide-react"

const YEARS = [2024, 2025, 2026, 2027]

type ViewKey = "today" | "month" | "agenda"

const VIEW_TABS: Array<{ key: ViewKey; label: string; icon: ReactNode }> = [
  { key: "today", label: "Today", icon: <Sun className="h-4 w-4" /> },
  { key: "month", label: "Month", icon: <CalendarDays className="h-4 w-4" /> },
  { key: "agenda", label: "Agenda", icon: <List className="h-4 w-4" /> },
]

type EventType = "holiday" | "academic" | "exam" | "deadline"

type CalendarEvent = {
  id: string
  title: string
  date: string // YYYY-MM-DD (all-day)
  type: EventType
  source?: "public" | "school"
}

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1)
}
function startOfWeekSunday(d: Date) {
  const x = new Date(d)
  const day = x.getDay() // 0=Sun
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, days: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}
function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" })
}

function typeBadge(type: EventType) {
  switch (type) {
    case "holiday":
      return { pill: "bg-rose-100 text-rose-800 border-rose-200", dot: "text-rose-500" }
    case "exam":
      return { pill: "bg-amber-100 text-amber-800 border-amber-200", dot: "text-amber-500" }
    case "deadline":
      return { pill: "bg-purple-100 text-purple-800 border-purple-200", dot: "text-purple-500" }
    case "academic":
    default:
      return { pill: "bg-sky-100 text-sky-800 border-sky-200", dot: "text-sky-500" }
  }
}

const SEED_EVENTS: CalendarEvent[] = [
  // Public holidays (sample)
  { id: "h-2025-12-05", title: "National Holiday (No classes)", date: "2025-12-05", type: "holiday", source: "public" },
  { id: "h-2025-12-10", title: "Thai Constitution Day (No classes)", date: "2025-12-10", type: "holiday", source: "public" },
  { id: "h-2025-12-25", title: "Christmas Day (No classes)", date: "2025-12-25", type: "holiday", source: "public" },
  { id: "h-2025-12-26", title: "Boxing Day", date: "2025-12-26", type: "holiday", source: "public" },
  { id: "h-2025-12-31", title: "New Year's Eve (No classes)", date: "2025-12-31", type: "holiday", source: "public" },
  { id: "h-2026-01-01", title: "New Year's Day (No classes)", date: "2026-01-01", type: "holiday", source: "public" },
  { id: "h-2026-03-03", title: "Makha Bucha Day (No classes)", date: "2026-03-03", type: "holiday", source: "public" },

  // Academic / school dates (sample)
  { id: "a-2025-11-03", title: "Classes begin", date: "2025-11-03", type: "academic", source: "school" },
  { id: "a-2025-12-08", title: "Mid-term papers due", date: "2025-12-08", type: "deadline", source: "school" },
  { id: "a-2025-12-26", title: "Project Submission", date: "2025-12-26", type: "deadline", source: "school" },
  { id: "a-2026-01-05", title: "Mid-term Examination (starts)", date: "2026-01-05", type: "exam", source: "school" },
  { id: "a-2026-01-13", title: "International Admission begins", date: "2026-01-13", type: "academic", source: "school" },
  { id: "a-2026-02-02", title: "Final papers submission", date: "2026-02-02", type: "deadline", source: "school" },
  { id: "a-2026-03-02", title: "Final Examination (starts)", date: "2026-03-02", type: "exam", source: "school" },
  { id: "a-2026-03-31", title: "Semester ends", date: "2026-03-31", type: "academic", source: "school" },
]

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function StudentCalendar() {
  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const [activeMonth, setActiveMonth] = useState<Date>(() => startOfMonth(today))
  const [selectedDay, setSelectedDay] = useState<Date>(() => today)
  const [view, setView] = useState<ViewKey>("month")
  const [showPublic, setShowPublic] = useState(true)
  const [showSchool, setShowSchool] = useState(true)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of SEED_EVENTS) {
      if (e.source === "public" && !showPublic) continue
      if (e.source === "school" && !showSchool) continue
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    }
    // sort inside each day (holiday first, then exam, then deadline, then academic)
    const rank: Record<EventType, number> = { holiday: 0, exam: 1, deadline: 2, academic: 3 }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => rank[a.type] - rank[b.type])
      map.set(k, arr)
    }
    return map
  }, [showPublic, showSchool])

  const gridDays = useMemo(() => {
    const first = startOfMonth(activeMonth)
    const gridStart = startOfWeekSunday(first)
    // 6 weeks (Google-like)
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  }, [activeMonth])

  const selectedISO = toISODate(selectedDay)
  const selectedEvents = eventsByDate.get(selectedISO) ?? []

  const todayISO = toISODate(today)
  const todayEvents = eventsByDate.get(todayISO) ?? []

  const monthEvents = useMemo(() => {
    // for agenda: show events in current month
    const m = activeMonth.getMonth()
    const y = activeMonth.getFullYear()
    const list: Array<{ date: Date; events: CalendarEvent[] }> = []
    for (const d of gridDays) {
      if (d.getMonth() !== m || d.getFullYear() !== y) continue
      const iso = toISODate(d)
      const ev = eventsByDate.get(iso)
      if (ev && ev.length) list.push({ date: d, events: ev })
    }
    return list
  }, [activeMonth, gridDays, eventsByDate])

  // When switching to "today" view, also select today
  function handleViewChange(v: ViewKey) {
    setView(v)
    if (v === "today") {
      setSelectedDay(today)
      setActiveMonth(startOfMonth(today))
    }
  }

  return (
    <div className="w-full">
      {/* Header + Tab Selector on same line */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-600">View holidays and academic dates</p>
        </div>

        {/* Tab Selector - Pill style with icons */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {VIEW_TABS.map((tab) => {
            const active = tab.key === view
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleViewChange(tab.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Controls Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMonth((m) => addMonths(m, -1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-[140px] text-center">
              <div className="text-base font-semibold text-slate-900">
                {activeMonth.toLocaleString(undefined, { month: "long" })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMonth((m) => addMonths(m, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {activeMonth.getFullYear()}
                <ChevronDown className="h-4 w-4" />
              </button>

              {yearDropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-[100px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setActiveMonth(new Date(year, activeMonth.getMonth(), 1))
                        setYearDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition",
                        year === activeMonth.getFullYear()
                          ? "bg-blue-50 font-semibold text-blue-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPublic((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                showPublic ? "bg-white text-slate-700 border-slate-200" : "bg-slate-100 text-slate-400 border-slate-200"
              )}
            >
              <Dot className={cn("h-5 w-5", typeBadge("holiday").dot)} />
              Holidays
            </button>

            <button
              type="button"
              onClick={() => setShowSchool((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                showSchool ? "bg-white text-slate-700 border-slate-200" : "bg-slate-100 text-slate-400 border-slate-200"
              )}
            >
              <Dot className={cn("h-5 w-5", typeBadge("academic").dot)} />
              Academic
            </button>
          </div>
        </div>

        {/* View Content */}
        {view === "today" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-lg font-semibold text-slate-900">
                {today.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div className="mt-1 text-sm text-slate-500">Today's events and reminders</div>
            </div>

            {todayEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">No events scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.map((e) => {
                  const b = typeBadge(e.type)
                  return (
                    <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">{e.title}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {e.source === "public" ? "Public holiday" : "School calendar"}
                          </div>
                        </div>
                        <span className={cn("shrink-0 rounded-full border px-2 py-1 text-xs font-medium", b.pill)}>
                          {e.type}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {view === "month" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
            {/* Month Grid */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {/* DOW header */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {DOW.map((d) => (
                  <div key={d} className="px-3 py-2 text-xs font-semibold text-slate-600">
                    {d}
                  </div>
                ))}
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-7">
                {gridDays.map((d) => {
                  const inMonth = d.getMonth() === activeMonth.getMonth()
                  const iso = toISODate(d)
                  const ev = eventsByDate.get(iso) ?? []
                  const isToday = sameDay(d, today)
                  const isSelected = sameDay(d, selectedDay)

                  // show up to 2 chips, then "+n more"
                  const visible = ev.slice(0, 2)
                  const overflow = ev.length - visible.length

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={cn(
                        "min-h-[100px] border-b border-r border-slate-200 p-2 text-left align-top transition",
                        "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300",
                        !inMonth && "bg-slate-50/60 text-slate-400",
                        isSelected && "bg-blue-50/50 ring-2 ring-inset ring-blue-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                            isToday && "bg-blue-600 text-white",
                            !isToday && inMonth && "text-slate-900",
                            !inMonth && "text-slate-400"
                          )}
                        >
                          {d.getDate()}
                        </div>

                        {ev.length > 0 ? (
                          <div className="flex items-center gap-0.5">
                            {ev.slice(0, 3).map((x) => (
                              <span key={x.id} className={cn("text-xs", typeBadge(x.type).dot)}>
                                ●
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-2 space-y-1">
                        {visible.map((x) => {
                          const b = typeBadge(x.type)
                          return (
                            <div
                              key={x.id}
                              className={cn(
                                "w-full truncate rounded-md border px-2 py-1 text-[11px] font-medium",
                                b.pill
                              )}
                              title={x.title}
                            >
                              {x.title}
                            </div>
                          )
                        })}

                        {overflow > 0 ? (
                          <div className="text-[11px] font-medium text-slate-500">+{overflow} more</div>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right panel: Day details */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                  {selectedDay.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Holiday
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Exam
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-purple-500" /> Deadline
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-sky-500" /> Academic
                  </span>
                </div>
              </div>

              <div className="p-4">
                {selectedEvents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    No events on this day.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEvents.map((e) => {
                      const b = typeBadge(e.type)
                      return (
                        <div key={e.id} className="rounded-xl border border-slate-200 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900">{e.title}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                {e.source === "public" ? "Public holiday" : "School calendar"}
                              </div>
                            </div>
                            <span className={cn("shrink-0 rounded-full border px-2 py-1 text-xs font-medium", b.pill)}>
                              {e.type}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "agenda" && (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">Agenda for {monthLabel(activeMonth)}</div>
              <div className="text-xs text-slate-500">All events in this month</div>
            </div>

            <div className="divide-y divide-slate-200">
              {monthEvents.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No events for this month.</div>
              ) : (
                monthEvents.map(({ date, events }) => (
                  <button
                    key={toISODate(date)}
                    type="button"
                    onClick={() => {
                      setSelectedDay(date)
                      setView("month")
                    }}
                    className="w-full p-4 text-left hover:bg-slate-50 transition"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-semibold text-slate-900">
                        {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                      <div className="text-xs text-slate-500">{events.length} event{events.length > 1 ? "s" : ""}</div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {events.map((e) => {
                        const b = typeBadge(e.type)
                        return (
                          <span key={e.id} className={cn("rounded-full border px-2 py-1 text-xs font-medium", b.pill)}>
                            {e.title}
                          </span>
                        )
                      })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
