import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function statusClasses(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'on_leave':
      return 'bg-amber-100 text-amber-800';
    case 'resigned':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'on_leave':
      return 'On Leave';
    case 'resigned':
      return 'Resigned';
    default:
      return status;
  }
}

function employmentTypeLabel(type: string) {
  switch (type) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'visiting':
      return 'Visiting';
    default:
      return type;
  }
}

// Retrieve JWT token from localStorage persisted store
const getAuthToken = (): string | null => {
  const authData = localStorage.getItem('auth-storage');
  if (!authData) return null;
  try {
    const parsed = JSON.parse(authData);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement | null>(null);

  const [teacher, setTeacher] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    const fetchTeacher = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/school-admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          throw new Error(`Failed to load teachers (${resp.status})`);
        }
        const data = await resp.json();
        const found = (Array.isArray(data) ? data : data?.items || []).find((t: any) => {
          const tid = t.id || t._id || t.userID || t.userId || t.teacherId;
          return tid === id;
        });
        if (!found) {
          setError('Teacher not found.');
          setLoading(false);
          return;
        }

        const details = found.teacherDetails || found.details || {};

        const normalized = {
          id: found.id || found._id || found.userID || found.userId || found.teacherId,
          firstName:
            found.firstName || (found.email ? found.email.split('@')[0] : 'Teacher'),
          lastName: found.lastName || '',
          email: found.email || details.email || '',
          phone: details.phone || '',
          gender: details.gender || '',
          dateOfBirth: details.dateOfBirth || '',
          address: details.address || '',
          department: details.department || found.department || '',
          status: found.status || details.status || 'active',
          office: details.office || '',
          officeHours: details.officeHours || '',
          emergencyContact: details.emergencyContact || undefined,
          employment: {
            type: (details.employment && details.employment.type) || 'full_time',
            role: (details.employment && details.employment.role) || 'Teacher',
            joinDate: (details.employment && details.employment.joinDate) || found.createdAt || '',
            qualifications:
              (details.employment && details.employment.qualifications) || [],
            yearsOfExperience:
              details.employment && details.employment.yearsOfExperience != null
                ? Number(details.employment.yearsOfExperience)
                : 0,
            teachingLicense:
              (details.employment && details.employment.teachingLicense) || '',
            salaryGrade: (details.employment && details.employment.salaryGrade) || '',
            contractStart: (details.employment && details.employment.contractStart) || undefined,
            contractEnd: (details.employment && details.employment.contractEnd) || undefined,
          },
          teaching: {
            assignedCourses:
              (details.teaching && details.teaching.assignedCourses) || [],
            totalSections:
              details.teaching && details.teaching.totalSections != null
                ? Number(details.teaching.totalSections)
                : 0,
            totalStudents:
              details.teaching && details.teaching.totalStudents != null
                ? Number(details.teaching.totalStudents)
                : 0,
            weeklyHours:
              details.teaching && details.teaching.weeklyHours != null
                ? Number(details.teaching.weeklyHours)
                : 0,
            academicTerm: (details.teaching && details.teaching.academicTerm) || 'Fall 2024',
          },
          operations: {
            attendanceSubmissionRate:
              details.operations && details.operations.attendanceSubmissionRate != null
                ? Number(details.operations.attendanceSubmissionRate)
                : 0,
            gradingProgress:
              (details.operations && details.operations.gradingProgress) || {
                midterm: 0,
                final: 0,
              },
            pendingTasks:
              details.operations && details.operations.pendingTasks != null
                ? Number(details.operations.pendingTasks)
                : 0,
            lateSubmissions:
              details.operations && details.operations.lateSubmissions != null
                ? Number(details.operations.lateSubmissions)
                : 0,
          },
          leave: {
            sickLeaveBalance:
              details.leave && details.leave.sickLeaveBalance != null
                ? Number(details.leave.sickLeaveBalance)
                : 10,
            casualLeaveBalance:
              details.leave && details.leave.casualLeaveBalance != null
                ? Number(details.leave.casualLeaveBalance)
                : 7,
            requests: (details.leave && details.leave.requests) || [],
          },
          system: details.system || {},
          documents: Array.isArray(details.documents) ? details.documents : [],
          teacherId: found.teacherId || found.userID || found.userId || found.id || '',
        };

        setTeacher(normalized);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load teacher');
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/teachers')}>
          ← Back to Teachers
        </Button>
        <Card padding="lg">
          <p className="text-sm">Loading teacher…</p>
        </Card>
      </div>
    );
  }

  if (!teacher || error) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/teachers')}>
          ← Back to Teachers
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">{error || 'Teacher not found.'}</p>
        </Card>
      </div>
    );
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const status = teacher.status;

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    const fileName = `${teacher.firstName}-${teacher.lastName}-Report.pdf`.replace(/\s+/g, '-');
    pdf.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/teachers')}>
          ← Back to Teachers
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={() => navigate(`/school-admin/teachers/${teacher.id}/edit`)}
          >
            Edit
          </Button>

          <Button
            type="button"
            className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={async () => {
              const ok = window.confirm('Are you sure you want to delete this teacher?');
              if (!ok) return;
              const token = getAuthToken();
              if (!token) {
                alert('Authentication required.');
                return;
              }
              try {
                const resp = await fetch(`${API_BASE_URL}/api/school-admin/users/${teacher.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) {
                  let msg = `Delete failed (${resp.status})`;
                  try {
                    const errData = await resp.json();
                    if (errData?.error) msg = errData.error;
                  } catch {}
                  throw new Error(msg);
                }
                navigate('/school-admin/teachers');
              } catch (err: any) {
                alert(err?.message || 'Failed to delete teacher');
              }
            }}
          >
            Delete
          </Button>

          <Button
            type="button"
            className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div ref={reportRef}>
        {/* HERO CARD */}
        <Card padding="none" className="overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-semibold uppercase">
                  {teacher.firstName[0]}
                  {teacher.lastName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold leading-tight">{fullName}</h1>
                  <p className="text-xs md:text-sm text-emerald-100">
                    {teacher.department} • {teacher.employment.role}
                  </p>
                  <p className="mt-1 text-[11px] md:text-xs text-emerald-100">
                    Joined on {teacher.employment.joinDate} • Office: {teacher.office ?? '—'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                    status
                  )} bg-opacity-90`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {statusLabel(status)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
                  ID: {teacher.teacherId}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
                  {employmentTypeLabel(teacher.employment.type)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary stats row */}
          <div className="grid gap-3 border-b bg-slate-50 px-4 py-3 text-sm md:grid-cols-4">
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Courses
                </p>
                <p className="text-lg font-semibold">{teacher.teaching.assignedCourses.length}</p>
              </div>
              <span className="text-2xl">📘</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Student Load
                </p>
                <p className="text-lg font-semibold">{teacher.teaching.totalStudents}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Pending Tasks
                </p>
                <p className="text-lg font-semibold">{teacher.operations.pendingTasks}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Attendance Rate
                </p>
                <p className="text-lg font-semibold">{teacher.operations.attendanceSubmissionRate}%</p>
              </div>
              <span className="text-2xl">📅</span>
            </div>
          </div>

          {/* BODY SECTIONS */}
          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* Personal & Contact */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Personal & Contact</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Date of Birth" value={teacher.dateOfBirth} />
                    <InfoItem label="Gender" value={teacher.gender} />
                    <InfoItem label="Phone" value={teacher.phone} />
                    <InfoItem label="Email" value={teacher.email} />
                    <InfoItem label="Address" value={teacher.address} className="md:col-span-2" />
                    {teacher.emergencyContact && (
                      <InfoItem
                        label="Emergency Contact"
                        value={`${teacher.emergencyContact.name} (${teacher.emergencyContact.relationship}) - ${teacher.emergencyContact.phone}`}
                        className="md:col-span-2"
                      />
                    )}
                  </div>
                </section>

                {/* Employment Details */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Employment Details</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Employment Type" value={employmentTypeLabel(teacher.employment.type)} />
                    <InfoItem label="Role" value={teacher.employment.role} />
                    <InfoItem label="Join Date" value={teacher.employment.joinDate} />
                    <InfoItem label="Years of Experience" value={String(teacher.employment.yearsOfExperience)} />
                    {teacher.employment.contractStart && (
                      <InfoItem label="Contract Period" value={`${teacher.employment.contractStart} - ${teacher.employment.contractEnd ?? 'Ongoing'}`} />
                    )}
                    <InfoItem label="Salary Grade" value={teacher.employment.salaryGrade} />
                    <InfoItem label="Teaching License" value={teacher.employment.teachingLicense} />
                    <InfoItem
                      label="Qualifications"
                      value={teacher.employment.qualifications.join(', ')}
                      className="md:col-span-2"
                    />
                  </div>
                </section>

                {/* Leave & Availability */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Leave & Availability</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Office Hours" value={teacher.officeHours} />
                    <InfoItem label="Sick Leave Balance" value={`${teacher.leave.sickLeaveBalance} days`} />
                    <InfoItem label="Casual Leave Balance" value={`${teacher.leave.casualLeaveBalance} days`} />
                  </div>
                  {teacher.leave.requests.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Recent Leave Requests
                      </p>
                      <ul className="mt-2 space-y-1">
                        {teacher.leave.requests.map((req, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-xs"
                          >
                            <span>
                              {req.type}: {req.startDate} - {req.endDate}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                req.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* Teaching Assignment */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Teaching Assignment</h2>
                    <span className="text-xs text-slate-500">{teacher.teaching.academicTerm}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <InfoItem label="Total Sections" value={String(teacher.teaching.totalSections)} />
                    <InfoItem label="Total Students" value={String(teacher.teaching.totalStudents)} />
                    <InfoItem label="Weekly Hours" value={`${teacher.teaching.weeklyHours} hrs`} />
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Assigned Courses
                    </p>
                    <div className="mt-2 space-y-2">
                      {teacher.teaching.assignedCourses.map((course, idx) => (
                        <div
                          key={idx}
                          className="rounded-md border bg-white px-3 py-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">
                              {course.courseCode} - {course.courseName}
                            </p>
                            <span className="text-slate-500">
                              {course.sections} sections • {course.students} students
                            </span>
                          </div>
                          {course.schedule && (
                            <p className="mt-1 text-slate-500">{course.schedule}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Performance & Compliance */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Performance & Compliance</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem
                      label="Attendance Marked (30 days)"
                      value={`${teacher.operations.attendanceSubmissionRate}%`}
                    />
                    <InfoItem label="Late Submissions" value={String(teacher.operations.lateSubmissions)} />
                    <InfoItem
                      label="Midterm Grading"
                      value={`${teacher.operations.gradingProgress.midterm}%`}
                    />
                    <InfoItem
                      label="Final Grading"
                      value={`${teacher.operations.gradingProgress.final}%`}
                    />
                    <InfoItem label="Pending Tasks" value={String(teacher.operations.pendingTasks)} />
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-2">
                      Grading Progress
                    </p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Midterm</span>
                          <span>{teacher.operations.gradingProgress.midterm}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${teacher.operations.gradingProgress.midterm}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Final</span>
                          <span>{teacher.operations.gradingProgress.final}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${teacher.operations.gradingProgress.final}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* System & Documents */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">System & Documents</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Portal Username" value={teacher.system?.portalUsername} />
                    <InfoItem
                      label="Portal Status"
                      value={
                        teacher.system?.portalActive == null
                          ? undefined
                          : teacher.system.portalActive
                          ? 'Active'
                          : 'Disabled'
                      }
                    />
                    <InfoItem label="Last Login" value={teacher.system?.lastLogin} />
                    <InfoItem
                      label="2FA Enabled"
                      value={teacher.system?.twoFactorEnabled ? 'Yes' : 'No'}
                    />
                    <InfoItem label="Staff QR ID" value={teacher.system?.staffQrId} />
                    <div className="md:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Documents
                      </p>
                      <ul className="mt-2 space-y-1">
                        {(teacher.documents ?? []).map((doc, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-xs"
                          >
                            <span>{doc.type}</span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                doc.uploaded
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {doc.uploaded ? 'Uploaded' : 'Missing'}
                            </span>
                          </li>
                        ))}
                        {(teacher.documents ?? []).length === 0 && (
                          <li className="text-xs text-slate-500">No documents recorded.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value?: string | null;
  className?: string;
}

function InfoItem({ label, value, className }: InfoItemProps) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900">{value && value !== '' ? value : '—'}</p>
    </div>
  );
}
