"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Plus,
  Upload,
  Send,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  BookOpen,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import {
  TimetableDashboardStats,
  RecentActivity,
  TimetableConflict,
  ClassTimetable,
  DAYS_OF_WEEK,
} from "@/types/timetable"
import {
  SAMPLE_DASHBOARD_STATS,
  SAMPLE_RECENT_ACTIVITY,
  SAMPLE_CONFLICTS,
  SAMPLE_GRADES,
  SAMPLE_SECTIONS,
  SAMPLE_CLASS_TIMETABLE,
} from "@/data/timetableSampleData"

// -------------------- UTILITY --------------------

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "Just now"
}

// -------------------- COMPONENTS --------------------

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  onClick,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "blue" | "green" | "amber" | "red" | "purple" | "slate"
  onClick?: () => void
}) {
  const colorConfig = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
    green: { bg: "bg-green-50", border: "border-green-200", icon: "bg-green-100 text-green-600", text: "text-green-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "bg-amber-100 text-amber-600", text: "text-amber-600" },
    red: { bg: "bg-red-50", border: "border-red-200", icon: "bg-red-100 text-red-600", text: "text-red-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "bg-purple-100 text-purple-600", text: "text-purple-600" },
    slate: { bg: "bg-white", border: "border-slate-200", icon: "bg-slate-100 text-slate-600", text: "text-slate-600" },
  }

  const config = colorConfig[color]

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 transition-all",
        config.bg,
        config.border,
        onClick && "cursor-pointer hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-2", config.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-slate-500"
          )}>
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-600 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  variant = "default",
}: {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
  variant?: "default" | "primary" | "warning"
}) {
  const variantConfig = {
    default: "border-slate-200 bg-white hover:bg-slate-50",
    primary: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    warning: "border-amber-200 bg-amber-50 hover:bg-amber-100",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all hover:shadow-md",
        variantConfig[variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "rounded-lg p-2",
          variant === "primary" && "bg-blue-100 text-blue-600",
          variant === "warning" && "bg-amber-100 text-amber-600",
          variant === "default" && "bg-slate-100 text-slate-600"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
      </div>
    </button>
  )
}

function RecentActivityItem({ activity }: { activity: RecentActivity }) {
  const iconConfig = {
    timetable_published: { icon: Send, color: "text-green-600 bg-green-100" },
    availability_updated: { icon: Clock, color: "text-blue-600 bg-blue-100" },
    conflict_resolved: { icon: CheckCircle2, color: "text-purple-600 bg-purple-100" },
    draft_created: { icon: FileText, color: "text-amber-600 bg-amber-100" },
  }

  const config = iconConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn("rounded-lg p-2", config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <span>{activity.user}</span>
          {activity.gradeSection && (
            <>
              <span>•</span>
              <span>{activity.gradeSection}</span>
            </>
          )}
          <span>•</span>
          <span>{formatTimeAgo(activity.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

function ConflictItem({ conflict }: { conflict: TimetableConflict }) {
  const Icon = conflict.severity === "error" ? XCircle : AlertCircle
  const colorClass = conflict.severity === "error" ? "text-red-600" : "text-amber-600"

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-start gap-2">
        <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", colorClass)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">{conflict.message}</p>
          {conflict.details.gradeSection && (
            <p className="text-xs text-slate-500 mt-0.5">{conflict.details.gradeSection}</p>
          )}
          {conflict.suggestions && conflict.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-slate-600">Suggestions:</p>
              <ul className="text-xs text-slate-500 list-disc list-inside mt-1">
                {conflict.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimetableStatusCard({
  grade,
  section,
  status,
  lastUpdated,
  conflicts,
  onClick,
}: {
  grade: string
  section: string
  status: "draft" | "published" | "not_started"
  lastUpdated?: string
  conflicts: number
  onClick: () => void
}) {
  const statusConfig = {
    draft: { label: "Draft", color: "bg-amber-100 text-amber-700 border-amber-200" },
    published: { label: "Published", color: "bg-green-100 text-green-700 border-green-200" },
    not_started: { label: "Not Started", color: "bg-slate-100 text-slate-700 border-slate-200" },
  }

  const config = statusConfig[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{grade}</h3>
          <p className="text-sm text-slate-500">{section}</p>
        </div>
        <span className={cn("rounded-full border px-2 py-1 text-xs font-medium", config.color)}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          {lastUpdated ? `Updated ${formatTimeAgo(lastUpdated)}` : "No updates yet"}
        </div>
        {conflicts > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            {conflicts} conflicts
          </div>
        )}
      </div>
    </button>
  )
}

// -------------------- MAIN COMPONENT --------------------

export default function TimetableDashboard() {
  const navigate = useNavigate()
  const [stats] = useState<TimetableDashboardStats>(SAMPLE_DASHBOARD_STATS)
  const [recentActivity] = useState<RecentActivity[]>(SAMPLE_RECENT_ACTIVITY)
  const [conflicts] = useState<TimetableConflict[]>(SAMPLE_CONFLICTS)

  // Derived data
  const timetableStatuses = useMemo(() => {
    return SAMPLE_SECTIONS.slice(0, 8).map(section => {
      const grade = SAMPLE_GRADES.find(g => g.id === section.gradeId)
      return {
        gradeId: section.gradeId,
        sectionId: section.id,
        grade: grade?.name || "Unknown",
        section: section.name,
        status: Math.random() > 0.6 ? "published" : Math.random() > 0.3 ? "draft" : "not_started" as "draft" | "published" | "not_started",
        lastUpdated: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : undefined,
        conflicts: Math.floor(Math.random() * 3),
      }
    })
  }, [])

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Timetable Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of timetable planning and scheduling status
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/school-admin/timetable-planner")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Timetable
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Classes"
          value={stats.totalClasses}
          subtitle={`${stats.scheduledClasses} scheduled`}
          icon={Layers}
          color="blue"
        />
        <KpiCard
          title="Active Conflicts"
          value={stats.totalConflicts}
          subtitle={`${stats.totalWarnings} warnings`}
          icon={AlertTriangle}
          color={stats.totalConflicts > 0 ? "red" : "green"}
          trend={stats.totalConflicts > 0 ? "up" : "neutral"}
          trendValue={stats.totalConflicts > 0 ? "Needs attention" : "All clear"}
        />
        <KpiCard
          title="Teacher Availability"
          value={`${stats.teachersWithAvailability}/${stats.teachersWithAvailability + stats.teachersPendingAvailability}`}
          subtitle={`${stats.teachersPendingAvailability} pending`}
          icon={Users}
          color={stats.teachersPendingAvailability > 0 ? "amber" : "green"}
          onClick={() => navigate("/school-admin/teacher-availability")}
        />
        <KpiCard
          title="Published"
          value={stats.publishedTimetables}
          subtitle={`${stats.draftTimetables} drafts`}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Timetables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickActionCard
                title="Create New Timetable"
                description="Start building a timetable for a class"
                icon={Plus}
                onClick={() => navigate("/school-admin/timetable-planner")}
                variant="primary"
              />
              <QuickActionCard
                title="Import Template"
                description="Load a previous timetable as template"
                icon={Upload}
                onClick={() => {}}
              />
              <QuickActionCard
                title="View Teacher Availability"
                description="Check and manage teacher schedules"
                icon={Clock}
                onClick={() => navigate("/school-admin/teacher-availability")}
              />
              <QuickActionCard
                title="Resolve Conflicts"
                description={`${stats.totalConflicts} conflicts need attention`}
                icon={AlertTriangle}
                onClick={() => {}}
                variant={stats.totalConflicts > 0 ? "warning" : "default"}
              />
            </div>
          </div>

          {/* Timetable Status Grid */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Timetable Status</h2>
              <button
                type="button"
                onClick={() => {}}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timetableStatuses.map(tt => (
                <TimetableStatusCard
                  key={`${tt.gradeId}-${tt.sectionId}`}
                  grade={tt.grade}
                  section={tt.section}
                  status={tt.status}
                  lastUpdated={tt.lastUpdated}
                  conflicts={tt.conflicts}
                  onClick={() => navigate(`/school-admin/timetable-planner?grade=${tt.gradeId}&section=${tt.sectionId}`)}
                />
              ))}
            </div>
          </div>

          {/* Active Conflicts */}
          {conflicts.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Conflicts
                </h2>
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex items-center gap-1 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  Re-validate All
                </button>
              </div>
              <div className="space-y-2">
                {conflicts.slice(0, 3).map(conflict => (
                  <ConflictItem key={conflict.id} conflict={conflict} />
                ))}
              </div>
              {conflicts.length > 3 && (
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  View all {conflicts.length} conflicts
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Activity & Stats */}
        <div className="space-y-6">
          {/* Scheduling Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Scheduling Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Classes Scheduled</span>
                  <span className="font-medium text-slate-900">
                    {stats.scheduledClasses}/{stats.totalClasses}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(stats.scheduledClasses / stats.totalClasses) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Teacher Availability</span>
                  <span className="font-medium text-slate-900">
                    {Math.round((stats.teachersWithAvailability / (stats.teachersWithAvailability + stats.teachersPendingAvailability)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(stats.teachersWithAvailability / (stats.teachersWithAvailability + stats.teachersPendingAvailability)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Published Timetables</span>
                  <span className="font-medium text-slate-900">
                    {stats.publishedTimetables}/{stats.publishedTimetables + stats.draftTimetables}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${(stats.publishedTimetables / (stats.publishedTimetables + stats.draftTimetables)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <button
                type="button"
                onClick={() => {}}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.slice(0, 5).map(activity => (
                <RecentActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* Term Info */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Current Term</h3>
                <p className="text-sm text-slate-600">2025-2026 Term 2</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Working Days</span>
                <p className="font-medium text-slate-900">Mon - Fri</p>
              </div>
              <div>
                <span className="text-slate-500">School Hours</span>
                <p className="font-medium text-slate-900">08:00 - 16:00</p>
              </div>
              <div>
                <span className="text-slate-500">Period Length</span>
                <p className="font-medium text-slate-900">50 minutes</p>
              </div>
              <div>
                <span className="text-slate-500">Periods/Day</span>
                <p className="font-medium text-slate-900">8 periods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
