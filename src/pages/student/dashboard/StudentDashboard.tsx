import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/authStore"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/shared/PageHeader"
import { IdentityCard } from "@/components/shared/dashboard/IdentityCard"
import { AnnouncementPanel, AnnouncementItem } from "@/components/shared/dashboard/AnnouncementPanel"
import { GraduationCap, BookOpen, CalendarDays } from "lucide-react"

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
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

  const announcements: AnnouncementItem[] = [
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
      <PageHeader
        title={t("dashboard.welcomeBack", { defaultValue: "Welcome back!" })}
        subtitle={t("dashboard.academicOverview", {
          defaultValue: "Here's your academic overview",
        })}
        className="mb-8"
      />

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left - ID Card */}
        <div className="xl:col-span-1">
          <IdentityCard
            type="student"
            name={studentName}
            id={studentId}
            status={status}
            actionLabel="Show for Attendance"
            onAction={() => {}}
          />
        </div>

        {/* Right - Main content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Today's schedule */}
          <TodayClassCard items={todayClasses} />

          {/* Announcements with tabs */}
          <AnnouncementPanel
            items={announcements}
            tabs={[
              { id: "university", label: "University", icon: GraduationCap },
              { id: "course", label: "My Courses", icon: BookOpen },
            ]}
            filterFn={(item, tab) => item.scope === tab}
            maxItems={5}
            onViewAll={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
