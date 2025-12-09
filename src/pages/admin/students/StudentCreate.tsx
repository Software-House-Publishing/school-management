import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Student,
  StudentStatus,
  loadStudents,
  saveStudents,
} from './studentData';

export default function StudentCreate() {
  const navigate = useNavigate();

  // form state (keep it simple for now)
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // very small validation
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
        email,
        gender: undefined,
        dateOfBirth: undefined,
        address: '',
        phone: '',
        language: '',
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
            allergies: '',
            medicalNotes: '',
            emergencyInstructions: '',
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


    const current = loadStudents();
    saveStudents([...current, newStudent]);

    navigate('/admin/students');
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic info */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Student ID *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU006"
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
            </div>
          </section>

          {/* Enrollment */}
          <section className="space-y-3">
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

          {/* Parent / guardian */}
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/students')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
