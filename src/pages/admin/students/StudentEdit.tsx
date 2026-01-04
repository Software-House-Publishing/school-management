import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StudentStatus } from './studentData';

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

export default function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [existing, setExisting] = useState<any | null>(null);
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error(`Failed to load students (${resp.status})`);
        const data = await resp.json();
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
        const normalized = {
          id: found.id || found._id || found.userID || found.userId || found.studentId,
          firstName: found.firstName || '',
          lastName: found.lastName || '',
          email: found.email || details.email || '',
          dateOfBirth: details.dateOfBirth || '',
          gender: details.gender || '',
          phone: details.phone || '',
          address: details.address || '',
          language: details.language || '',
          guardians: Array.isArray(details.guardians) ? details.guardians : [],
          enrollment: {
            grade: (details.enrollment && details.enrollment.grade) || '',
            section: (details.enrollment && details.enrollment.section) || '',
            status: (details.enrollment && details.enrollment.status) || found.status || 'active',
            admissionDate: (details.enrollment && details.enrollment.admissionDate) || '',
          },
          academics: {
            gpa:
              details.academics && details.academics.gpa != null
                ? String(details.academics.gpa)
                : '',
            currentSubjects:
              details.academics && Array.isArray(details.academics.currentSubjects)
                ? details.academics.currentSubjects
                : [],
            lastExamScore:
              details.academics && details.academics.lastExamScore != null
                ? String(details.academics.lastExamScore)
                : '',
            remarks: (details.academics && details.academics.remarks) || '',
          },
          attendance: {
            totalDays:
              details.attendance && details.attendance.totalDays != null
                ? String(details.attendance.totalDays)
                : '',
            presentDays:
              details.attendance && details.attendance.presentDays != null
                ? String(details.attendance.presentDays)
                : '',
            absentDays:
              details.attendance && details.attendance.absentDays != null
                ? String(details.attendance.absentDays)
                : '',
            attendancePercentage:
              details.attendance && details.attendance.attendancePercentage != null
                ? String(details.attendance.attendancePercentage)
                : '',
            lastAbsentDate:
              (details.attendance && details.attendance.lastAbsentDate) || '',
          },
          finance: details.finance || {},
          health: details.health || {},
          system: details.system || {},
          documents: Array.isArray(details.documents) ? details.documents : [],
          studentId: found.studentId || found.userID || found.userId || found.id || '',
        } as any;
        setExisting(normalized);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load student');
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  // ---------- form state ----------
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [gpa, setGpa] = useState('');
  const [subjects, setSubjects] = useState('');
  const [lastExamScore, setLastExamScore] = useState('');
  const [remarks, setRemarks] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [presentDays, setPresentDays] = useState('');
  const [lastAbsentDate, setLastAbsentDate] = useState('');
  const [feePlan, setFeePlan] = useState('');
  const [totalDue, setTotalDue] = useState('');
  const [totalPaid, setTotalPaid] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [lastPaymentDate, setLastPaymentDate] = useState('');
  const [scholarship, setScholarship] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyInstructions, setEmergencyInstructions] = useState('');
  const [portalUsername, setPortalUsername] = useState('');
  const [portalActive, setPortalActive] = useState(true);
  const [rfidCardId, setRfidCardId] = useState('');

  useEffect(() => {
    if (!existing) return;
    setStudentId(existing.studentId || existing.id || '');
    setFirstName(existing.firstName || '');
    setLastName(existing.lastName || '');
    setEmail(existing.email ?? '');

    setGender(existing.gender ?? '');
    setDateOfBirth(existing.dateOfBirth ?? '');
    setPhone(existing.phone ?? '');
    setAddress(existing.address ?? '');
    setLanguage(existing.language ?? '');

    setGrade(existing.enrollment?.grade ?? '');
    setSection(existing.enrollment?.section ?? '');
    setStatus(existing.enrollment?.status ?? 'active');

    const primaryGuardian = (existing.guardians || [])[0] || null;
    setGuardianName(primaryGuardian?.name ?? '');
    setGuardianPhone(primaryGuardian?.phone ?? '');

    setGpa(existing.academics?.gpa != null ? String(existing.academics.gpa) : '');
    setSubjects(
      Array.isArray(existing.academics?.currentSubjects)
        ? existing.academics.currentSubjects.join(', ')
        : ''
    );
    setLastExamScore(
      existing.academics?.lastExamScore != null
        ? String(existing.academics.lastExamScore)
        : ''
    );
    setRemarks(existing.academics?.remarks ?? '');

    setTotalDays(
      existing.attendance?.totalDays != null ? String(existing.attendance.totalDays) : ''
    );
    setPresentDays(
      existing.attendance?.presentDays != null ? String(existing.attendance.presentDays) : ''
    );
    setLastAbsentDate(existing.attendance?.lastAbsentDate ?? '');

    setFeePlan(existing.finance?.feePlan ?? '');
    setTotalDue(existing.finance?.totalDue != null ? String(existing.finance.totalDue) : '');
    setTotalPaid(existing.finance?.totalPaid != null ? String(existing.finance.totalPaid) : '');
    setOutstanding(
      existing.finance?.outstanding != null ? String(existing.finance.outstanding) : ''
    );
    setLastPaymentDate(existing.finance?.lastPaymentDate ?? '');
    setScholarship(existing.finance?.scholarship ?? '');

    setAllergies(existing.health?.allergies ?? '');
    setMedicalNotes(existing.health?.medicalNotes ?? '');
    setEmergencyInstructions(existing.health?.emergencyInstructions ?? '');

    setPortalUsername(existing.system?.portalUsername ?? '');
    setPortalActive(
      existing.system?.portalActive == null ? true : Boolean(existing.system.portalActive)
    );
    setRfidCardId(existing.system?.rfidCardId ?? '');
  }, [existing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert('Please fill first name and last name.');
      return;
    }

    const totalDaysNum = totalDays ? Number(totalDays) : undefined;
    const presentDaysNum = presentDays ? Number(presentDays) : undefined;
    const attendancePercentage =
      totalDaysNum && presentDaysNum
        ? Number(((presentDaysNum / totalDaysNum) * 100).toFixed(1))
        : undefined;

    const token = getAuthToken();
    if (!token) {
      alert('Authentication required.');
      return;
    }
    if (!existing?.id) {
      alert('Student data not loaded yet. Please wait and try again.');
      return;
    }

    const studentDetails: any = {
      phone: phone || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      address: address || undefined,
      language: language || undefined,
      guardians:
        guardianName
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
        grade: grade || undefined,
        section: section || undefined,
        status,
      },
      academics: {
        gpa: gpa ? Number(gpa) : undefined,
        currentSubjects: subjects
          ? subjects.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        lastExamScore: lastExamScore ? Number(lastExamScore) : undefined,
        remarks,
      },
      attendance: {
        totalDays: totalDaysNum,
        presentDays: presentDaysNum,
        absentDays:
          totalDaysNum && presentDaysNum ? totalDaysNum - presentDaysNum : undefined,
        attendancePercentage,
        lastAbsentDate: lastAbsentDate || undefined,
      },
      finance: {
        feePlan,
        totalDue: totalDue ? Number(totalDue) : undefined,
        totalPaid: totalPaid ? Number(totalPaid) : undefined,
        outstanding: outstanding ? Number(outstanding) : undefined,
        lastPaymentDate: lastPaymentDate || undefined,
        scholarship,
      },
      health: {
        allergies,
        medicalNotes,
        emergencyInstructions,
      },
      system: {
        portalUsername,
        portalActive,
        rfidCardId,
      },
    };

    try {
      const payload: any = { status, studentDetails };
      // Include top-level name/email updates if provided
      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (email) payload.email = email;

      const resp = await fetch(`${API_BASE_URL}/api/school-admin/users/${existing.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        let msg = `Update failed (${resp.status})`;
        try {
          const errData = await resp.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        throw new Error(msg);
      }
      navigate(`/school-admin/students/${existing.id}`);
    } catch (err: any) {
      alert(err?.message || 'Failed to update student');
    }
  }

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
  if (error || !existing) {
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">First Name</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Last Name</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Email</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Phone</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Date of Birth</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Gender</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Address</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Grade</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Section</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Status</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as StudentStatus)}>
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Guardian Name</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Guardian Phone</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">GPA</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={gpa} onChange={(e) => setGpa(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Last Exam Score</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={lastExamScore} onChange={(e) => setLastExamScore(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Current Subjects (comma-separated)</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Remarks</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Total Days</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={totalDays} onChange={(e) => setTotalDays(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Present Days</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={presentDays} onChange={(e) => setPresentDays(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Last Absent Date</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={lastAbsentDate} onChange={(e) => setLastAbsentDate(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Fee Plan</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={feePlan} onChange={(e) => setFeePlan(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Total Due</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={totalDue} onChange={(e) => setTotalDue(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Total Paid</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={totalPaid} onChange={(e) => setTotalPaid(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Outstanding</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={outstanding} onChange={(e) => setOutstanding(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Last Payment Date</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={lastPaymentDate} onChange={(e) => setLastPaymentDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Scholarship</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={scholarship} onChange={(e) => setScholarship(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Allergies</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Medical Notes</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600">Emergency Instructions</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={emergencyInstructions} onChange={(e) => setEmergencyInstructions(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Portal Username</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={portalUsername} onChange={(e) => setPortalUsername(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Portal Active</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={portalActive ? 'true' : 'false'} onChange={(e) => setPortalActive(e.target.value === 'true')}>
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">RFID Card ID</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={rfidCardId} onChange={(e) => setRfidCardId(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(`/school-admin/students/${existing.id}`)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
