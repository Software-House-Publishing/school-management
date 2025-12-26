"use client"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/authStore"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  Search,
  UserPlus,
  Users,
  Megaphone,
  Receipt,
  FileText,
  CalendarDays,
  AlertTriangle,
  Clock,
  FileCheck2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  UserRoundCheck,
  UserRound,
} from "lucide-react"

type AlertTone = "red" | "amber" | "orange" | "blue"
type AlertItem = {
  id: string
  tone: AlertTone
  title: string
  subtitle: string
  actionLabel: string
}

type ApprovalItem = {
  id: string
  icon: "user" | "calendar" | "file"
  title: string
  subtitle: string
  leftTone: "blue" | "gray" | "green"
  denyLabel: string
  approveLabel: string
}

type FeeFollowup = {
  id: string
  name: string
  subtitle: string
  tone: "red" | "orange"
  actionLabel: string
}

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

function toneBg(tone: AlertTone) {
  switch (tone) {
    case "red":
      return "bg-rose-50"
    case "amber":
      return "bg-amber-50"
    case "orange":
      return "bg-orange-50"
    case "blue":
      return "bg-blue-50"
  }
}

function toneIconColor(tone: AlertTone) {
  switch (tone) {
    case "red":
      return "text-rose-600"
    case "amber":
      return "text-amber-600"
    case "orange":
      return "text-orange-600"
    case "blue":
      return "text-blue-600"
  }
}

function leftAccent(accent: "green" | "blue" | "gray") {
  switch (accent) {
    case "green":
      return "border-l-4 border-emerald-600"
    case "blue":
      return "border-l-4 border-blue-600"
    case "gray":
      return "border-l-4 border-slate-200"
  }
}

function ApprovalIcon({ kind }: { kind: ApprovalItem["icon"] }) {
  const base = "h-4 w-4"
  if (kind === "user") return <Users className={base} />
  if (kind === "calendar") return <CalendarDays className={base} />
  return <FileCheck2 className={base} />
}

function approvalToneClasses(tone: ApprovalItem["leftTone"]) {
  switch (tone) {
    case "blue":
      return "bg-blue-50 text-blue-700"
    case "gray":
      return "bg-slate-50 text-slate-600"
    case "green":
      return "bg-emerald-50 text-emerald-700"
  }
}

function kpiTrendChip(tone: "up" | "down" | "neutral") {
  switch (tone) {
    case "up":
      return "bg-emerald-100 text-emerald-800"
    case "down":
      return "bg-rose-100 text-rose-800"
    case "neutral":
      return "bg-slate-100 text-slate-700"
  }
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  // Dummy snapshot – replace with API later
  const snapshot = useMemo(
    () => ({
      termLabel: "Spring Term 2025",
      campusLabel: "Main Campus",

      schoolStatusPill: "Open",
      schoolStatusLine: "Regular day • Period 4 ongoing",

      studentAttendancePct: 94.2,
      studentPresent: 707,
      studentAbsent: 43,

      staffAttendancePct: 97.8,
      staffPresent: 44,
      staffAbsent: 1,

      scheduleCount: 28,
      scheduleLine: "Classes running • 2 exams",

      urgentCount: 4,
      approvalsCount: 12,
      overdueCount: 23,

      kpiEnrollment: 750,
      kpiRevenue: 75000,
      kpiAvgAttendance: 94.2,
      kpiActiveCourses: 28,
    }),
    []
  )

  const urgentAlerts: AlertItem[] = useMemo(
    () => [
      {
        id: "u1",
        tone: "red",
        title: "Substitute teacher needed",
        subtitle: "Ms. Johnson absent • Grade 10 Math (Period 5 & 6)",
        actionLabel: "Assign",
      },
      {
        id: "u2",
        tone: "amber",
        title: "23 overdue fee payments",
        subtitle: "Total outstanding: $34,500 • Oldest: 45 days",
        actionLabel: "Review",
      },
      {
        id: "u3",
        tone: "orange",
        title: "5 staff documents expiring soon",
        subtitle: "Teaching certifications & work permits (within 30 days)",
        actionLabel: "View",
      },
      {
        id: "u4",
        tone: "blue",
        title: "8 pending admission requests",
        subtitle: "New student applications awaiting review",
        actionLabel: "Review",
      },
    ],
    []
  )

  const approvals: ApprovalItem[] = useMemo(
    () => [
      {
        id: "a1",
        icon: "user",
        title: "Teacher leave request",
        subtitle: "Mr. David Smith • 3 days",
        leftTone: "blue",
        denyLabel: "Deny",
        approveLabel: "Approve",
      },
      {
        id: "a2",
        icon: "calendar",
        title: "Timetable change request",
        subtitle: "Grade 9B • Room swap",
        leftTone: "gray",
        denyLabel: "Deny",
        approveLabel: "Approve",
      },
      {
        id: "a3",
        icon: "file",
        title: "Document submission",
        subtitle: "Sarah Johnson • Medical certificate",
        leftTone: "green",
        denyLabel: "Reject",
        approveLabel: "Accept",
      },
    ],
    []
  )

  const feeFollowups: FeeFollowup[] = useMemo(
    () => [
      {
        id: "f1",
        name: "Emily Rodriguez",
        subtitle: "Grade 11A • $2,450 • 45 days overdue",
        tone: "red",
        actionLabel: "Contact",
      },
      {
        id: "f2",
        name: "Michael Chen",
        subtitle: "Grade 9B • $1,800 • 30 days overdue",
        tone: "orange",
        actionLabel: "Contact",
      },
      {
        id: "f3",
        name: "Jessica Williams",
        subtitle: "Grade 12C • $1,200 • 28 days overdue",
        tone: "orange",
        actionLabel: "Contact",
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Good afternoon, {user?.firstName || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {snapshot.termLabel} • {snapshot.campusLabel}
          </p>
        </div>

        <div className="w-full md:w-[420px]">
          <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search students, teachers, classes, invoices..."
            />
          </div>
        </div>
      </div>

      {/* Quick actions row */}
      <Card>
        <div className="flex flex-wrap gap-3">
          <Button className="h-10 rounded-lg px-4">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
          <Button className="h-10 rounded-lg px-4">
            <Users className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
          <Button className="h-10 rounded-lg px-4">
            <Megaphone className="mr-2 h-4 w-4" />
            Post Announcement
          </Button>
          <Button className="h-10 rounded-lg px-4">
            <Receipt className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          <Button className="h-10 rounded-lg px-4">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </Card>

      {/* 4 top tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* School Status */}
        <Card>
          <div className={cn("h-full rounded-xl p-4", leftAccent("green"))}>
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                {snapshot.schoolStatusPill}
              </div>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">School Status</h3>
            <p className="mt-1 text-sm text-slate-600">{snapshot.schoolStatusLine}</p>
          </div>
        </Card>

        {/* Student Attendance */}
        <Card>
          <div className={cn("h-full rounded-xl p-4", leftAccent("blue"))}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Student Attendance</p>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <UserRound className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {snapshot.studentAttendancePct.toFixed(1)}%
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {snapshot.studentPresent} present •{" "}
              <span className="font-medium text-rose-600">{snapshot.studentAbsent} absent</span>
            </div>
          </div>
        </Card>

        {/* Staff Attendance */}
        <Card>
          <div className="h-full rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Staff Attendance</p>
              <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                <UserRoundCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {snapshot.staffAttendancePct.toFixed(1)}%
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {snapshot.staffPresent} present •{" "}
              <span className="font-medium text-rose-600">{snapshot.staffAbsent} absent</span>
            </div>
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <div className={cn("h-full rounded-xl p-4", leftAccent("green"))}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Today&apos;s Schedule</p>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">{snapshot.scheduleCount}</div>
            <p className="mt-1 text-sm text-slate-600">{snapshot.scheduleLine}</p>
          </div>
        </Card>
      </div>

      {/* Urgent alerts */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h2 className="text-lg font-semibold text-slate-900">Urgent Alerts</h2>
          </div>
          <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800">
            {snapshot.urgentCount} items
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {urgentAlerts.map((a) => (
            <div
              key={a.id}
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border px-4 py-3",
                toneBg(a.tone)
              )}
            >
              <div className="flex items-start gap-3">
                {a.tone === "red" ? (
                  <AlertTriangle className={cn("mt-0.5 h-5 w-5", toneIconColor(a.tone))} />
                ) : a.tone === "amber" ? (
                  <Clock className={cn("mt-0.5 h-5 w-5", toneIconColor(a.tone))} />
                ) : a.tone === "orange" ? (
                  <FileCheck2 className={cn("mt-0.5 h-5 w-5", toneIconColor(a.tone))} />
                ) : (
                  <Users className={cn("mt-0.5 h-5 w-5", toneIconColor(a.tone))} />
                )}

                <div>
                  <p className="font-medium text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-600">{a.subtitle}</p>
                </div>
              </div>

              <Button className="h-9 rounded-lg px-4">{a.actionLabel}</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending approvals + fee follow-ups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Approvals */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Pending Approvals</h2>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {snapshot.approvalsCount} pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {approvals.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-lg p-2", approvalToneClasses(a.leftTone))}>
                    <ApprovalIcon kind={a.icon} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{a.title}</p>
                    <p className="text-sm text-slate-600">{a.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="h-9 rounded-lg bg-white px-4 text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                    {a.denyLabel}
                  </Button>
                  <Button className="h-9 rounded-lg px-4">{a.approveLabel}</Button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full text-sm font-medium text-blue-700 hover:underline">
            View all approvals →
          </button>
        </Card>

        {/* Fee follow-ups */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Fee Follow-ups</h2>
            <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800">
              {snapshot.overdueCount} overdue
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {feeFollowups.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      f.tone === "red" ? "bg-rose-100 text-rose-700" : "bg-orange-100 text-orange-700"
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{f.name}</p>
                    <p className="text-sm text-slate-600">{f.subtitle}</p>
                  </div>
                </div>

                <Button className="h-9 rounded-lg bg-white px-4 text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                  {f.actionLabel}
                </Button>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full text-sm font-medium text-blue-700 hover:underline">
            View all overdue fees →
          </button>
        </Card>
      </div>

      {/* Bottom KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600">Total Enrollment</p>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-6 text-4xl font-bold text-slate-900">{snapshot.kpiEnrollment}</div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-1 text-xs font-medium", kpiTrendChip("up"))}>
              +5.2%
            </span>
            <span className="text-xs text-slate-500">from last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-6 text-4xl font-bold text-slate-900">
            ${snapshot.kpiRevenue.toLocaleString()}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-1 text-xs font-medium", kpiTrendChip("up"))}>
              +4.2%
            </span>
            <span className="text-xs text-slate-500">from last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600">Avg Attendance</p>
            <TrendingDown className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-6 text-4xl font-bold text-slate-900">
            {snapshot.kpiAvgAttendance.toFixed(1)}%
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-1 text-xs font-medium", kpiTrendChip("down"))}>
              -1.3%
            </span>
            <span className="text-xs text-slate-500">from last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600">Active Courses</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-6 text-4xl font-bold text-slate-900">{snapshot.kpiActiveCourses}</div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-1 text-xs font-medium", kpiTrendChip("neutral"))}>
              No change
            </span>
            <span className="text-xs text-slate-500">this term</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
