"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import {
  User2,
  GraduationCap,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Lock,
  FileText,
  Clock,
  Globe,
  BadgeCheck,
  HeartHandshake,
  Trophy,
  Users,
  BookOpen,
  Info,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"

type TabKey = "academic" | "personal" | "contact"

const TABS: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "academic", label: "Academic", icon: <GraduationCap className="h-4 w-4" /> },
  { key: "personal", label: "Personal", icon: <User2 className="h-4 w-4" /> },
  { key: "contact", label: "Contact", icon: <Mail className="h-4 w-4" /> },
]

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

type InfoRow = { label: string; value: string | number; icon?: ReactNode }

function InfoTable({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full">
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.label} className="hover:bg-slate-50/60">
              <td className="w-1/3 px-4 py-3 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  {r.icon && <span className="text-slate-400">{r.icon}</span>}
                  {r.label}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-900">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
  right,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */

type StudentData = {
  studentId: string
  fullName: string
  email: string
  personalEmail: string
  phone: string
  address: string
  emergencyContact: string
  department: string
  faculty: string
  program: string
  year: string
  semester: string
  gpa: number
  credits: number
  academicStatus: string
  dateOfBirth: string
  gender: string
  nationality: string
  nationalId: string
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tab Views
───────────────────────────────────────────────────────────────────────────── */

function AcademicView({ student }: { student: StudentData }) {
  const academicRows: InfoRow[] = [
    { label: "Student ID", value: student.studentId },
    { label: "Faculty", value: student.faculty },
    { label: "Department", value: student.department },
    { label: "Program", value: student.program },
    { label: "Year", value: student.year },
    { label: "G.P.A.", value: student.gpa.toFixed(2) },
    { label: "Credits Earned", value: student.credits },
    { label: "Academic Status", value: student.academicStatus },
  ]

  return (
    <div className="space-y-6">
      <Section title="Academic Information" subtitle="Your enrollment and academic standing details">
        <InfoTable rows={academicRows} />
      </Section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-4">
          <div className="text-sm text-slate-600">Cumulative GPA</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{student.gpa.toFixed(2)}</div>
          <div className="mt-1 text-xs text-emerald-600">Good Standing</div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/60 p-4">
          <div className="text-sm text-slate-600">Credits Earned</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{student.credits}</div>
          <div className="mt-1 text-xs text-blue-600">of 144 required</div>
        </div>

        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100/60 p-4">
          <div className="text-sm text-slate-600">Current Year</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{student.year}</div>
          <div className="mt-1 text-xs text-violet-600">{student.semester}</div>
        </div>
      </div>
    </div>
  )
}

function PersonalView({ student }: { student: StudentData }) {
  const personalRows: InfoRow[] = [
    { label: "Full Name", value: student.fullName, icon: <User2 className="h-4 w-4" /> },
    { label: "Date of Birth", value: student.dateOfBirth, icon: <Calendar className="h-4 w-4" /> },
    { label: "Gender", value: student.gender },
    { label: "Nationality", value: student.nationality },
    { label: "National ID", value: student.nationalId },
  ]

  return (
    <div className="space-y-6">
      <Section title="Personal Information" subtitle="Your personal details and identification">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User2 className="h-8 w-8" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">{student.fullName}</div>
              <div className="text-sm text-slate-500">{student.studentId}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Shield className="h-3 w-3" />
                  Active Student
                </span>
              </div>
            </div>
          </div>
        </div>

        <InfoTable rows={personalRows} />
      </Section>

      <Section title="Account Security" subtitle="Manage your password and security settings">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Password</div>
                <div className="text-xs text-slate-500">Last changed 30 days ago</div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Change Password
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ✅ Card style like your screenshot */
type ServiceColor = "orange" | "blue" | "emerald" | "violet" | "rose" | "cyan" | "amber" | "indigo"

type Service = {
  title: string
  desc: string
  location: string
  phone: string
  email: string
  hours: string
  icon: ReactNode
  color: ServiceColor
}

const COLOR_STYLES: Record<ServiceColor, { border: string; bg: string; iconBg: string; iconText: string; accent: string }> = {
  orange: {
    border: "border-orange-200",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
    accent: "text-orange-500",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    accent: "text-blue-500",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    accent: "text-emerald-500",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    accent: "text-violet-500",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    accent: "text-rose-500",
  },
  cyan: {
    border: "border-cyan-200",
    bg: "bg-gradient-to-br from-cyan-50 to-sky-50",
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    accent: "text-cyan-500",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    accent: "text-amber-500",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    accent: "text-indigo-500",
  },
}

function ServiceCard({ s }: { s: Service }) {
  const colors = COLOR_STYLES[s.color]

  return (
    <div className={cn("rounded-xl border p-4", colors.border, colors.bg)}>
      <div className="mb-3 flex items-start gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colors.iconBg, colors.iconText)}>
          {s.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{s.title}</div>
          <div className="text-xs text-slate-600">{s.desc}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className={cn("h-4 w-4", colors.accent)} />
          <span className="text-slate-700">{s.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className={cn("h-4 w-4", colors.accent)} />
          <span className="text-slate-700">{s.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className={cn("h-4 w-4", colors.accent)} />
          <span className="text-slate-700">{s.email}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        <span>{s.hours}</span>
      </div>
    </div>
  )
}

function ContactView({
  student,
  isEditing,
  onEditField,
  onToggleEdit,
  onSave,
}: {
  student: StudentData
  isEditing: boolean
  onEditField: (field: string, value: string) => void
  onToggleEdit: () => void
  onSave: () => void
}) {
  const contactRows: InfoRow[] = [
    { label: "University Email", value: student.email, icon: <Mail className="h-4 w-4" /> },
    { label: "Personal Email", value: student.personalEmail, icon: <Mail className="h-4 w-4" /> },
    { label: "Phone", value: student.phone, icon: <Phone className="h-4 w-4" /> },
    { label: "Address", value: student.address, icon: <MapPin className="h-4 w-4" /> },
    { label: "Emergency Contact", value: student.emergencyContact, icon: <Phone className="h-4 w-4" /> },
  ]

  const services: Service[] = [
    {
      title: "Registrar Office",
      desc: "For transcripts, enrollment verification, and official letters",
      location: "Building A, Room 101",
      phone: "+66 2 123 4567",
      email: "registrar@au.edu",
      hours: "Office Hours: Mon–Fri, 8:30 AM – 4:30 PM",
      icon: <FileText className="h-5 w-5" />,
      color: "orange",
    },
    {
      title: "Visa & Immigration Support",
      desc: "Visa letters, extension guidance, immigration documents",
      location: "Building C, Room 203",
      phone: "+66 2 234 5678",
      email: "visa@au.edu",
      hours: "Office Hours: Mon–Fri, 9:00 AM – 4:00 PM",
      icon: <Globe className="h-5 w-5" />,
      color: "blue",
    },
    {
      title: "Advisor Office",
      desc: "Academic planning, course advice, graduation audit",
      location: "Building B, Room 110",
      phone: "+66 2 345 6789",
      email: "advising@au.edu",
      hours: "Office Hours: Mon–Fri, 9:00 AM – 5:00 PM",
      icon: <HeartHandshake className="h-5 w-5" />,
      color: "emerald",
    },
    {
      title: "Clubs & Communities",
      desc: "Join clubs, volunteering, leadership programs",
      location: "Student Center, 2nd Floor",
      phone: "+66 2 456 7890",
      email: "clubs@au.edu",
      hours: "Office Hours: Mon–Fri, 10:00 AM – 6:00 PM",
      icon: <Users className="h-5 w-5" />,
      color: "violet",
    },
    {
      title: "Sports & Events",
      desc: "Sport events schedule, tickets, facility booking",
      location: "Sports Complex, Front Desk",
      phone: "+66 2 567 8901",
      email: "sports@au.edu",
      hours: "Office Hours: Daily, 8:00 AM – 8:00 PM",
      icon: <Trophy className="h-5 w-5" />,
      color: "amber",
    },
    {
      title: "Student Information Helpdesk",
      desc: "Profile corrections, ID card, portal access issues",
      location: "Admin Building, Room 015",
      phone: "+66 2 678 9012",
      email: "helpdesk@au.edu",
      hours: "Office Hours: Mon–Fri, 8:30 AM – 4:30 PM",
      icon: <Info className="h-5 w-5" />,
      color: "cyan",
    },
    {
      title: "Library & Learning Support",
      desc: "Workshops, study rooms, writing support",
      location: "Library, Ground Floor",
      phone: "+66 2 789 0123",
      email: "library@au.edu",
      hours: "Office Hours: Mon–Sat, 9:00 AM – 7:00 PM",
      icon: <BookOpen className="h-5 w-5" />,
      color: "indigo",
    },
    {
      title: "Certificates & Letters",
      desc: "Student status certificate, internship letters",
      location: "Registrar Annex, Room 07",
      phone: "+66 2 890 1234",
      email: "certificates@au.edu",
      hours: "Office Hours: Mon–Fri, 8:30 AM – 4:30 PM",
      icon: <BadgeCheck className="h-5 w-5" />,
      color: "rose",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contact Information block (editable) */}
      <Section
        title="Contact Information"
        subtitle="How to reach you and your emergency contact"
        right={
          <button
            type="button"
            onClick={() => (isEditing ? onSave() : onToggleEdit())}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              isEditing
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
            )}
          >
            {isEditing ? (
              <>
                <Shield className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit
              </>
            )}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">University Email</div>
                <div className="text-sm font-medium text-slate-900">{student.email}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone Number</div>
                <div className="text-sm font-medium text-slate-900">{student.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="text-sm font-medium text-blue-900">Edit Contact Information</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Personal Email</label>
                <input
                  type="email"
                  value={student.personalEmail}
                  onChange={(e) => onEditField("personalEmail", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
                <input
                  type="tel"
                  value={student.phone}
                  onChange={(e) => onEditField("phone", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Address</label>
                <input
                  type="text"
                  value={student.address}
                  onChange={(e) => onEditField("address", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Emergency Contact</label>
                <input
                  type="text"
                  value={student.emergencyContact}
                  onChange={(e) => onEditField("emergencyContact", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <InfoTable rows={contactRows} />
        )}
      </Section>

      {/* Document Services (separate + scrollable, ~4 visible) */}
      <Section title="Document Services" subtitle="Where to request official documents and transcripts">
        <div
          className={cn(
            "rounded-xl border border-slate-200 bg-white p-4",
            // shows roughly 4 cards and then scroll
            "max-h-[460px] overflow-y-auto pr-2",
          )}
        >
          <div className="space-y-3">
            {services.map((s) => (
              <ServiceCard key={s.title} s={s} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main
───────────────────────────────────────────────────────────────────────────── */

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState<TabKey>("academic")
  const [isEditingContact, setIsEditingContact] = useState(false)
  const { user } = useAuthStore()

  const [studentData, setStudentData] = useState<StudentData>({
    studentId: "STU-2400001",
    fullName: user ? `${user.firstName} ${user.lastName}` : "John Doe",
    email: user?.email || "student@au.edu",
    personalEmail: "john.doe@gmail.com",
    phone: "+66 81 234 5678",
    address: "123 University Road, Bangkok 10400",
    emergencyContact: "+66 81 999 8888 (Parent)",
    department: "Computer Science",
    faculty: "Science and Technology",
    program: "Bachelor of Science in Computer Science",
    year: "3rd Year",
    semester: "Fall 2024",
    gpa: 3.85,
    credits: 115,
    academicStatus: "Good Standing",
    dateOfBirth: "January 15, 2002",
    gender: "Male",
    nationality: "Thai",
    nationalId: "1-1234-56789-01-2",
  })

  const handleEditField = (field: string, value: string) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveContact = () => {
    // send updated studentData to API here
    setIsEditingContact(false)
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
        <p className="mt-2 text-sm text-gray-600">View your academic and personal information</p>
      </div>

      {/* Tabs (NO global edit button now) */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {TABS.map((tab) => {
            const active = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)
                  setIsEditingContact(false)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === "academic" && <AcademicView student={studentData} />}
        {activeTab === "personal" && <PersonalView student={studentData} />}
        {activeTab === "contact" && (
          <ContactView
            student={studentData}
            isEditing={isEditingContact}
            onEditField={handleEditField}
            onToggleEdit={() => setIsEditingContact(true)}
            onSave={handleSaveContact}
          />
        )}
      </div>
    </div>
  )
}
