import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Student,
  StudentStatus,
  loadStudents,
  saveStudents,
} from './studentData';

export default function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // load existing student
  const existing = loadStudents().find((s) => s.id === id);

  // --- if not found, show simple error ---
  if (!existing) {
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
          <p className="text-sm text-red-600">Student not found.</p>
        </Card>
      </div>
    );
  }

  // ---------- form state (pre-filled from existing) ----------
  // Basic
  const [studentId, setStudentId] = useState(existing.studentId);
  const [firstName, setFirstName] = useState(existing.firstName);
  const [lastName, setLastName] = useState(existing.lastName);
  const [email, setEmail] = useState(existing.email ?? '');

  // Personal
  const [gender, setGender] = useState(existing.gender ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(existing.dateOfBirth ?? '');
  const [phone, setPhone] = useState(existing.phone ?? '');
  const [address, setAddress] = useState(existing.address ?? '');
  const [language, setLanguage] = useState(existing.language ?? '');

  // Enrollment
  const [grade, setGrade] = useState(existing.enrollment.grade);
  const [section, setSection] = useState(existing.enrollment.section ?? '');
  const [status, setStatus] = useState<StudentStatus>(
    existing.enrollment.status,
  );

  // Guardian – just use first guardian for now
  const primaryGuardian = existing.guardians[0];
  const [guardianName, setGuardianName] = useState(
    primaryGuardian?.name ?? '',
  );
  const [guardianPhone, setGuardianPhone] = useState(
    primaryGuardian?.phone ?? '',
  );

  // Academics
  const [gpa, setGpa] = useState(
    existing.academics.gpa != null ? String(existing.academics.gpa) : '',
  );
  const [subjects, setSubjects] = useState(
    (existing.academics.currentSubjects || []).join(', '),
  );
  const [lastExamScore, setLastExamScore] = useState(
    existing.academics.lastExamScore != null
      ? String(existing.academics.lastExamScore)
      : '',
  );
  const [remarks, setRemarks] = useState(existing.academics.remarks ?? '');

  // Attendance
  const [totalDays, setTotalDays] = useState(
    existing.attendance.totalDays != null
      ? String(existing.attendance.totalDays)
      : '',
  );
  const [presentDays, setPresentDays] = useState(
    existing.attendance.presentDays != null
      ? String(existing.attendance.presentDays)
      : '',
  );
  const [lastAbsentDate, setLastAbsentDate] = useState(
    existing.attendance.lastAbsentDate ?? '',
  );

  // Finance
  const [feePlan, setFeePlan] = useState(existing.finance?.feePlan ?? '');
  const [totalDue, setTotalDue] = useState(
    existing.finance?.totalDue != null ? String(existing.finance.totalDue) : '',
  );
  const [totalPaid, setTotalPaid] = useState(
    existing.finance?.totalPaid != null
      ? String(existing.finance.totalPaid)
      : '',
  );
  const [outstanding, setOutstanding] = useState(
    existing.finance?.outstanding != null
      ? String(existing.finance.outstanding)
      : '',
  );
  const [lastPaymentDate, setLastPaymentDate] = useState(
    existing.finance?.lastPaymentDate ?? '',
  );
  const [scholarship, setScholarship] = useState(
    existing.finance?.scholarship ?? '',
  );

  // Health
  const [allergies, setAllergies] = useState(
    existing.health?.allergies ?? '',
  );
  const [medicalNotes, setMedicalNotes] = useState(
    existing.health?.medicalNotes ?? '',
  );
  const [emergencyInstructions, setEmergencyInstructions] = useState(
    existing.health?.emergencyInstructions ?? '',
  );

  // System
  const [portalUsername, setPortalUsername] = useState(
    existing.system?.portalUsername ?? '',
  );
  const [portalActive, setPortalActive] = useState(
    existing.system?.portalActive ?? true,
  );
  const [rfidCardId, setRfidCardId] = useState(
    existing.system?.rfidCardId ?? '',
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!studentId || !firstName || !lastName || !grade) {
      alert('Please fill ID, first name, last name and grade.');
      return;
    }

    const totalDaysNum = totalDays ? Number(totalDays) : undefined;
    const presentDaysNum = presentDays ? Number(presentDays) : undefined;
    const attendancePercentage =
      totalDaysNum && presentDaysNum
        ? Number(((presentDaysNum / totalDaysNum) * 100).toFixed(1))
        : undefined;

    const updatedStudent: Student = {
      ...existing,
      studentId,
      firstName,
      lastName,
      email,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      phone,
      address,
      language,

      guardians: guardianName
        ? [
            {
              name: guardianName,
              relationship: 'Parent',
              phone: guardianPhone || '-',
              isEmergencyContact: true,
            },
          ]
        : [],

      enrollment: {
        ...existing.enrollment,
        grade,
        section: section || undefined,
        status,
      },

      academics: {
        ...existing.academics,
        gpa: gpa ? Number(gpa) : undefined,
        currentSubjects: subjects
          ? subjects.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        lastExamScore: lastExamScore ? Number(lastExamScore) : undefined,
        remarks,
      },

      attendance: {
        ...existing.attendance,
        totalDays: totalDaysNum,
        presentDays: presentDaysNum,
        absentDays:
          totalDaysNum && presentDaysNum
            ? totalDaysNum - presentDaysNum
            : undefined,
        attendancePercentage,
        lastAbsentDate: lastAbsentDate || undefined,
      },

      finance: {
        ...(existing.finance || {}),
        feePlan,
        totalDue: totalDue ? Number(totalDue) : undefined,
        totalPaid: totalPaid ? Number(totalPaid) : undefined,
        outstanding: outstanding ? Number(outstanding) : undefined,
        lastPaymentDate: lastPaymentDate || undefined,
        scholarship,
      },

      health: {
        ...(existing.health || {}),
        allergies,
        medicalNotes,
        emergencyInstructions,
      },

      system: {
        ...(existing.system || {}),
        portalUsername,
        portalActive,
        rfidCardId,
      },
    };

    const current = loadStudents();
    const updatedList = current.map((s) =>
      s.id === existing.id ? updatedStudent : s,
    );
    saveStudents(updatedList);

    navigate(`/school-admin/students/${existing.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/school-admin/students/${existing.id}`)}
        >
          ← Back to Student Detail
        </Button>
        <h1 className="text-xl font-semibold">
          Edit Student – {existing.firstName} {existing.lastName}
        </h1>
      </div>

      <Card padding="lg">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* BASIC */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Student ID *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </Field>
              <Field label="First Name *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>
              <Field label="Last Name *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* PERSONAL */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Personal Details</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Gender">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">—</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Date of Birth">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Languages">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </Field>
              <Field label="Address">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* ENROLLMENT */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Enrollment</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Grade *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </Field>
              <Field label="Section">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </Field>
              <Field label="Status">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StudentStatus)}
                >
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </Field>
            </div>
          </section>

          {/* GUARDIAN */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">
              Parent / Guardian (optional)
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Guardian Name">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </Field>
              <Field label="Guardian Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* ACADEMICS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Academics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="GPA">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                />
              </Field>
              <Field label="Last Exam Score">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastExamScore}
                  onChange={(e) => setLastExamScore(e.target.value)}
                />
              </Field>
              <Field label="Subjects (comma separated)">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Teacher Remarks">
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm"
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Field>
          </section>

          {/* ATTENDANCE */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Attendance</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Total Days">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={totalDays}
                  onChange={(e) => setTotalDays(e.target.value)}
                />
              </Field>
              <Field label="Present Days">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={presentDays}
                  onChange={(e) => setPresentDays(e.target.value)}
                />
              </Field>
              <Field label="Last Absent Date">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastAbsentDate}
                  onChange={(e) => setLastAbsentDate(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* FINANCE */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Finance</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Fee Plan">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={feePlan}
                  onChange={(e) => setFeePlan(e.target.value)}
                />
              </Field>
              <Field label="Total Due">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={totalDue}
                  onChange={(e) => setTotalDue(e.target.value)}
                />
              </Field>
              <Field label="Total Paid">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={totalPaid}
                  onChange={(e) => setTotalPaid(e.target.value)}
                />
              </Field>
              <Field label="Outstanding">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={outstanding}
                  onChange={(e) => setOutstanding(e.target.value)}
                />
              </Field>
              <Field label="Last Payment Date">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastPaymentDate}
                  onChange={(e) => setLastPaymentDate(e.target.value)}
                />
              </Field>
              <Field label="Scholarship / Discount">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={scholarship}
                  onChange={(e) => setScholarship(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* HEALTH */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Health</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Allergies">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </Field>
              <Field label="Medical Notes">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Emergency Instructions">
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm"
                rows={2}
                value={emergencyInstructions}
                onChange={(e) => setEmergencyInstructions(e.target.value)}
              />
            </Field>
          </section>

          {/* SYSTEM */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">System Access</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Portal Username">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalUsername}
                  onChange={(e) => setPortalUsername(e.target.value)}
                />
              </Field>
              <Field label="Portal Active">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalActive ? 'true' : 'false'}
                  onChange={(e) => setPortalActive(e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </Field>
              <Field label="RFID / Card ID">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={rfidCardId}
                  onChange={(e) => setRfidCardId(e.target.value)}
                />
              </Field>
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/school-admin/students/${existing.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1 text-sm">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}
