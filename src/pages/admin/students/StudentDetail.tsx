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
    case 'graduated':
      return 'bg-blue-100 text-blue-800';
    case 'transferred':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-200 text-slate-700';
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

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // this ref will be used to capture the layout for PDF
  const reportRef = useRef<HTMLDivElement | null>(null);

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/school-admin/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) {
          throw new Error(`Failed to load students (${resp.status})`);
        }
        const data = await resp.json();

        // Try to find by multiple possible id fields
        const found = (Array.isArray(data) ? data : data?.items || []).find((s: any) => {
          const sid = s.id || s._id || s.userID || s.userId || s.studentId;
          return sid === id;
        });

        if (!found) {
          setError('Student not found.');
          setLoading(false);
          return;
        }

        const details = found.studentDetails || found.details || {};

        // Normalize to the shape used in the UI below
        const normalized = {
          id: found.id || found._id || found.userID || found.userId || found.studentId,
          firstName:
            found.firstName || (found.email ? found.email.split('@')[0] : 'Student'),
          lastName: found.lastName || '',
          email: found.email || details.email || '',
          dateOfBirth: details.dateOfBirth || '',
          gender: details.gender || '',
          phone: details.phone || '',
          address: details.address || '',
          language: details.language || '',
          guardians: Array.isArray(details.guardians) ? details.guardians : [],
          enrollment: {
            admissionDate:
              (details.enrollment && details.enrollment.admissionDate) || found.createdAt || '',
            grade: (details.enrollment && details.enrollment.grade) || '',
            section: (details.enrollment && details.enrollment.section) || '',
            status:
              (details.enrollment && details.enrollment.status) || found.status || 'active',
            homeroomTeacher:
              (details.enrollment && details.enrollment.homeroomTeacher) || '',
          },
          academics: {
            gpa:
              details.academics && details.academics.gpa != null
                ? Number(details.academics.gpa)
                : null,
            currentSubjects:
              details.academics && Array.isArray(details.academics.currentSubjects)
                ? details.academics.currentSubjects
                : [],
            lastExamScore:
              details.academics && details.academics.lastExamScore != null
                ? Number(details.academics.lastExamScore)
                : null,
            remarks:
              (details.academics && details.academics.remarks) || '',
          },
          attendance: {
            totalDays:
              details.attendance && details.attendance.totalDays != null
                ? Number(details.attendance.totalDays)
                : null,
            presentDays:
              details.attendance && details.attendance.presentDays != null
                ? Number(details.attendance.presentDays)
                : null,
            absentDays:
              details.attendance && details.attendance.absentDays != null
                ? Number(details.attendance.absentDays)
                : null,
            attendancePercentage:
              details.attendance && details.attendance.attendancePercentage != null
                ? Number(details.attendance.attendancePercentage)
                : null,
            lastAbsentDate:
              (details.attendance && details.attendance.lastAbsentDate) || null,
          },
          health: details.health || {},
          finance: details.finance || {},
          system: details.system || {},
          documents: Array.isArray(details.documents) ? details.documents : [],
          studentId: found.studentId || found.userID || found.userId || found.id || '',
        };

        setStudent(normalized);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load student');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/students')}>
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm">Loading student…</p>
        </Card>
      </div>
    );
  }

  if (!student || error) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/students')}>
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">{error || 'Student not found.'}</p>
        </Card>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const status = student.enrollment.status;
  const classLabel = `${student.enrollment.grade}${
    student.enrollment.section ? `-${student.enrollment.section}` : ''
  }`;

  const gpa = student.academics.gpa ?? null;
  const attendance = student.attendance.attendancePercentage ?? null;
  const outstanding = student.finance?.outstanding ?? null;

  // -------- PDF DOWNLOAD HANDLER --------
  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;

    // capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // keep aspect ratio, scale to fit on a single A4 page
    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2; // center horizontally
    const y = 0;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    const fileName = `${student.firstName}-${student.lastName}-Report.pdf`.replace(
      /\s+/g,
      '-',
    );

    pdf.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/students')}>
          ← Back to Students
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={() => navigate(`/school-admin/students/${student.id}/edit`)}
          >
            Edit
          </Button>

          <Button
            type="button"
            className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={async () => {
              const ok = window.confirm('Are you sure you want to delete this student?');
              if (!ok) return;
              const token = getAuthToken();
              if (!token) {
                alert('Authentication required.');
                return;
              }
              try {
                const resp = await fetch(`${API_BASE_URL}/api/school-admin/users/${student.id}`, {
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
                navigate('/school-admin/students');
              } catch (err: any) {
                alert(err?.message || 'Failed to delete student');
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

      {/* Everything inside this wrapper will appear in the PDF */}
      <div ref={reportRef}>
        {/* HERO CARD */}
        <Card padding="none" className="overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {/* Simple avatar circle */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-semibold uppercase">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold leading-tight">{fullName}</h1>
                  <p className="text-xs md:text-sm text-sky-100">
                    Class <span className="font-medium">{classLabel}</span> • Homeroom{' '}
                    {student.enrollment.homeroomTeacher ?? '—'}
                  </p>
                  <p className="mt-1 text-[11px] md:text-xs text-sky-100">
                    Admitted on {student.enrollment.admissionDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                    status,
                  )} bg-opacity-90`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
                  ID: {student.studentId}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
                  Grade {student.enrollment.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Summary stats row */}
          <div className="grid gap-3 border-b bg-slate-50 px-4 py-3 text-sm md:grid-cols-3">
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  GPA
                </p>
                <p className="text-lg font-semibold">
                  {gpa !== null ? gpa.toFixed(2) : '—'}
                </p>
              </div>
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Attendance
                </p>
                <p className="text-lg font-semibold">
                  {attendance !== null ? `${attendance.toFixed(1)}%` : '—'}
                </p>
              </div>
              <span className="text-2xl">📅</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Outstanding Fees
                </p>
                <p className="text-lg font-semibold">
                  {outstanding !== null ? `$${outstanding.toLocaleString()}` : '—'}
                </p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>

          {/* BODY SECTIONS */}
          <div className="space-y-6 px-6 py-6">
            {/* GRID: left column = student + parents, right = academics/finance */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)]">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* Personal & Contact */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Personal & Contact</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Date of Birth" value={student.dateOfBirth} />
                    <InfoItem label="Gender" value={student.gender} />
                    <InfoItem label="Phone" value={student.phone} />
                    <InfoItem label="Email" value={student.email} />
                    <InfoItem
                      label="Languages"
                      value={student.language}
                      className="md:col-span-2"
                    />
                    <InfoItem
                      label="Address"
                      value={student.address}
                      className="md:col-span-2"
                    />
                  </div>
                </section>

                {/* Parents / Guardians */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Parents / Guardians</h2>
                  <div className="mt-3 space-y-2 text-sm">
                    {student.guardians.map((g, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border bg-white px-3 py-2 text-xs md:text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">
                            {g.name}{' '}
                            <span className="text-[11px] uppercase tracking-wide text-slate-500">
                              • {g.relationship}
                            </span>
                          </p>
                          {g.isEmergencyContact && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                              Emergency
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          Phone: {g.phone}
                          {g.email ? ` • Email: ${g.email}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Health */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Health</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Allergies" value={student.health?.allergies} />
                    <InfoItem label="Medical Notes" value={student.health?.medicalNotes} />
                    <InfoItem
                      label="Emergency Instructions"
                      value={student.health?.emergencyInstructions}
                      className="md:col-span-2"
                    />
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* Academics & Attendance */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Academics & Attendance</h2>
                    {student.academics.remarks && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                        Teacher note
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem
                      label="GPA"
                      value={gpa !== null ? gpa.toFixed(2) : undefined}
                    />
                    <InfoItem
                      label="Last Exam Score"
                      value={
                        student.academics.lastExamScore != null
                          ? String(student.academics.lastExamScore)
                          : undefined
                      }
                    />
                    <InfoItem
                      label="Attendance %"
                      value={
                        attendance !== null ? `${attendance.toFixed(1)}%` : undefined
                      }
                    />
                    <InfoItem
                      label="Last Absent"
                      value={student.attendance.lastAbsentDate}
                    />
                    <InfoItem
                      label="Current Subjects"
                      value={student.academics.currentSubjects.join(', ')}
                      className="md:col-span-2"
                    />
                    {student.academics.remarks && (
                      <InfoItem
                        label="Teacher Remarks"
                        value={student.academics.remarks}
                        className="md:col-span-2"
                      />
                    )}
                  </div>
                </section>

                {/* Finance */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">Finance</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Fee Plan" value={student.finance?.feePlan} />
                    <InfoItem
                      label="Outstanding"
                      value={
                        student.finance?.outstanding != null
                          ? `$${student.finance.outstanding.toLocaleString()}`
                          : undefined
                      }
                    />
                    <InfoItem
                      label="Total Paid"
                      value={
                        student.finance?.totalPaid != null
                          ? `$${student.finance.totalPaid.toLocaleString()}`
                          : undefined
                      }
                    />
                    <InfoItem
                      label="Last Payment"
                      value={student.finance?.lastPaymentDate}
                    />
                    <InfoItem
                      label="Scholarship / Discount"
                      value={student.finance?.scholarship}
                      className="md:col-span-2"
                    />
                  </div>
                </section>

                {/* System & Documents */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold">System & Documents</h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem
                      label="Portal Username"
                      value={student.system?.portalUsername}
                    />
                    <InfoItem
                      label="Portal Status"
                      value={
                        student.system?.portalActive == null
                          ? undefined
                          : student.system.portalActive
                          ? 'Active'
                          : 'Disabled'
                      }
                    />
                    <InfoItem label="RFID / Card ID" value={student.system?.rfidCardId} />
                    <div className="md:col-span-2">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Documents
                      </p>
                      <ul className="mt-2 space-y-1">
                        {(student.documents ?? []).map((doc, idx) => (
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
                        {(student.documents ?? []).length === 0 && (
                          <li className="text-xs text-slate-500">
                            No documents recorded.
                          </li>
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
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-900">{value && value !== '' ? value : '—'}</p>
    </div>
  );
}
