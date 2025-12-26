"use client"

import { useMemo, useState } from "react"

type DayKey = "ALL" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT"

type ClassItem = {
  id: string
  day: Exclude<DayKey, "ALL">
  start: string // "HH:MM"
  end: string // "HH:MM"
  code: string
  title: string
  room: string
  instructor: string
  note?: string
  color: {
    bg: string
    text: string
    border: string
  }
}

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function formatRange(start: string, end: string) {
  return `${start}–${end}`
}

const DAYS: Array<{ key: DayKey; label: string }> = [
  { key: "ALL", label: "ALL" },
  { key: "SUN", label: "S" },
  { key: "MON", label: "M" },
  { key: "TUE", label: "T" },
  { key: "WED", label: "W" },
  { key: "THU", label: "T" },
  { key: "FRI", label: "F" },
  { key: "SAT", label: "S" },
]

const DAY_LABEL: Record<Exclude<DayKey, "ALL">, string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
}

// 09:00 → 21:00, labels every 90 mins like the screenshot
const MIN_TIME = "09:00"
const MAX_TIME = "21:00"
const TIME_LABELS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00"]

export default function StudentSchedule() {
  const [activeDay, setActiveDay] = useState<DayKey>("ALL")

  // Different course titles (not the same as your screenshot)
  const classes: ClassItem[] = useMemo(
    () => [
      {
        id: "c1",
        day: "TUE",
        start: "12:00",
        end: "13:30",
        code: "CS2101",
        title: "DATA STRUCTURES & ALGORITHMS",
        room: "R-214",
        instructor: "Dr. Mei Lin",
        note: "[MAIN CAMPUS] Lab starts Week 2",
        color: { bg: "bg-sky-500", text: "text-white", border: "border-sky-500" },
      },
      {
        id: "c2",
        day: "TUE",
        start: "13:30",
        end: "15:00",
        code: "UX1203",
        title: "HUMAN-COMPUTER INTERACTION",
        room: "CL-302",
        instructor: "A. Fernandez",
        note: "[MAIN CAMPUS] Project-based",
        color: { bg: "bg-slate-500", text: "text-white", border: "border-slate-500" },
      },
      {
        id: "c3",
        day: "TUE",
        start: "15:00",
        end: "16:30",
        code: "EN1502",
        title: "ACADEMIC WRITING & PRESENTATION",
        room: "SG-118",
        instructor: "K. Somchai",
        note: "[MAIN CAMPUS] No final exam",
        color: { bg: "bg-emerald-500", text: "text-white", border: "border-emerald-500" },
      },

      {
        id: "c4",
        day: "WED",
        start: "09:00",
        end: "12:00",
        code: "SE2409",
        title: "MOBILE APP DEVELOPMENT",
        room: "LAB-5",
        instructor: "S. Patel",
        note: "[MAIN CAMPUS] Bring laptop",
        color: { bg: "bg-amber-400", text: "text-slate-900", border: "border-amber-400" },
      },
      {
        id: "c5",
        day: "WED",
        start: "12:00",
        end: "13:30",
        code: "JP1101",
        title: "JAPANESE COMMUNICATION I",
        room: "SM-333",
        instructor: "Y. Tanaka",
        color: { bg: "bg-orange-500", text: "text-white", border: "border-orange-500" },
      },
      {
        id: "c6",
        day: "WED",
        start: "13:30",
        end: "16:30",
        code: "CY3005",
        title: "NETWORK SECURITY FUNDAMENTALS",
        room: "VM-120",
        instructor: "P. Araya",
        note: "[MAIN CAMPUS] Quiz every 2 weeks",
        color: { bg: "bg-violet-600", text: "text-white", border: "border-violet-600" },
      },

      {
        id: "c7",
        day: "THU",
        start: "12:00",
        end: "13:30",
        code: "CS2101",
        title: "DATA STRUCTURES & ALGORITHMS",
        room: "R-214",
        instructor: "Dr. Mei Lin",
        note: "[MAIN CAMPUS] Tutorial",
        color: { bg: "bg-sky-500", text: "text-white", border: "border-sky-500" },
      },
      {
        id: "c8",
        day: "THU",
        start: "13:30",
        end: "15:00",
        code: "UX1203",
        title: "HUMAN-COMPUTER INTERACTION",
        room: "CL-302",
        instructor: "A. Fernandez",
        color: { bg: "bg-slate-500", text: "text-white", border: "border-slate-500" },
      },
      {
        id: "c9",
        day: "THU",
        start: "15:00",
        end: "16:30",
        code: "EN1502",
        title: "ACADEMIC WRITING & PRESENTATION",
        room: "SG-118",
        instructor: "K. Somchai",
        note: "[MAIN CAMPUS] Workshop",
        color: { bg: "bg-emerald-500", text: "text-white", border: "border-emerald-500" },
      },

      {
        id: "c10",
        day: "FRI",
        start: "09:00",
        end: "12:00",
        code: "PH2208",
        title: "PROFESSIONAL PRACTICE & ETHICS",
        room: "SM-217",
        instructor: "J. Kittisak",
        note: "[MAIN CAMPUS] Guest lecture (Week 6)",
        color: { bg: "bg-rose-600", text: "text-white", border: "border-rose-600" },
      },
      {
        id: "c11",
        day: "FRI",
        start: "12:00",
        end: "13:30",
        code: "JP1101",
        title: "JAPANESE COMMUNICATION I",
        room: "SM-333",
        instructor: "Y. Tanaka",
        color: { bg: "bg-orange-500", text: "text-white", border: "border-orange-500" },
      },
    ],
    []
  )

  const minM = toMinutes(MIN_TIME)
  const maxM = toMinutes(MAX_TIME)
  const total = maxM - minM

  const filteredForGrid = useMemo(() => {
    if (activeDay === "ALL") return classes
    return classes.filter((c) => c.day === activeDay)
  }, [activeDay, classes])

  const rightPanelDays = useMemo(() => {
    // If ALL: show only days that have classes (like your screenshot’s right panel)
    const keys: Exclude<DayKey, "ALL">[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    if (activeDay !== "ALL") return [activeDay]
    return keys.filter((d) => classes.some((c) => c.day === d))
  }, [activeDay, classes])

  const classesByDay = useMemo(() => {
    const map = new Map<Exclude<DayKey, "ALL">, ClassItem[]>()
    for (const c of classes) {
      map.set(c.day, [...(map.get(c.day) ?? []), c])
    }
    for (const [k, arr] of map) {
      arr.sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
      map.set(k, arr)
    }
    return map
  }, [classes])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Schedule</h1>
          <p className="mt-2 text-sm text-gray-600">Weekly timetable + day details.</p>
        </div>
      </div>

      {/* Top day filter (red segmented control) */}
      <div className="rounded-xl border border-rose-300 bg-white p-2">
        <div className="grid grid-cols-8 overflow-hidden rounded-lg border border-rose-300">
          {DAYS.map((d, idx) => {
            const active = activeDay === d.key
            return (
              <button
                key={d.key}
                onClick={() => setActiveDay(d.key)}
                className={cn(
                  "h-10 text-sm font-semibold transition",
                  idx !== 0 && "border-l border-rose-300",
                  active ? "bg-rose-700 text-white" : "bg-white text-rose-700 hover:bg-rose-50"
                )}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">

        {/* LEFT: Weekly grid */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          {/* Time header */}
          <div className="grid grid-cols-[88px_1fr] border-b border-gray-200">
            <div className="p-3 text-xs font-semibold text-gray-500"> </div>
            <div className="relative">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${TIME_LABELS.length}, minmax(0, 1fr))` }}>
                {TIME_LABELS.map((t) => (
                  <div key={t} className="px-2 py-3 text-center text-xs font-semibold text-gray-600">
                    {t}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 pointer-events-none grid" style={{ gridTemplateColumns: `repeat(${TIME_LABELS.length}, minmax(0, 1fr))` }}>
                {TIME_LABELS.map((t) => (
                  <div key={t} className="border-l border-gray-100" />
                ))}
              </div>
            </div>
          </div>

          {/* Day rows */}
          <div className="divide-y divide-gray-100">
            {(Object.keys(DAY_LABEL) as Array<Exclude<DayKey, "ALL">>).map((day) => {
              // In day-filter mode, still show all rows (like screenshot), but only render events for the filtered day
              const dayEvents = filteredForGrid.filter((c) => c.day === day)

              return (
                <div key={day} className="grid grid-cols-[88px_1fr]">
                  <div className="flex items-center justify-center p-3 text-xs font-semibold text-gray-600">
                    {day}
                  </div>

                  <div className="relative h-[72px] bg-white">
                    {/* vertical grid lines */}
                    <div
                      className="absolute inset-0 pointer-events-none grid"
                      style={{ gridTemplateColumns: `repeat(${TIME_LABELS.length}, minmax(0, 1fr))` }}
                    >
                      {TIME_LABELS.map((t, i) => (
                        <div key={t + i} className="border-l border-gray-100" />
                      ))}
                    </div>

                    {/* events */}
                    {dayEvents.map((ev) => {
                      const s = toMinutes(ev.start)
                      const e = toMinutes(ev.end)
                      const leftPct = ((s - minM) / total) * 100
                      const widthPct = ((e - s) / total) * 100

                      return (
                        <div
                          key={ev.id}
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 shadow-sm",
                            ev.color.bg,
                            ev.color.text
                          )}
                          style={{
                            left: `${leftPct}%`,
                            width: `${Math.max(widthPct, 6)}%`,
                          }}
                          title={`${ev.code} • ${ev.title} • ${formatRange(ev.start, ev.end)}`}
                        >
                          <div className="text-xs font-bold leading-none">{ev.code}</div>
                          <div className="text-[11px] font-semibold opacity-90 leading-tight line-clamp-1">
                            {ev.room}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Day details list */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col" style={{ height: 'calc(42px + 7 * 72px)' }}>
          <div className="space-y-6 overflow-y-auto flex-1">
            {rightPanelDays.map((d) => {
              const items = (classesByDay.get(d as Exclude<DayKey, "ALL">) ?? []).slice()
              if (activeDay !== "ALL") {
                // already a single day, no need to filter further
              }
              return (
                <div key={d} className="space-y-3">
                  <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">{DAY_LABEL[d as Exclude<DayKey, "ALL">]}</div>

                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                      No classes.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((ev) => (
                        <div key={ev.id} className="flex gap-4">
                          {/* time column */}
                          <div className="w-14 shrink-0 text-right">
                            <div className="text-sm font-bold text-gray-900">{ev.start}</div>
                            <div className="text-sm font-bold text-gray-400">{ev.end}</div>
                          </div>

                          {/* content */}
                          <div className={cn("flex-1 border-l-2 pl-4", ev.color.border)}>
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <div className="font-bold text-gray-900">{ev.code}</div>
                              <div className="text-gray-400 font-semibold">({ev.room})</div>
                            </div>

                            <div className="mt-1 text-sm font-semibold text-gray-800">{ev.title}</div>

                            <div className="mt-1 text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">{ev.room}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-gray-600">{ev.instructor}</span>
                            </div>

                            {ev.note ? (
                              <div className="mt-2 text-xs text-gray-500">{ev.note}</div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
