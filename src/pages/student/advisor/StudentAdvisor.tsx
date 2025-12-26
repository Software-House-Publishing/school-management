"use client"

import React from "react"
import { Card } from "@/components/ui/Card"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquareText,
  ClipboardCheck,
  Layers,
  GraduationCap,
  BookOpen,
} from "lucide-react"

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

type StatusTone = "success" | "warning" | "neutral"

function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone
  children: React.ReactNode
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
      : tone === "warning"
        ? "bg-amber-100 text-amber-800 ring-amber-200"
        : "bg-gray-100 text-gray-700 ring-gray-200"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        toneClasses,
      )}
    >
      {children}
    </span>
  )
}

function ActionButton({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-gray-300 hover:shadow"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gray-50 text-gray-700 group-hover:bg-gray-100">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </button>
  )
}

export default function StudentAdvisor() {
  const advisor = {
    name: "Dr. Sarah Mitchell",
    title: "Academic Advisor",
    bio:
      "Dr. Sarah Mitchell is an experienced academic advisor with over 10 years of experience in helping students achieve their academic goals. She specializes in Computer Science programs and has helped numerous students plan their curriculum.",
    email: "sarah.mitchell@scitech.edu",
    phone: "+1-234-567-8901",
    office: "Building A, Room 302",
    officeHours: [
      "Monday: 2:00 PM - 4:00 PM",
      "Wednesday: 1:00 PM - 3:00 PM",
      "Friday: 10:00 AM - 12:00 PM",
    ],
    expertise: [
      "Computer Science",
      "Course Planning",
      "Career Development",
      "Academic Regulations",
    ],
  }

  const approvals = [
    {
      title: "Pre-registration",
      subtitle: "Spring 2025",
      tone: "success" as const,
      status: "Approved",
      body: "You are cleared to pre-register for spring semester courses.",
    },
    {
      title: "Course Load",
      subtitle: "18 Credits Requested",
      tone: "warning" as const,
      status: "Pending",
      body: "Request is under review. You'll be notified within 3 business days.",
    },
    {
      title: "Academic Standing",
      subtitle: "Overall Performance",
      tone: "success" as const,
      status: "Good",
      body: "You are in good academic standing with no restrictions.",
    },
    {
      title: "Major Change",
      subtitle: "Status",
      tone: "neutral" as const,
      status: "Not Requested",
      body: "Contact your advisor if you wish to change your major.",
    },
  ]

  const notes = [
    {
      date: "2024-01-10",
      text: "Discussed spring semester course selection. Approved for full course load.",
    },
    {
      date: "2024-01-05",
      text: "Met to review fall semester performance. GPA is strong. Keep up the work!",
    },
    {
      date: "2023-12-15",
      text: "Pre-registration approval granted for spring 2025.",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Academic Advisor
        </h1>
        <p className="mt-1 text-gray-600">
          Connect with your advisor and manage approvals
        </p>
      </div>

      {/* Advisor Overview */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-12">
          {/* Left */}
          <div className="md:col-span-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                <GraduationCap className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {advisor.name}
                </h2>
                <p className="mt-1 font-semibold text-blue-700">
                  {advisor.title}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-prose text-sm leading-6 text-gray-600">
              {advisor.bio}
            </p>
          </div>

          {/* Middle */}
          <div className="space-y-5 md:col-span-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                <Mail className="h-4 w-4 text-gray-500" />
                {advisor.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                <Phone className="h-4 w-4 text-gray-500" />
                {advisor.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Office
              </p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                <MapPin className="h-4 w-4 text-gray-500" />
                {advisor.office}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-4">
            <p className="text-sm font-bold text-gray-900">Office Hours</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {advisor.officeHours.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-gray-500" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              onClick={() => {
                // TODO: open message modal / route to messaging
              }}
            >
              <MessageSquareText className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>
      </Card>

      {/* Areas of Expertise */}
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Areas of Expertise
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {advisor.expertise.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Approval Status */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Approval Status
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {approvals.map((a) => (
            <Card
              key={a.title}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {a.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{a.subtitle}</p>
                  </div>

                  <StatusPill tone={a.tone}>{a.status}</StatusPill>
                </div>

                <p className="mt-6 text-sm text-gray-600">{a.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Advisor Notes */}
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Recent Advisor Notes
          </h3>

          <div className="mt-4 divide-y divide-gray-100">
            {notes.map((n) => (
              <div key={n.date} className="py-4 first:pt-0 last:pb-0">
                <p className="text-sm text-gray-500">{n.date}</p>
                <p className="mt-2 text-sm text-gray-900">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Quick Actions
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ActionButton
              title="Request Major Change"
              icon={<Layers className="h-5 w-5" />}
              onClick={() => {
                // TODO: route to major change request
              }}
            />
            <ActionButton
              title="Request Course Overload"
              icon={<BookOpen className="h-5 w-5" />}
              onClick={() => {
                // TODO: route to course overload request
              }}
            />
            <ActionButton
              title="Schedule Appointment"
              icon={<Clock className="h-5 w-5" />}
              onClick={() => {
                // TODO: open scheduling flow
              }}
            />
            <ActionButton
              title="View Academic Plan"
              icon={<ClipboardCheck className="h-5 w-5" />}
              onClick={() => {
                // TODO: route to academic plan
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
