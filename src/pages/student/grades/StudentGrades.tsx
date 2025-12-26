"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { ChevronDown, X, Calculator, GraduationCap, Sun, Flower2 } from "lucide-react"

type SemesterType = "fall" | "summer" | "spring"
type Year = "2024" | "2023" | "2022"
type SemesterId = `${SemesterType}-${Year}`

// Current semester that hasn't been graded yet
const CURRENT_SEMESTER: SemesterId = "fall-2024"

type CourseRow = {
  code: string
  name: string
  credits: number
  grade: string
  points: number
}

type GradeKey =
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F"
  | "—"

const GRADE_SCALE: GradeKey[] = ["—", "F", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A"]

const GRADE_POINTS: Record<Exclude<GradeKey, "—">, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
}

const YEARS: Year[] = ["2024", "2023", "2022"]

const SEMESTER_TYPES: Array<{ type: SemesterType; label: string; icon: React.ReactNode }> = [
  { type: "fall", label: "Fall", icon: <GraduationCap className="h-4 w-4" /> },
  { type: "summer", label: "Summer", icon: <Sun className="h-4 w-4" /> },
  { type: "spring", label: "Spring", icon: <Flower2 className="h-4 w-4" /> },
]

const DATA: Partial<Record<SemesterId, CourseRow[]>> = {
  "fall-2024": [
    { code: "CS101", name: "Advanced Mathematics", credits: 3, grade: "-", points: 0 },
    { code: "CS102", name: "Data Structures", credits: 4, grade: "-", points: 0 },
    { code: "CS103", name: "Algorithms", credits: 4, grade: "-", points: 0 },
    { code: "EN101", name: "English Literature", credits: 3, grade: "-", points: 0 },
    { code: "PH101", name: "Physics Lab", credits: 2, grade: "-", points: 0 },
  ],
  "summer-2024": [
    { code: "CS095", name: "Web Development", credits: 3, grade: "A", points: 4.0 },
    { code: "CS096", name: "Database Systems", credits: 3, grade: "A-", points: 3.7 },
  ],
  "spring-2024": [
    { code: "CS091", name: "Programming Fundamentals", credits: 3, grade: "A-", points: 3.7 },
    { code: "MA090", name: "Discrete Mathematics", credits: 3, grade: "B+", points: 3.3 },
    { code: "EN090", name: "Academic Writing", credits: 3, grade: "A", points: 4.0 },
    { code: "PH090", name: "Intro Physics", credits: 3, grade: "B", points: 3.0 },
  ],
  "fall-2023": [
    { code: "CS081", name: "Intro to Computing", credits: 3, grade: "A", points: 4.0 },
    { code: "MA081", name: "Calculus I", credits: 4, grade: "B+", points: 3.3 },
    { code: "EN081", name: "English Composition", credits: 3, grade: "A-", points: 3.7 },
  ],
  "summer-2023": [],
  "spring-2023": [
    { code: "MA071", name: "Pre-Calculus", credits: 3, grade: "A", points: 4.0 },
    { code: "EN071", name: "Basic Writing", credits: 3, grade: "A", points: 4.0 },
  ],
}

function gradeClass(grade: string) {
  if (grade === "-") return "text-slate-400"
  if (grade.startsWith("A")) return "text-emerald-600"
  if (grade.startsWith("B")) return "text-blue-600"
  return "text-slate-700"
}

function format2(n: number) {
  return n.toFixed(2)
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function calcGpaFromPoints(rows: CourseRow[], pointsMap: Record<string, number | null>) {
  let credits = 0
  let quality = 0
  for (const r of rows) {
    const pts = pointsMap[r.code]
    if (pts == null) continue
    credits += r.credits
    quality += r.credits * pts
  }
  return credits ? quality / credits : 0
}

function Gauge({
  value,
  label,
  color = "#3B82F6",
}: {
  value: number
  label: string
  color?: string
}) {
  const v = clamp(value, 0, 4)
  const percent = v / 4

  const r = 64
  const cx = 80
  const cy = 80
  const circumference = Math.PI * r
  const dash = circumference * percent
  const gap = circumference - dash

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="160" height="95" viewBox="0 0 160 95" className="block">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
        />
      </svg>

      <div className="-mt-8 text-center">
        <div className="text-3xl font-semibold text-slate-700">{format2(v)}</div>
        <div className="mt-1 text-[11px] tracking-wide text-slate-400">{label.toUpperCase()}</div>
      </div>
    </div>
  )
}

function GradePill({
  grade,
  active,
  onClick,
}: {
  grade: GradeKey
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-8 w-8 rounded-full border text-xs font-semibold transition",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-slate-500 border-slate-300 hover:border-slate-400 hover:text-slate-700",
      ].join(" ")}
      aria-pressed={active}
      title={grade === "—" ? "No grade" : grade}
    >
      {grade}
    </button>
  )
}

export default function StudentGrades() {
  const [selectedYear, setSelectedYear] = useState<Year>("2024")
  const [selectedSemesterType, setSelectedSemesterType] = useState<SemesterType>("fall")
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [showEstimator, setShowEstimator] = useState(false)

  const semester: SemesterId = `${selectedSemesterType}-${selectedYear}`
  const rows = DATA[semester] || []
  const isCurrentSemester = semester === CURRENT_SEMESTER
  const currentSemesterRows = DATA[CURRENT_SEMESTER] || []

  // === estimator state (only for current semester) ===
  const [predicted, setPredicted] = useState<Record<string, GradeKey>>(() => {
    const init: Record<string, GradeKey> = {}
    for (const r of currentSemesterRows) {
      init[r.code] = "—"
    }
    return init
  })

  const totalCreditsThisSemester = useMemo(
    () => rows.reduce((sum, r) => sum + r.credits, 0),
    [rows]
  )

  // Calculate GPA for past semesters (not current)
  const semesterGpa = useMemo(() => {
    if (isCurrentSemester) return 0
    const totalQuality = rows.reduce((sum, r) => sum + r.credits * r.points, 0)
    const totalCredits = rows.reduce((sum, r) => sum + r.credits, 0)
    return totalCredits ? totalQuality / totalCredits : 0
  }, [rows, isCurrentSemester])

  // Build maps for GPA estimator (current semester only)
  const estimatedPointsMap = useMemo(() => {
    const m: Record<string, number | null> = {}
    for (const r of currentSemesterRows) {
      const g = predicted[r.code] ?? "—"
      if (!g || g === "—") {
        m[r.code] = null
      } else {
        m[r.code] = GRADE_POINTS[g as Exclude<GradeKey, "—">]
      }
    }
    return m
  }, [currentSemesterRows, predicted])

  const estimatedGpa = useMemo(() => calcGpaFromPoints(currentSemesterRows, estimatedPointsMap), [currentSemesterRows, estimatedPointsMap])

  // Mock cumulative GPA / credits (replace with real data later)
  // These represent GPA and credits BEFORE the current semester
  const cumulativeGpa = 3.85
  const priorCredits = 115 // Credits earned before current semester
  const currentSemesterCredits = currentSemesterRows.reduce((sum, r) => sum + r.credits, 0)
  const displayCredits = isCurrentSemester ? currentSemesterCredits : totalCreditsThisSemester

  // Calculate NEW cumulative GPA if estimated grades are applied
  const newCumulativeGpa = useMemo(() => {
    if (estimatedGpa <= 0) return 0
    // Weighted average: (priorGPA × priorCredits + semesterGPA × semesterCredits) / totalCredits
    const totalCredits = priorCredits + currentSemesterCredits
    return (cumulativeGpa * priorCredits + estimatedGpa * currentSemesterCredits) / totalCredits
  }, [estimatedGpa, currentSemesterCredits])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Grades</h1>
        <p className="mt-2 text-sm text-gray-600">View your academic performance and grades</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 shadow-sm">
          <div className="text-sm text-slate-700">Semester GPA</div>
          <div className="mt-4 text-4xl font-bold text-slate-900">
            {isCurrentSemester ? "—" : format2(semesterGpa)}
          </div>
          <div className="mt-6 text-sm text-slate-600">
            {isCurrentSemester ? "In Progress" : "Semester Average"}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/60 p-6 shadow-sm">
          <div className="text-sm text-slate-700">Total Credits</div>
          <div className="mt-4 text-4xl font-bold text-slate-900">{displayCredits}</div>
          <div className="mt-6 text-sm text-slate-600">This Semester</div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 shadow-sm">
          <div className="text-sm text-slate-700">Cumulative GPA</div>
          <div className="mt-4 text-4xl font-bold text-slate-900">{format2(cumulativeGpa)}</div>
          <div className="mt-6 text-sm text-slate-600">All Semesters</div>
        </div>
      </div>

      {/* Semester Selector + Table / Grade Estimator - Swappable Card */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!showEstimator ? (
          /* ─────────────── Semester Selector + Table View ─────────────── */
          <>
            <div className="p-6 pb-0">
              <div className="mb-4">
                <div className="text-base font-semibold text-slate-900">Select Semester</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Semester Type Buttons - Pill style with icons */}
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                  {SEMESTER_TYPES.map((s) => {
                    const active = s.type === selectedSemesterType
                    return (
                      <button
                        key={s.type}
                        type="button"
                        onClick={() => setSelectedSemesterType(s.type)}
                        className={[
                          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                          active
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {s.icon}
                        {s.label}
                      </button>
                    )
                  })}
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    {selectedYear}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {yearDropdownOpen && (
                    <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-[100px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {YEARS.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => {
                            setSelectedYear(year)
                            setYearDropdownOpen(false)
                          }}
                          className={[
                            "w-full px-4 py-2 text-left text-sm transition",
                            year === selectedYear
                              ? "bg-blue-50 font-semibold text-blue-900"
                              : "text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grade Estimator Button */}
                <button
                  type="button"
                  onClick={() => setShowEstimator(true)}
                  className="ml-auto flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Calculator className="h-4 w-4" />
                  Grade Estimator
                </button>
              </div>
            </div>

            {/* Grades Table */}
            <div className="p-6">
              {rows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-500">No courses found for this semester.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">Course Code</th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">Course Name</th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">Credits</th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">Grade</th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">Points</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {rows.map((r) => (
                        <tr key={r.code} className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 text-sm text-slate-500">{r.code}</td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-900">{r.name}</td>
                          <td className="px-5 py-4 text-sm text-slate-900">{r.credits}</td>
                          <td className={`px-5 py-4 text-sm font-semibold ${gradeClass(r.grade)}`}>{r.grade}</td>
                          <td className="px-5 py-4 text-sm text-slate-900">
                            {r.grade === "-" ? "-" : r.points.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ─────────────── Grade Estimator View ─────────────── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">GPA Estimator</h2>
                  <p className="text-xs text-slate-500">Estimate your GPA for Fall 2024</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEstimator(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Gauges row */}
            {(() => {
              const hasEstimate = estimatedGpa > 0
              // Change is based on NEW cumulative vs OLD cumulative (properly weighted)
              const change = hasEstimate ? newCumulativeGpa - cumulativeGpa : 0
              const isPositive = change > 0.001 // Small threshold to handle floating point
              const isNegative = change < -0.001

              return (
                <div className="grid grid-cols-1 items-center gap-6 px-6 py-6 md:grid-cols-3">
                  <div className="flex justify-center md:justify-start">
                    <Gauge value={cumulativeGpa} label="Cumulative" color="#6B7280" />
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated Change</div>
                      <div className={`mt-2 text-2xl font-bold ${
                        !hasEstimate ? "text-slate-400" :
                        isPositive ? "text-emerald-600" :
                        isNegative ? "text-red-500" :
                        "text-slate-600"
                      }`}>
                        {!hasEstimate ? "—" :
                         isPositive ? `+${format2(change)}` :
                         isNegative ? format2(change) :
                         "0.00"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-end">
                    <Gauge value={hasEstimate ? newCumulativeGpa : 0} label="Estimated" color="#3B82F6" />
                  </div>
                </div>
              )
            })()}

            {/* Course estimator rows */}
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {currentSemesterRows.map((r) => {
                const selected = predicted[r.code] ?? "—"
                const pts = selected === "—" ? null : GRADE_POINTS[selected as Exclude<GradeKey, "—">]

                return (
                  <div
                    key={r.code}
                    className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 text-sm text-slate-500">
                        <span className="font-semibold text-slate-700">{r.code}</span>
                        <span>{r.credits} Cr.</span>
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-900">{r.name}</div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <div className="flex flex-wrap justify-end gap-2">
                        {GRADE_SCALE.map((g) => (
                          <GradePill
                            key={g}
                            grade={g}
                            active={g === selected}
                            onClick={() =>
                              setPredicted((prev) => ({
                                ...prev,
                                [r.code]: g,
                              }))
                            }
                          />
                        ))}
                      </div>

                      <div className="w-14 text-right text-sm font-semibold text-blue-600">
                        {pts != null ? pts.toFixed(2) : "—"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Transcript */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
        <div className="text-xl font-bold text-slate-900">Transcript</div>
        <p className="mt-2 text-sm text-slate-600">Download or print your official transcript</p>

        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          onClick={() => alert("Transcript request submitted (demo).")}
        >
          Request Transcript
        </button>
      </div>
    </div>
  )
}
