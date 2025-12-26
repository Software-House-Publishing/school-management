import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Student,
  StudentStatus,
  loadStudents,
  saveStudents,
  DocumentInfo,
} from './studentData';
import { Check, X } from 'lucide-react';

const DOCUMENT_TYPES = [
  'Birth Certificate',
  'Transfer Certificate',
  'Parent Consent Form',
  'Medical Records',
  'Previous Report Cards',
  'ID Photo',
];

export default function StudentCreate() {
  const navigate = useNavigate();

  // Basic Info
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // Enrollment
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');

  // Guardian
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Parent');

  // Health Information
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyInstructions, setEmergencyInstructions] = useState('');

  // System & Documents
  const [portalUsername, setPortalUsername] = useState('');
  const [portalActive, setPortalActive] = useState(true);
  const [rfidCardId, setRfidCardId] = useState('');
  const [documents, setDocuments] = useState<DocumentInfo[]>(
    DOCUMENT_TYPES.map((type) => ({ type, uploaded: false }))
  );

  function toggleDocument(index: number) {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, uploaded: !doc.uploaded } : doc
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!studentId || !firstName || !lastName || !grade) {
      alert('Please fill ID, first name, last name and grade.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const newStudent: Student = {
      id: Date.now().toString(),
      studentId,
      firstName,
      lastName,
      email: email || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      address: address || undefined,
      phone: phone || undefined,
      language: '',
      photoUrl: undefined,

      guardians: guardianName
        ? [
            {
              name: guardianName,
              relationship: guardianRelationship || 'Parent',
              phone: guardianPhone || '-',
              email: guardianEmail || undefined,
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
        allergies: allergies || undefined,
        medicalNotes: medicalNotes || undefined,
        emergencyInstructions: emergencyInstructions || undefined,
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
        portalUsername: portalUsername || `${firstName.toLowerCase()}.${lastName.charAt(0).toLowerCase()}`,
        portalActive,
        rfidCardId: rfidCardId || undefined,
      },

      documents: documents.filter((d) => d.uploaded || DOCUMENT_TYPES.includes(d.type)),
    };

    const current = loadStudents();
    saveStudents([...current, newStudent]);

    navigate('/school-admin/students');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/students')}
        >
          ← Back to Students
        </Button>
        <h1 className="text-xl font-semibold">Add New Student</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Student ID *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU-2400011"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Email</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.com"
                  type="email"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">First Name *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alice"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Last Name *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Johnson"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Date of Birth</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  type="date"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Gender</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Phone</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0000"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Address</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Springfield"
                />
              </div>
            </div>
          </section>
        </Card>

        {/* Enrollment */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Enrollment</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Grade *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Section</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="A"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Status</label>
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
              </div>
            </div>
          </section>
        </Card>

        {/* Parent / Guardian */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Parent / Guardian (optional)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Guardian Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Parent name"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Relationship</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                >
                  <option value="Parent">Parent</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Guardian Phone</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+1 555-0000"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Guardian Email</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="parent@email.com"
                  type="email"
                />
              </div>
            </div>
          </section>
        </Card>

        {/* Health Information */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Health Information (optional)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Allergies</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g., Peanuts, Dairy, None"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Medical Notes</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g., Carries EpiPen, Wears glasses"
                />
              </div>
              <div className="space-y-1 text-sm md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Emergency Medical Instructions</label>
                <textarea
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyInstructions}
                  onChange={(e) => setEmergencyInstructions(e.target.value)}
                  placeholder="Instructions to follow in case of medical emergency..."
                  rows={2}
                />
              </div>
            </div>
          </section>
        </Card>

        {/* System & Documents */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">System & Documents</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Portal Username</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalUsername}
                  onChange={(e) => setPortalUsername(e.target.value)}
                  placeholder="alice.j"
                />
                <p className="text-[10px] text-slate-400">Auto-generated if left blank</p>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Portal Status</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalActive ? 'active' : 'inactive'}
                  onChange={(e) => setPortalActive(e.target.value === 'active')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">RFID / Card ID</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={rfidCardId}
                  onChange={(e) => setRfidCardId(e.target.value)}
                  placeholder="RFID-001"
                />
              </div>
            </div>

            {/* Documents Checklist */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Documents</label>
              <div className="mt-2 space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between rounded-lg border px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm text-slate-700">{doc.type}</span>
                    <button
                      type="button"
                      onClick={() => toggleDocument(index)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        doc.uploaded
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {doc.uploaded ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="w-3 h-3" /> Missing
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/school-admin/students')}
          >
            Cancel
          </Button>
          <Button type="submit">Save Student</Button>
        </div>
      </form>
    </div>
  );
}
