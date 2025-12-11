import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student, StudentStatus } from './studentData';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export default function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- form state ----------
  // Basic
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Personal
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');

  // Enrollment
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');

  // Guardian – just use first guardian for now
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Academics
  const [gpa, setGpa] = useState('');
  const [subjects, setSubjects] = useState('');
  const [lastExamScore, setLastExamScore] = useState('');
  const [remarks, setRemarks] = useState('');

  // Attendance
  const [totalDays, setTotalDays] = useState('');
  const [presentDays, setPresentDays] = useState('');
  const [lastAbsentDate, setLastAbsentDate] = useState('');

  // Finance
  const [feePlan, setFeePlan] = useState('');
  const [totalDue, setTotalDue] = useState('');
  const [totalPaid, setTotalPaid] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [lastPaymentDate, setLastPaymentDate] = useState('');
  const [scholarship, setScholarship] = useState('');

  // Health
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyInstructions, setEmergencyInstructions] = useState('');

  // System
  const [portalUsername, setPortalUsername] = useState('');
  const [portalActive, setPortalActive] = useState(true);
  const [rfidCardId, setRfidCardId] = useState('');

  // ---------- Load existing student from backend ----------
  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load student');
        }

        const s: Student = data.student;
        setStudent(s);

        // Prefill form from fetched student
        setStudentId(s.studentId);
        setFirstName(s.firstName);
        setLastName(s.lastName);
        setEmail(s.email ?? '');

        setGender(s.gender ?? '');
        setDateOfBirth(s.dateOfBirth ?? '');
        setPhone(s.phone ?? '');
        setAddress(s.address ?? '');
        setLanguage(s.language ?? '');

        setGrade(s.enrollment?.grade ?? '');
        setSection(s.enrollment?.section ?? '');
        setStatus((s.enrollment?.status as StudentStatus) ?? 'active');

        const primaryGuardian = s.guardians?.[0];
        setGuardianName(primaryGuardian?.name ?? '');
        setGuardianPhone(primaryGuardian?.phone ?? '');

        setGpa(
          s.academics?.gpa != null ? String(s.academics.gpa) : '',
        );
        setSubjects(
          (s.academics?.currentSubjects || []).join(', '),
        );
        setLastExamScore(
          s.academics?.lastExamScore != null
            ? String(s.academics.lastExamScore)
            : '',
        );
        setRemarks(s.academics?.remarks ?? '');

        setTotalDays(
          s.attendance?.totalDays != null
            ? String(s.attendance.totalDays)
            : '',
        );
        setPresentDays(
          s.attendance?.presentDays != null
            ? String(s.attendance.presentDays)
            : '',
        );
        setLastAbsentDate(s.attendance?.lastAbsentDate ?? '');

        setFeePlan(s.finance?.feePlan ?? '');
        setTotalDue(
          s.finance?.totalDue != null
            ? String(s.finance.totalDue)
            : '',
        );
        setTotalPaid(
          s.finance?.totalPaid != null
            ? String(s.finance.totalPaid)
            : '',
        );
        setOutstanding(
          s.finance?.outstanding != null
            ? String(s.finance.outstanding)
            : '',
        );
        setLastPaymentDate(s.finance?.lastPaymentDate ?? '');
        setScholarship(s.finance?.scholarship ?? '');

        setAllergies(s.health?.allergies ?? '');
        setMedicalNotes(s.health?.medicalNotes ?? '');
        setEmergencyInstructions(
          s.health?.emergencyInstructions ?? '',
        );

        setPortalUsername(s.system?.portalUsername ?? '');
        setPortalActive(s.system?.portalActive ?? true);
        setRfidCardId(s.system?.rfidCardId ?? '');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load student');
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!student) return;

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
      ...student,
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

      // enrollment: {
      //   ...(student.enrollment || {}),
      //   grade,
      //   section: section || undefined,
      //   status,
      // },

      academics: {
        ...(student.academics || {}),
        gpa: gpa ? Number(gpa) : undefined,
        currentSubjects: subjects
          ? subjects
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        lastExamScore: lastExamScore ? Number(lastExamScore) : undefined,
        remarks,
      },

      attendance: {
        ...(student.attendance || {}),
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
        ...(student.finance || {}),
        feePlan,
        totalDue: totalDue ? Number(totalDue) : undefined,
        totalPaid: totalPaid ? Number(totalPaid) : undefined,
        outstanding: outstanding ? Number(outstanding) : undefined,
        lastPaymentDate: lastPaymentDate || undefined,
        scholarship,
      },

      health: {
        ...(student.health || {}),
        allergies,
        medicalNotes,
        emergencyInstructions,
      },

      system: {
        ...(student.system || {}),
        portalUsername,
        portalActive,
        rfidCardId,
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(updatedStudent),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update student');
      }

      navigate(`/admin/students/${student.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update student');
    }
  }

  // ---------- Loading / error states ----------
  if (loading) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/students')}
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
          onClick={() => navigate('/admin/students')}
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

  // ---------- Main form ----------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/admin/students/${student.id}`)}
        >
          ← Back to Student Detail
        </Button>
        <h1 className="text-xl font-semibold">
          Edit Student – {student.firstName} {student.lastName}
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
              onClick={() => navigate(`/admin/students/${student.id}`)}
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
