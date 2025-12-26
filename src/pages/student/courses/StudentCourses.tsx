"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { BookOpen, Calendar, Trophy, Search, Plus, Check } from "lucide-react"

type TabKey = "courses" | "planner" | "results"

const TABS: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
  { key: "planner", label: "Planner", icon: <Calendar className="h-4 w-4" /> },
  { key: "results", label: "Results", icon: <Trophy className="h-4 w-4" /> },
]

type CoursePoolItem = {
  id: string // course id (database-style)
  name: string
  credits: number
  lecturer: string
  department?: string
  level?: "100" | "200" | "300" | "400"
}

type PlannedItem = {
  courseId: string // references CoursePoolItem.id
  semester: string
}

type RegisteredResult = {
  courseId: string // references CoursePoolItem.id
  semester: string
  grade: string // A, A-, B+ ...
  points: number // 4.0, 3.7 ...
}

const COURSE_POOL: CoursePoolItem[] = [
  { id: "CS101", name: "Programming Fundamentals", credits: 3, lecturer: "Dr. Sarah Chen", department: "Computer Science", level: "100" },
  { id: "CS102", name: "Data Structures", credits: 4, lecturer: "Prof. John Smith", department: "Computer Science", level: "100" },
  { id: "CS103", name: "Algorithms", credits: 4, lecturer: "Dr. Mei Lin", department: "Computer Science", level: "100" },
  { id: "CS201", name: "Operating Systems", credits: 3, lecturer: "Dr. Nattapong S.", department: "Computer Science", level: "200" },
  { id: "CS202", name: "Database Management", credits: 4, lecturer: "Ms. Alina Fernandez", department: "Computer Science", level: "200" },
  { id: "CS203", name: "Computer Networks", credits: 3, lecturer: "Mr. K. Somchai", department: "Computer Science", level: "200" },
  { id: "MA101", name: "Discrete Mathematics", credits: 3, lecturer: "Dr. Panida W.", department: "Mathematics", level: "100" },
  { id: "EN101", name: "Academic Writing", credits: 3, lecturer: "Ms. S. Kanda", department: "General", level: "100" },
  { id: "PH101", name: "Intro Physics", credits: 3, lecturer: "Dr. R. Gomez", department: "Science", level: "100" },
]

const NEXT_SEMESTER = "Spring 2025"

const INITIAL_PLANNER: PlannedItem[] = [
  { courseId: "CS201", semester: NEXT_SEMESTER },
  { courseId: "CS202", semester: NEXT_SEMESTER },
]

const REGISTERED_RESULTS: RegisteredResult[] = [
  { courseId: "CS101", semester: "Fall 2024", grade: "A", points: 4.0 },
  { courseId: "CS102", semester: "Fall 2024", grade: "A-", points: 3.7 },
  { courseId: "MA101", semester: "Fall 2024", grade: "B+", points: 3.3 },
  { courseId: "EN101", semester: "Summer 2024", grade: "A", points: 4.0 },
  { courseId: "PH101", semester: "Summer 2024", grade: "B", points: 3.0 },
]

function gradeClass(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-600"
  if (grade.startsWith("B")) return "text-blue-600"
  if (grade.startsWith("C")) return "text-amber-600"
  return "text-slate-700"
}

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

/* ─────────────────────────────────────────────────────────────────────────────
   Courses (Course Pool / Catalog)
───────────────────────────────────────────────────────────────────────────── */

function CoursesPoolView() {
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState<string>("all")

  const departments = useMemo(() => {
    const set = new Set(COURSE_POOL.map((c) => c.department).filter(Boolean) as string[])
    return ["all", ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSE_POOL.filter((c) => {
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.lecturer.toLowerCase().includes(q)
      const matchesDept = dept === "all" || c.department === dept
      return matchesQuery && matchesDept
    })
  }, [query, dept])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Course Catalog</h2>
          <p className="text-sm text-slate-500">Available courses in the system (mock data for now)</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name, lecturer..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-slate-300 sm:w-[280px]"
            />
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-300"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Departments" : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Credits</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Lecturer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{c.id}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{c.name}</td>
                <td className="px-4 py-3 text-sm text-center text-slate-600">{c.credits}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{c.lecturer}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  No courses match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Planner (Next semester planning)
───────────────────────────────────────────────────────────────────────────── */

function PlannerView() {
  const [planned, setPlanned] = useState<PlannedItem[]>(INITIAL_PLANNER)
  const [pickerOpen, setPickerOpen] = useState(false)

  const plannedIds = useMemo(() => new Set(planned.map((p) => p.courseId)), [planned])

  const plannedCourses = useMemo(() => {
    return planned
      .filter((p) => p.semester === NEXT_SEMESTER)
      .map((p) => COURSE_POOL.find((c) => c.id === p.courseId))
      .filter(Boolean) as CoursePoolItem[]
  }, [planned])

  const availableToAdd = useMemo(() => {
    return COURSE_POOL.filter((c) => !plannedIds.has(c.id))
  }, [plannedIds])

  const totalCredits = useMemo(() => {
    return plannedCourses.reduce((sum, c) => sum + c.credits, 0)
  }, [plannedCourses])

  function addToPlan(courseId: string) {
    setPlanned((prev) => [...prev, { courseId, semester: NEXT_SEMESTER }])
  }

  function removeFromPlan(courseId: string) {
    setPlanned((prev) => prev.filter((p) => !(p.courseId === courseId && p.semester === NEXT_SEMESTER)))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Planner</h2>
          <p className="text-sm text-slate-500">Plan your courses for the next semester</p>
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add from catalog
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">{NEXT_SEMESTER}</div>
            <div className="text-xs text-slate-500">Planned credits: {totalCredits}</div>
          </div>
          <div className="text-xs text-slate-500">{plannedCourses.length} course(s)</div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
          {plannedCourses.length > 0 ? (
            plannedCourses.map((c, idx) => (
              <div
                key={c.id}
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  idx !== 0 && "border-t border-slate-100"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{c.id}</span>
                    <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{c.credits} Cr.</span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-700 truncate">{c.name}</div>
                  <div className="mt-1 text-xs text-slate-500">Lecturer: {c.lecturer}</div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromPlan(c.id)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No planned courses yet. Click <span className="font-semibold text-slate-700">Add from catalog</span>.
            </div>
          )}
        </div>
      </div>

      {pickerOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Add courses</div>
              <div className="text-xs text-slate-500">Choose from the course catalog</div>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course Name</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Credits</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Lecturer</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {availableToAdd.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-center text-slate-600">{c.credits}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.lecturer}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => addToPlan(c.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
                {availableToAdd.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      All courses are already in your plan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Results (Registered Results)
───────────────────────────────────────────────────────────────────────────── */

function ResultsView() {
  const bySemester = useMemo(() => {
    const semesters = [...new Set(REGISTERED_RESULTS.map((r) => r.semester))]
    return semesters.map((sem) => ({
      semester: sem,
      rows: REGISTERED_RESULTS.filter((r) => r.semester === sem),
    }))
  }, [])

  const cumulative = useMemo(() => {
    const rows = REGISTERED_RESULTS.map((r) => {
      const course = COURSE_POOL.find((c) => c.id === r.courseId)
      return { ...r, credits: course?.credits ?? 0, name: course?.name ?? r.courseId }
    })
    const credits = rows.reduce((s, r) => s + r.credits, 0)
    const quality = rows.reduce((s, r) => s + r.credits * r.points, 0)
    return { credits, gpa: credits ? quality / credits : 0 }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Registered Results</h2>
          <p className="text-sm text-slate-500">Your grades for registered courses (mock data)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Cumulative GPA: <span className="font-bold text-slate-900">{cumulative.gpa.toFixed(2)}</span>
          <span className="ml-2 text-xs text-slate-400">•</span>
          <span className="ml-2 text-xs text-slate-500">{cumulative.credits} credits</span>
        </div>
      </div>

      {bySemester.map(({ semester, rows }) => {
        const enriched = rows.map((r) => {
          const course = COURSE_POOL.find((c) => c.id === r.courseId)
          return {
            ...r,
            name: course?.name ?? r.courseId,
            credits: course?.credits ?? 0,
          }
        })

        const totalCredits = enriched.reduce((s, r) => s + r.credits, 0)
        const totalQuality = enriched.reduce((s, r) => s + r.credits * r.points, 0)
        const gpa = totalCredits ? totalQuality / totalCredits : 0

        return (
          <div key={semester} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">{semester}</h3>
              <span className="text-xs text-slate-500">Semester GPA: {gpa.toFixed(2)}</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Course Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Credits</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Grade</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enriched.map((r) => (
                    <tr key={`${semester}-${r.courseId}`} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{r.courseId}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{r.name}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{r.credits}</td>
                      <td className={cn("px-4 py-3 text-sm text-center font-bold", gradeClass(r.grade))}>{r.grade}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{r.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState<TabKey>("courses")

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Courses</h1>
        <p className="mt-2 text-sm text-gray-600">Browse course catalog, plan next semester, and view registered results</p>
      </div>

      {/* Tab Selector */}
      <div className="mb-6">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {TABS.map((tab) => {
            const active = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
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

      {/* Tab Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === "courses" && <CoursesPoolView />}
        {activeTab === "planner" && <PlannerView />}
        {activeTab === "results" && <ResultsView />}
      </div>
    </div>
  )
}
