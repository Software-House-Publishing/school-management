import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserDetail } from '@/components/shared/users/UserDetail';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student } from './studentData';
// import { useAuthStore } from '@/stores/authStore';
import { fetchMockStudentById, deleteMockStudent } from '@/utils/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''; // Unused now

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

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { token } = useAuthStore(); // Unused

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // this ref will be used to capture the layout for PDF
  const reportRef = useRef<HTMLDivElement | null>(null);

  // ...

  // 👉 Load student from backend
  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;
      // if (!token) ... (Mock doesn't check token strictly but ok to keep check if needed, 
      // but for "User Request" to fix error, let's allow it to work easily)

      try {
        setLoading(true);
        setError(null);

        const data = await fetchMockStudentById(id);
        setStudent(data);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load student');
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  // -------- DELETE HANDLER (calls backend) --------
  const handleDelete = async () => {
    if (!student || !id) return;
    const ok = window.confirm('Are you sure you want to delete this student?');
    if (!ok) return;

    try {
      await deleteMockStudent(id);
      navigate('/school-admin/students');
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  // -------- PDF DOWNLOAD HANDLER --------
  const handleDownloadReport = async () => {
    if (!reportRef.current || !student) return;

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

  // ------- LOADING / ERROR / NOT FOUND STATES -------
  if (loading) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/students')}
        >
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm text-muted-foreground">Loading student...</p>
        </Card>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/students')}
        >
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">
            {error || 'Student not found.'}
          </p>
        </Card>
      </div>
    );
  }

  // ------- MAIN DETAIL RENDER -------

  const fullName = `${student.firstName} ${student.lastName}`;
  const status = student.enrollment?.status ?? 'active';
  const classLabel = `${student.enrollment?.grade ?? ''}${student.enrollment?.section ? `-${student.enrollment.section}` : ''
    }`;

  const gpa = student.academics?.gpa ?? null;
  const attendance = student.attendance?.attendancePercentage ?? null;
  const outstanding = student.finance?.outstanding ?? null;

  return (
    <UserDetail
      onBack={() => navigate('/school-admin/students')}
      onEdit={() => id && navigate(`/school-admin/students/${id}/edit`)}
      onDelete={handleDelete}
      onDownloadReport={handleDownloadReport}
    >
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
                    {student.enrollment?.homeroomTeacher ?? '—'}
                  </p>
                  <p className="mt-1 text-[11px] md:text-xs text-sky-100">
                    Admitted on {student.enrollment?.admissionDate}
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
                  Grade {student.enrollment?.grade}
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
                    {(student.guardians ?? []).map((g, idx) => (
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
                    {(student.guardians ?? []).length === 0 && (
                      <p className="text-xs text-slate-500">No guardians recorded.</p>
                    )}
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
                    {student.academics?.remarks && (
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
                        student.academics?.lastExamScore != null
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
                      value={student.attendance?.lastAbsentDate}
                    />
                    <InfoItem
                      label="Current Subjects"
                      value={(student.academics?.currentSubjects ?? []).join(', ')}
                      className="md:col-span-2"
                    />
                    {student.academics?.remarks && (
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
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${doc.uploaded
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
    </UserDetail>
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
      <p className="mt-0.5 text-sm text-slate-900">
        {value && value !== '' ? value : '—'}
      </p>
    </div>
  );
}
