"use client"

import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/authStore"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/shared/PageHeader"
import { KpiCard, KpiCardsRow } from "@/components/shared/data/KpiCard"
import { ActionItemsCard, ActionItem } from "@/components/shared/dashboard/ActionItemsCard"
import {
  Search,
  UserPlus,
  Users,
  Megaphone,
  Receipt,
  FileText,
  CalendarDays,
  Calendar,
  AlertTriangle,
  Clock,
  FileCheck2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  GraduationCap,
} from "lucide-react"

type AlertTone = "red" | "amber" | "orange" | "blue"
type AlertItem = {
  id: string
  tone: AlertTone
  title: string
  subtitle: string
  actionLabel: string
  actionRoute?: string
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

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

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
        actionRoute: "/school-admin/teachers",
      },
      {
        id: "u2",
        tone: "amber",
        title: "23 overdue fee payments",
        subtitle: "Total outstanding: $34,500 • Oldest: 45 days",
        actionLabel: "Review",
        actionRoute: "/school-admin/finance",
      },
      {
        id: "u3",
        tone: "orange",
        title: "5 staff documents expiring soon",
        subtitle: "Teaching certifications & work permits (within 30 days)",
        actionLabel: "View",
        actionRoute: "/school-admin/teachers",
      },
      {
        id: "u4",
        tone: "blue",
        title: "8 pending admission requests",
        subtitle: "New student applications awaiting review",
        actionLabel: "Review",
        actionRoute: "/school-admin/students",
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

  // Quick action button style - consistent sizing
  const quickActionBtnClass = "h-10 min-w-[140px] rounded-lg px-4 text-sm font-medium"

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
          <Button
            className={quickActionBtnClass}
            onClick={() => navigate('/school-admin/students/new')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
          <Button
            className={quickActionBtnClass}
            onClick={() => navigate('/school-admin/teachers/new')}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
          <Button
            className={quickActionBtnClass}
            onClick={() => navigate('/school-admin/announcements')}
          >
            <Megaphone className="mr-2 h-4 w-4" />
            Announcement
          </Button>
          <Button
            className={quickActionBtnClass}
            onClick={() => navigate('/school-admin/invoices')}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          <Button
            className={quickActionBtnClass}
            onClick={() => navigate('/school-admin/reports')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </Card>

      {/* 4 top tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* School Status */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500" onClick={() => navigate('/school-admin/settings')}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 mb-2">
                {snapshot.schoolStatusPill}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">School Status</h3>
              <p className="text-xs text-slate-500 mt-1">{snapshot.schoolStatusLine}</p>
            </div>
          </div>
        </Card>

        {/* Student Attendance */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500" onClick={() => navigate('/school-admin/students')}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Student Attendance</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{snapshot.studentAttendancePct.toFixed(1)}%</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-slate-500">{snapshot.studentPresent} present</p>
                <span className="text-xs text-slate-400">•</span>
                <p className="text-xs text-rose-600 font-medium">{snapshot.studentAbsent} absent</p>
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        {/* Staff Attendance */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-slate-400" onClick={() => navigate('/school-admin/teachers')}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Staff Attendance</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{snapshot.staffAttendancePct.toFixed(1)}%</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-slate-500">{snapshot.staffPresent} present</p>
                <span className="text-xs text-slate-400">•</span>
                <p className="text-xs text-rose-600 font-medium">{snapshot.staffAbsent} absent</p>
              </div>
            </div>
            <Users className="h-8 w-8 text-slate-400" />
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500" onClick={() => navigate('/school-admin/courses')}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Today&apos;s Schedule</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{snapshot.scheduleCount}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-slate-500">Classes running</p>
                <span className="text-xs text-slate-400">•</span>
                <p className="text-xs text-emerald-600">2 exams</p>
              </div>
            </div>
            <Calendar className="h-8 w-8 text-emerald-500" />
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

              <Button
                className="h-9 min-w-[80px] rounded-lg px-4 text-sm"
                onClick={() => a.actionRoute && navigate(a.actionRoute)}
              >
                {a.actionLabel}
              </Button>
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
                  <Button
                    variant="outline"
                    className="h-9 min-w-[70px] rounded-lg px-3 text-sm"
                  >
                    {a.denyLabel}
                  </Button>
                  <Button className="h-9 min-w-[80px] rounded-lg px-3 text-sm">
                    {a.approveLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-5 w-full text-sm font-medium text-blue-700 hover:underline"
            onClick={() => navigate('/school-admin/reports')}
          >
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

                <Button
                  variant="outline"
                  className="h-9 min-w-[80px] rounded-lg px-3 text-sm"
                >
                  {f.actionLabel}
                </Button>
              </div>
            ))}
          </div>

          <button
            className="mt-5 w-full text-sm font-medium text-blue-700 hover:underline"
            onClick={() => navigate('/school-admin/finance')}
          >
            View all overdue fees →
          </button>
        </Card>
      </div>

      {/* Bottom KPIs */}
      <KpiCardsRow columns={4}>
        <KpiCard
          icon={Users}
          label="Total Enrollment"
          value={snapshot.kpiEnrollment}
          color="blue"
          trend={{ direction: "up", value: "+5.2%", label: "from last month" }}
          onClick={() => navigate('/school-admin/students')}
        />
        <KpiCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${snapshot.kpiRevenue.toLocaleString()}`}
          color="green"
          trend={{ direction: "up", value: "+4.2%", label: "from last month" }}
          onClick={() => navigate('/school-admin/finance')}
        />
        <KpiCard
          icon={Calendar}
          label="Avg Attendance"
          value={`${snapshot.kpiAvgAttendance.toFixed(1)}%`}
          color="amber"
          trend={{ direction: "down", value: "-1.3%", label: "from last month" }}
          onClick={() => navigate('/school-admin/reports')}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Active Courses"
          value={snapshot.kpiActiveCourses}
          color="emerald"
          subtext="this term"
          onClick={() => navigate('/school-admin/courses')}
        />
      </KpiCardsRow>
    </div>
  )
}
