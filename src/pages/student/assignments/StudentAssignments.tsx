"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Info,
  BookOpen,
  Code2,
  BarChart3,
} from "lucide-react"

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

type TabKey = "upcoming" | "past" | "completed"

type Attachment = { name: string; type: "pdf" | "zip" | "file" }
type SubmissionFile = { name: string }

type Assignment = {
  id: string
  title: string
  courseCode: string
  courseName: string
  groupDateLabel: string
  groupDayLabel: string
  submittedAt?: string
  status: "turned_in" | "missing" | "graded"
  points?: { earned: number; total: number }
  dueDate?: string
  description?: string
  instructionsHeader?: string
  instructions?: string[]
  instructionsFooter?: string
  attachments?: Attachment[]
  submission?: {
    submittedOn: string
    submittedDate: string
    files: SubmissionFile[]
  }
  assignmentType?: string
  icon?: "book" | "code" | "chart"
  tab?: TabKey
}

const SAMPLE_ASSIGNMENTS: Assignment[] = [
  // UPCOMING ASSIGNMENTS
  {
    id: "a4",
    title: "Assignment 4: REST API Integration",
    courseCode: "2025-2-CSX4109-S41",
    courseName: "Android Application Development",
    groupDateLabel: "Jan 8th",
    groupDayLabel: "Wednesday",
    status: "missing",
    dueDate: "Wednesday, January 8, 2026",
    description: "Integrate a REST API into your Android application using Retrofit.",
    instructionsHeader: "Create an Android application that demonstrates:",
    instructions: [
      "Retrofit setup and configuration",
      "API endpoint integration",
      "JSON parsing with Gson",
      "Error handling and loading states",
      "Display data in RecyclerView",
    ],
    attachments: [
      { name: "API_Documentation.pdf", type: "pdf" },
      { name: "Starter_Project.zip", type: "zip" },
    ],
    assignmentType: "Homework",
    icon: "code",
    tab: "upcoming",
  },
  {
    id: "a5",
    title: "Quiz 3: Mobile Security",
    courseCode: "2025-2-CSX4109-S41",
    courseName: "Android Application Development",
    groupDateLabel: "Jan 10th",
    groupDayLabel: "Friday",
    status: "missing",
    dueDate: "Friday, January 10, 2026",
    description: "Online quiz covering mobile application security concepts.",
    assignmentType: "Quiz",
    icon: "chart",
    tab: "upcoming",
  },
  {
    id: "a6",
    title: "Group Project Proposal",
    courseCode: "2025-1-WAD-541",
    courseName: "Web Application Development",
    groupDateLabel: "Jan 15th",
    groupDayLabel: "Wednesday",
    status: "missing",
    dueDate: "Wednesday, January 15, 2026",
    description: "Submit your group project proposal including scope, timeline, and technology stack.",
    instructionsHeader: "Your proposal should include:",
    instructions: [
      "Project title and description",
      "Team members and roles",
      "Technology stack justification",
      "Project timeline with milestones",
      "Risk assessment",
    ],
    attachments: [
      { name: "Proposal_Template.pdf", type: "pdf" },
    ],
    assignmentType: "Project",
    icon: "book",
    tab: "upcoming",
  },
  // PAST DUE ASSIGNMENTS
  {
    id: "a3",
    title: "Assignment 3: Database Integration",
    courseCode: "2025-2-CSX4109-S41",
    courseName: "Android Application Development",
    groupDateLabel: "Dec 20th",
    groupDayLabel: "Friday",
    status: "missing",
    dueDate: "Friday, December 20, 2025",
    description: "Implement local database storage using Room persistence library.",
    instructionsHeader: "Create an Android application that demonstrates:",
    instructions: [
      "Room database setup",
      "Entity and DAO creation",
      "CRUD operations",
      "LiveData integration",
      "Database migrations",
    ],
    attachments: [
      { name: "Room_Guide.pdf", type: "pdf" },
    ],
    assignmentType: "Homework",
    icon: "code",
    tab: "past",
  },
  {
    id: "lab2",
    title: "Lab 2: UI Testing",
    courseCode: "2025-1-WAD-541",
    courseName: "Web Application Development",
    groupDateLabel: "Dec 18th",
    groupDayLabel: "Wednesday",
    status: "missing",
    dueDate: "Wednesday, December 18, 2025",
    description: "Complete the UI testing lab exercises using Cypress.",
    assignmentType: "Lab",
    icon: "code",
    tab: "past",
  },
  // COMPLETED ASSIGNMENTS
  {
    id: "a2",
    title: "Assignment 2: Android UI Components",
    courseCode: "2025-2-CSX4109-S41",
    courseName: "Android Application Development",
    groupDateLabel: "Nov 12th",
    groupDayLabel: "Wednesday",
    submittedAt: "Submitted at 10:28 AM",
    status: "turned_in",
    dueDate: "Wednesday, November 12, 2025",
    description: "Build a functional Android app with custom UI components",
    instructionsHeader: "Create an Android application that demonstrates:",
    instructions: [
      "Custom layout implementation",
      "RecyclerView with adapter",
      "Material Design components",
      "Event handling and user interactions",
    ],
    instructionsFooter: "Submit your source code and a working APK file.",
    attachments: [
      { name: "Assignment_Requirements.pdf", type: "pdf" },
      { name: "Sample_Code.zip", type: "zip" },
    ],
    submission: {
      submittedOn: "Submitted on Wed, Nov 12 at 10:28 AM",
      submittedDate: "11/12/2025",
      files: [{ name: "MainActivity.java" }, { name: "app.apk" }],
    },
    assignmentType: "Homework",
    icon: "book",
    tab: "completed",
  },
  {
    id: "a1",
    title: "Assignment 1: Introduction to Android",
    courseCode: "2025-2-CSX4109-S41",
    courseName: "Android Application Development",
    groupDateLabel: "Nov 5th",
    groupDayLabel: "Wednesday",
    submittedAt: "Submitted at 4:22 PM",
    status: "turned_in",
    dueDate: "Wednesday, November 5, 2025",
    description: "Create your first Android application with basic layouts.",
    instructionsHeader: "Complete the following tasks:",
    instructions: [
      "Set up Android Studio",
      "Create a Hello World app",
      "Add basic UI elements",
    ],
    submission: {
      submittedOn: "Submitted on Wed, Nov 5 at 4:22 PM",
      submittedDate: "11/05/2025",
      files: [{ name: "HelloWorld.zip" }],
    },
    assignmentType: "Homework",
    icon: "book",
    tab: "completed",
  },
  {
    id: "gdd-po2",
    title: "GDD PO2 Score",
    courseCode: "2025-1-GDD-541",
    courseName: "Game Design & Development",
    groupDateLabel: "Oct 14th",
    groupDayLabel: "Tuesday",
    status: "graded",
    points: { earned: 30, total: 30 },
    dueDate: "Tuesday, October 14, 2025",
    description: "Performance objective assessment for game development module.",
    assignmentType: "Assessment",
    icon: "code",
    tab: "completed",
  },
  {
    id: "wad-po2",
    title: "PO2 Score",
    courseCode: "2025-1-WAD-541",
    courseName: "Web Application Development",
    groupDateLabel: "Oct 13th",
    groupDayLabel: "Monday",
    status: "graded",
    points: { earned: 20, total: 20 },
    dueDate: "Monday, October 13, 2025",
    description: "Performance objective assessment for web development module.",
    assignmentType: "Assessment",
    icon: "code",
    tab: "completed",
  },
  {
    id: "final",
    title: "FINAL",
    courseCode: "2025-1-GDD-541",
    courseName: "Game Design & Development",
    groupDateLabel: "Oct 2nd",
    groupDayLabel: "Thursday",
    status: "graded",
    points: { earned: 20, total: 20 },
    dueDate: "Thursday, October 2, 2025",
    description: "Final examination for Game Design & Development course.",
    assignmentType: "Exam",
    icon: "chart",
    tab: "completed",
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   Reusable Components
───────────────────────────────────────────────────────────────────────────── */

function SegmentedTabs({
  value,
  onChange,
}: {
  value: TabKey
  onChange: (v: TabKey) => void
}) {
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past due" },
    { key: "completed", label: "Completed" },
  ]

  return (
    <div className="inline-flex items-center rounded-xl bg-gray-100 p-1">
      {tabs.map((t) => {
        const active = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-lg transition",
              active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

function StatusPill({ status }: { status: Assignment["status"] }) {
  const label =
    status === "turned_in"
      ? "Turned in"
      : status === "missing"
        ? "Missing"
        : "Graded"

  const cls =
    status === "missing"
      ? "bg-red-100 text-red-700"
      : "bg-emerald-100 text-emerald-700"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        cls
      )}
    >
      {label}
    </span>
  )
}

function IconTile({ icon }: { icon?: Assignment["icon"] }) {
  const Icon =
    icon === "code" ? Code2 : icon === "chart" ? BarChart3 : BookOpen

  return (
    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
      <Icon className="h-5 w-5" />
    </div>
  )
}

function AttachmentsList({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="space-y-2">
      {attachments.map((a) => (
        <div
          key={a.name}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <Download className="h-4 w-4 text-gray-500 shrink-0" />
          <p className="text-sm font-medium text-gray-900 truncate flex-1">
            {a.name}
          </p>
        </div>
      ))}
    </div>
  )
}

function SubmissionBox({
  submittedOn,
  files,
}: {
  submittedOn: string
  files: SubmissionFile[]
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <h3 className="text-base font-semibold text-gray-900">Your Submission</h3>
      <p className="mt-2 text-sm text-gray-600">{submittedOn}</p>

      <div className="mt-4 space-y-2">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <p className="text-sm font-medium text-gray-900 truncate">
              {f.name}
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition"
              aria-label={`Download ${f.name}`}
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Assignment List Components
───────────────────────────────────────────────────────────────────────────── */

function AssignmentRow({
  item,
  onClick,
}: {
  item: Assignment
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-4",
        "hover:shadow-md hover:border-gray-300 transition cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <IconTile icon={item.icon} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 truncate">
              {item.submittedAt ? `${item.submittedAt}  ` : ""}
              <span className="text-gray-400">•</span> {item.courseCode}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {item.points ? (
            <p className="text-sm font-semibold text-emerald-700">
              {item.points.earned}/{item.points.total} points
            </p>
          ) : null}
          <StatusPill status={item.status} />
        </div>
      </div>
    </div>
  )
}

function GroupHeader({ date, day }: { date: string; day: string }) {
  return (
    <div className="mt-6 mb-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{date}</h3>
        <span className="text-xs font-medium text-gray-500">{day}</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Assignment Detail View (Full Page)
───────────────────────────────────────────────────────────────────────────── */

function AssignmentDetail({
  assignment,
  onBack,
}: {
  assignment: Assignment
  onBack: () => void
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Button
            variant="ghost"
            className="h-9 w-9 p-0 rounded-lg shrink-0"
            onClick={onBack}
            aria-label="Back to assignments"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {assignment.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {assignment.courseName}
              <span className="mx-2 text-gray-300">•</span>
              {assignment.courseCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">Submitted</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Due Date Card */}
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Due Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {assignment.dueDate ?? "—"}
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Description</h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {assignment.description ?? "No description provided."}
            </p>
          </Card>

          {/* Instructions */}
          {assignment.instructions && assignment.instructions.length > 0 && (
            <Card className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Instructions
              </h3>
              <div className="mt-3 text-sm text-gray-600 space-y-3">
                {assignment.instructionsHeader && (
                  <p>{assignment.instructionsHeader}</p>
                )}
                <ol className="list-decimal pl-5 space-y-1">
                  {assignment.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
                {assignment.instructionsFooter && (
                  <p>{assignment.instructionsFooter}</p>
                )}
              </div>
            </Card>
          )}

          {/* Attachments */}
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Attachments</h3>
            <div className="mt-4">
              {assignment.attachments && assignment.attachments.length > 0 ? (
                <AttachmentsList attachments={assignment.attachments} />
              ) : (
                <p className="text-sm text-gray-500">No attachments.</p>
              )}
            </div>
          </Card>

          {/* Your Submission (Green Box) */}
          {assignment.submission && (
            <SubmissionBox
              submittedOn={assignment.submission.submittedOn}
              files={assignment.submission.files}
            />
          )}
        </div>

        {/* Sidebar - Assignment Info */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">
              Assignment Info
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Type</p>
                <p className="text-sm font-semibold text-gray-900">
                  {assignment.assignmentType ?? "Homework"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Total Points</p>
                <p className="text-sm font-semibold text-gray-900">
                  {assignment.points?.total ?? 20} points
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Status</p>
                <p className="text-sm font-semibold text-gray-900">
                  {assignment.status === "turned_in"
                    ? "Submitted"
                    : assignment.status === "graded"
                      ? "Graded"
                      : "Missing"}
                </p>
              </div>

              {assignment.submission?.submittedDate && (
                <div>
                  <p className="text-xs font-medium text-gray-500">Submitted</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {assignment.submission.submittedDate}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    Contact your instructor if you have questions about this
                    assignment.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Assignment List View (Main Page)
───────────────────────────────────────────────────────────────────────────── */

function AssignmentList({
  tab,
  setTab,
  onSelectAssignment,
}: {
  tab: TabKey
  setTab: (v: TabKey) => void
  onSelectAssignment: (id: string) => void
}) {
  const filtered = useMemo(() => {
    return SAMPLE_ASSIGNMENTS.filter((a) => a.tab === tab)
  }, [tab])

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { date: string; day: string; items: Assignment[] }
    >()
    for (const a of filtered) {
      const key = `${a.groupDateLabel}|${a.groupDayLabel}`
      if (!map.has(key)) {
        map.set(key, { date: a.groupDateLabel, day: a.groupDayLabel, items: [] })
      }
      map.get(key)!.items.push(a)
    }
    return Array.from(map.values())
  }, [filtered])

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your assignments and submissions
        </p>

        <div className="mt-4">
          <SegmentedTabs value={tab} onChange={setTab} />
        </div>
      </div>

      {/* Assignment List */}
      {filtered.length === 0 ? (
        <div className="mt-8">
          <Card className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              No {tab === "upcoming" ? "upcoming" : tab === "past" ? "past due" : "completed"} assignments.
            </p>
          </Card>
        </div>
      ) : (
        <div className="mt-4">
          {groups.map((g) => (
            <div key={`${g.date}-${g.day}`}>
              <GroupHeader date={g.date} day={g.day} />
              <div className="space-y-3">
                {g.items.map((a) => (
                  <AssignmentRow
                    key={a.id}
                    item={a}
                    onClick={() => onSelectAssignment(a.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */

export default function StudentAssignments() {
  const [tab, setTab] = useState<TabKey>("completed")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedAssignment = useMemo(
    () => SAMPLE_ASSIGNMENTS.find((a) => a.id === selectedId) ?? null,
    [selectedId]
  )

  // Show detail view as a separate screen (replaces the list)
  if (selectedAssignment) {
    return (
      <AssignmentDetail
        assignment={selectedAssignment}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  // Show list view
  return (
    <AssignmentList
      tab={tab}
      setTab={setTab}
      onSelectAssignment={setSelectedId}
    />
  )
}
