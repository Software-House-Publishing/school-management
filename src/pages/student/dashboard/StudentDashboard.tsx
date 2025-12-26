import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/authStore"
import { Card } from "@/components/ui/Card"
import { Megaphone, GraduationCap, BookOpen, CalendarDays, QrCode } from "lucide-react"

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

/* ----------------------------- Announcements ----------------------------- */

type AnnouncementPriority = "urgent" | "info"

type Announcement = {
  id: string
  scope: "university" | "course"
  title: string
  body: string
  dateLabel: string
  priority?: AnnouncementPriority
  courseName?: string
}

function Badge({
  tone,
  children,
}: {
  tone: "urgent" | "info" | "neutral"
  children: ReactNode
}) {
  const cls =
    tone === "urgent"
      ? "bg-red-50 text-red-700 border-red-100"
      : tone === "info"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : "bg-gray-50 text-gray-700 border-gray-100"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        cls
      )}
    >
      {children}
    </span>
  )
}

function AnnouncementsPanel({ announcements }: { announcements: Announcement[] }) {
  const [mode, setMode] = useState<"university" | "course">("university")

  const filtered = announcements
    .filter((a) => a.scope === mode)
    .slice(0, 5)

  return (
    <Card className="rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Announcements</h2>
            <p className="text-xs text-gray-500">Latest 3–5 (daily)</p>
          </div>
        </div>

        {/* segmented (University / My Courses) */}
        <div className="inline-flex rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("university")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
              mode === "university"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            University
          </button>

          <button
            type="button"
            onClick={() => setMode("course")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
              mode === "course"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <BookOpen className="h-4 w-4" />
            My Courses
          </button>
        </div>
      </div>

      <div className="px-6">
        <div className="divide-y">
          {filtered.length === 0 ? (
            <div className="py-8 text-sm text-gray-600">No announcements.</div>
          ) : (
            filtered.map((a) => (
              <div key={a.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {a.title}
                      </p>
                      {a.priority === "urgent" ? (
                        <Badge tone="urgent">Urgent</Badge>
                      ) : a.priority === "info" ? (
                        <Badge tone="info">Info</Badge>
                      ) : null}
                      {a.scope === "course" && a.courseName ? (
                        <Badge tone="neutral">{a.courseName}</Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{a.body}</p>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    {a.dateLabel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-gray-600">
        <span>Students check this daily</span>
        <button type="button" className="font-semibold text-blue-700 hover:text-blue-800">
          View all
        </button>
      </div>
    </Card>
  )
}

/* ------------------------------ Today Class UI ------------------------------ */

type TodayClassItem = {
  id: string
  dayShort: string // e.g. "FRI"
  dayLabel: string // e.g. "FRIDAY"
  start: string // "09:00"
  end: string // "12:00"
  courseCode: string // "BG14038"
  section: string // "(561)" or "(SM217)" etc
  title: string
  room: string // "SM217"
  teacher: string
  campusTag?: string // "[SUVARNABHUMI]"
  dateTag?: string // "JANUARY 16, 2026"
  color: "red" | "orange" | "blue" | "green"
}

function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => Number(n))
  return h * 60 + m
}

function colorClasses(color: TodayClassItem["color"]) {
  switch (color) {
    case "red":
      return {
        block: "bg-red-500",
        bar: "bg-red-500",
        text: "text-red-600",
      }
    case "orange":
      return {
        block: "bg-orange-500",
        bar: "bg-orange-500",
        text: "text-orange-600",
      }
    case "blue":
      return {
        block: "bg-blue-500",
        bar: "bg-blue-500",
        text: "text-blue-600",
      }
    default:
      return {
        block: "bg-emerald-600",
        bar: "bg-emerald-600",
        text: "text-emerald-600",
      }
  }
}

function TodayClassCard({
  items,
}: {
  items: TodayClassItem[]
}) {
  // timeline bounds (match screenshot)
  const startMin = 9 * 60
  const endMin = 21 * 60
  const times = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00"]

  const dayShort = items[0]?.dayShort || "TOD"
  const dayLabel = items[0]?.dayLabel || "TODAY"

  return (
    <Card className="rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 ring-1 ring-black/5">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-900">
            TODAY CLASS
          </h2>
        </div>

      </div>

      {/* Timeline */}
      <div className="px-6 pt-4">
        {/* time axis */}
        <div className="grid grid-cols-[72px_1fr] items-center">
          <div />
          <div className="grid grid-cols-9 text-xs text-gray-600">
            {times.map((t) => (
              <div key={t} className="text-center">
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* grid + blocks */}
        <div className="mt-2 grid grid-cols-[72px_1fr]">
          <div className="flex items-center justify-start pr-3 text-sm font-medium text-gray-700">
            {dayShort}
          </div>

          <div className="relative h-16 rounded-xl bg-white">
            {/* vertical grid lines */}
            <div className="absolute inset-0 grid grid-cols-9">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-full border-l",
                    i === 0 ? "border-l-0" : "border-gray-100"
                  )}
                />
              ))}
            </div>

            {/* blocks */}
            {items.map((c) => {
              const s = timeToMinutes(c.start)
              const e = timeToMinutes(c.end)
              const left = ((s - startMin) / (endMin - startMin)) * 100
              const width = ((e - s) / (endMin - startMin)) * 100
              const cc = colorClasses(c.color)

              return (
                <div
                  key={c.id}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 rounded-2xl px-3 py-2 text-center text-white shadow-sm",
                    cc.block
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <div className="text-sm font-bold leading-none">{c.courseCode}</div>
                  <div className="mt-1 text-xs font-semibold opacity-95">({c.room})</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 border-t" />
      </div>

      {/* List */}
      <div className="px-6 pb-4">
        <div className="py-4 text-sm font-medium text-gray-500">{dayLabel}</div>

        <div className="space-y-6 pb-2">
          {items.map((c) => {
            const cc = colorClasses(c.color)
            return (
              <div key={c.id} className="grid grid-cols-[72px_1fr] gap-4">
                {/* time */}
                <div className="pt-1 text-sm text-gray-700">
                  <div className="font-semibold">{c.start}</div>
                  <div className="mt-1 text-gray-500">{c.end}</div>
                </div>

                {/* details */}
                <div className="relative rounded-xl">
                  <div className={cn("absolute left-0 top-1 bottom-1 w-[3px] rounded-full", cc.bar)} />
                  <div className="pl-4">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <div className="text-base font-semibold text-gray-900">{c.courseCode}</div>
                      <div className="text-sm text-gray-500">{c.section}</div>
                    </div>

                    <div className="mt-1 text-sm font-medium uppercase tracking-wide text-gray-700">
                      {c.title}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span className={cn("font-semibold", cc.text)}>{c.room}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-gray-700">{c.teacher}</span>
                    </div>

                    {(c.campusTag || c.dateTag) && (
                      <div className="mt-2 text-xs text-gray-500">
                        {c.campusTag ? <span className="mr-2">{c.campusTag}</span> : null}
                        {c.dateTag ? <span>{c.dateTag}</span> : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------ Virtual ID Card ------------------------------ */

function VirtualIdCard({
  studentName,
  studentId,
  status,
}: {
  studentName: string
  studentId: string
  status: string
}) {
  return (
    <Card className="h-full rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-base font-semibold text-gray-900">Virtual ID Card</h2>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <QrCode className="h-5 w-5" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex h-[128px] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-teal-600 to-emerald-700 shadow-md">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-2 w-2 rounded-sm bg-white/70", i % 6 === 0 && "bg-white")}
                  />
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-500">QR CODE</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">{studentId}</div>
              <div className="mt-1 text-xs text-gray-500">Scan for attendance</div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border bg-white p-4">
          <div className="text-xs font-semibold tracking-wide text-gray-500">STUDENT NAME</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{studentName}</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">ID</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{studentId}</div>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">STATUS</div>
              <div className="mt-1 text-sm font-semibold text-green-700">{status}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Show for Attendance
        </button>
      </div>
    </Card>
  )
}

/* -------------------------------- Dashboard -------------------------------- */

export default function StudentDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const studentName = useMemo(() => {
    const first = user?.firstName?.trim()
    const last = (user as any)?.lastName?.trim?.()
    if (first && last) return `${first} ${last}`
    return first || t("dashboard.student", { defaultValue: "Student" })
  }, [t, user])

  const studentId = (user as any)?.studentId || "STU-2400001"
  const status = "Active"

  const announcements: Announcement[] = [
    {
      id: "a1",
      scope: "university",
      title: "Mid-term Exam Schedule Published",
      body: "Mid-term exams start next Monday. Please check the schedule and be on time.",
      dateLabel: "Today",
      priority: "urgent",
    },
    {
      id: "a2",
      scope: "university",
      title: "Library Hours Extended",
      body: "The library will stay open until 9 PM during exam week.",
      dateLabel: "Yesterday",
      priority: "info",
    },
    {
      id: "a3",
      scope: "course",
      courseName: "JAPANESE I",
      title: "Quiz next class",
      body: "Please review Hiragana (あ–ん).",
      dateLabel: "Today",
      priority: "info",
    },
    {
      id: "a4",
      scope: "course",
      courseName: "ETHICS SEMINAR",
      title: "Reading material uploaded",
      body: "Slides are now available in the portal.",
      dateLabel: "2d ago",
      priority: "info",
    },
  ]

  // Replace "Quick Overview" with the screenshot-style Today Class UI
  const todayClasses: TodayClassItem[] = [
    {
      id: "t1",
      dayShort: "FRI",
      dayLabel: "FRIDAY",
      start: "09:00",
      end: "12:00",
      courseCode: "BG14038",
      section: "(561)",
      title: "PROFESSIONAL ETHICS SEMINAR VIII",
      room: "SM217",
      teacher: "JAMORN KRASANTIPOTORN",
      campusTag: "[SUVARNABHUMI]",
      dateTag: "JANUARY 16, 2026",
      color: "red",
    },
    {
      id: "t2",
      dayShort: "FRI",
      dayLabel: "FRIDAY",
      start: "12:00",
      end: "13:30",
      courseCode: "JA0721",
      section: "(401)",
      title: "JAPANESE FOR BEGINNERS I",
      room: "SM333",
      teacher: "SUPHIN SANRUANG",
      campusTag: "[SUVARNABHUMI]",
      color: "orange",
    },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t("dashboard.welcomeBack", { defaultValue: "Welcome back!" })}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t("dashboard.academicOverview", {
            defaultValue: "Here's your academic overview",
          })}
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left */}
        <div className="xl:col-span-1">
          <VirtualIdCard studentName={studentName} studentId={studentId} status={status} />
        </div>

        {/* Right */}
        <div className="xl:col-span-2 space-y-8">
          {/* QUICK OVERVIEW REMOVED -> replaced with screenshot timetable UI */}
          <TodayClassCard items={todayClasses} />

          {/* Announcements (no "Today Classes" tab anymore) */}
          <AnnouncementsPanel announcements={announcements} />
        </div>
      </div>
    </div>
  )
}
