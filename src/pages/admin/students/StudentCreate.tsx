import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Student, StudentStatus } from './studentData';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

// Payload for creating a new student – studentId is optional/omitted
type NewStudentPayload = Omit<Student, 'id' | 'studentId'> & {
  studentId?: string;
};

export default function StudentCreate() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  // ------- basic -------
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // ------- personal & contact -------
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');

  // ------- enrollment -------
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');

  // ------- guardian (simple – first guardian only) -------
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  // ------- health -------
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyInstructions, setEmergencyInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // minimal required fields
    if (!firstName || !lastName || !grade) {
      alert('Please fill first name, last name and grade.');
      return;
    }

    if (!token) {
      alert('You are not authenticated.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const payload: NewStudentPayload = {
      // studentId will be generated on the backend
      firstName,
      lastName,
      email: email || undefined,

      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      address: address || '',
      phone: phone || '',
      language: language || '',
      photoUrl: undefined,

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
        admissionDate: today,
        grade,
        section: section || undefined,
        status,
        previousSchool: '',
        homeroomTeacher: '',
        rollNumber: '',
      },

      academics: {
        gpa: undefined,
        currentSubjects: [],
        lastExamScore: undefined,
        remarks: '',
      },

      attendance: {
        totalDays: undefined,
        presentDays: undefined,
        absentDays: undefined,
        attendancePercentage: undefined,
        lastAbsentDate: undefined,
      },

      activities: {
        clubs: [],
        sports: [],
        awards: [],
        disciplineNotes: '',
      },

      health: {
        allergies,
        medicalNotes,
        emergencyInstructions,
      },

      finance: {
        feePlan: '',
        totalDue: undefined,
        totalPaid: undefined,
        outstanding: undefined,
        lastPaymentDate: undefined,
        scholarship: '',
      },

      system: {
        portalUsername: '',
        portalActive: true,
        rfidCardId: '',
      },

      documents: [],
    };

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create student');
      }

      navigate('/admin/students');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create student');
      alert(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/students')}
        >
          ← Back to Students
        </Button>
        <h1 className="text-xl font-semibold">Add New Student</h1>
      </div>

      <Card padding="lg">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-red-600 mb-2">
              {error}
            </p>
          )}

          {/* BASIC */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Student ID
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  value="Will be generated automatically"
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.com"
                  type="email"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  First Name *
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alice"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Last Name *
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Johnson"
                />
              </div>
            </div>
          </section>

          {/* PERSONAL & CONTACT */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Personal & Contact</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Gender
                </label>
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
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Phone
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Languages
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. Myanmar, English"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Address
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ENROLLMENT */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Enrollment</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Grade *
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Section
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="A"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as StudentStatus)
                  }
                >
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
          </section>

          {/* GUARDIAN */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Parent / Guardian (optional)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Guardian Name
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Parent name"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Guardian Phone
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+1 555-0000"
                />
              </div>
            </div>
          </section>

          {/* HEALTH */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Health</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Allergies
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">
                  Medical Notes
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-xs font-medium text-slate-600">
                Emergency Instructions
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm"
                rows={2}
                value={emergencyInstructions}
                onChange={(e) => setEmergencyInstructions(e.target.value)}
              />
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/students')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Student'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
