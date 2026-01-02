import React, { useState, useEffect } from 'react';
import { UserForm, UserFormSection, UserFormField } from './UserForm';
import { Student, StudentStatus } from '@/pages/admin/students/studentData';

interface StudentFormProps {
    initialData?: Student | null;
    onSubmit: (data: Partial<Student>) => Promise<void> | void;
    onCancel: () => void;
    title: string;
    loading?: boolean;
    error?: string | null;
    saveButtonText?: string;
    backButtonText?: string;
}

export function StudentForm({
    initialData,
    onSubmit,
    onCancel,
    title,
    loading = false,
    error = null,
    saveButtonText = 'Save',
    backButtonText = 'Cancel',
}: StudentFormProps) {
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

    // Guardian – just first guardian for now
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

    // Populate state when initialData changes
    useEffect(() => {
        if (initialData) {
            const s = initialData;
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

            setGpa(s.academics?.gpa != null ? String(s.academics.gpa) : '');
            setSubjects((s.academics?.currentSubjects || []).join(', '));
            setLastExamScore(
                s.academics?.lastExamScore != null ? String(s.academics.lastExamScore) : ''
            );
            setRemarks(s.academics?.remarks ?? '');

            setTotalDays(
                s.attendance?.totalDays != null ? String(s.attendance.totalDays) : ''
            );
            setPresentDays(
                s.attendance?.presentDays != null ? String(s.attendance.presentDays) : ''
            );
            setLastAbsentDate(s.attendance?.lastAbsentDate ?? '');

            setFeePlan(s.finance?.feePlan ?? '');
            setTotalDue(
                s.finance?.totalDue != null ? String(s.finance.totalDue) : ''
            );
            setTotalPaid(
                s.finance?.totalPaid != null ? String(s.finance.totalPaid) : ''
            );
            setOutstanding(
                s.finance?.outstanding != null ? String(s.finance.outstanding) : ''
            );
            setLastPaymentDate(s.finance?.lastPaymentDate ?? '');
            setScholarship(s.finance?.scholarship ?? '');

            setAllergies(s.health?.allergies ?? '');
            setMedicalNotes(s.health?.medicalNotes ?? '');
            setEmergencyInstructions(s.health?.emergencyInstructions ?? '');

            setPortalUsername(s.system?.portalUsername ?? '');
            setPortalActive(s.system?.portalActive ?? true);
            setRfidCardId(s.system?.rfidCardId ?? '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !grade) {
            alert('Please fill First Name, Last Name and Grade.');
            return;
        }

        const totalDaysNum = totalDays ? Number(totalDays) : undefined;
        const presentDaysNum = presentDays ? Number(presentDays) : undefined;
        const attendancePercentage =
            totalDaysNum && presentDaysNum
                ? Number(((presentDaysNum / totalDaysNum) * 100).toFixed(1))
                : undefined;

        // Use initialData as base if available, otherwise minimal mock structure or partial
        const baseStudent = initialData || {};

        const payload = {
            ...baseStudent,
            // If creating, we might not have ID yet, but `initialData` would be null.
            // The parent handler calling this should take care of strictly required fields like IDs if this returns a partial.
            // But for our purpose, we return the shape of data we collected.
            studentId: studentId || (initialData?.studentId), // Keep existing or empty if new (to be generated)
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
                        relationship: 'Parent', // Default
                        phone: guardianPhone || '-',
                        isEmergencyContact: true,
                    },
                ]
                : [],

            enrollment: {
                ...(initialData?.enrollment || {}),
                grade,
                section: section || undefined,
                status,
                admissionDate: initialData?.enrollment?.admissionDate || new Date().toISOString().slice(0, 10),
            },

            academics: {
                ...(initialData?.academics || {}),
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
                ...(initialData?.attendance || {}),
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
                ...(initialData?.finance || {}),
                feePlan,
                totalDue: totalDue ? Number(totalDue) : undefined,
                totalPaid: totalPaid ? Number(totalPaid) : undefined,
                outstanding: outstanding ? Number(outstanding) : undefined,
                lastPaymentDate: lastPaymentDate || undefined,
                scholarship,
            },

            health: {
                ...(initialData?.health || {}),
                allergies,
                medicalNotes,
                emergencyInstructions,
            },

            system: {
                ...(initialData?.system || {}),
                portalUsername,
                portalActive,
                rfidCardId,
            },
        };

        onSubmit(payload);
    };

    return (
        <UserForm
            title={title}
            loading={loading}
            error={error}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            saveButtonText={saveButtonText}
            backButtonText={backButtonText}
        >
            {/* BASIC */}
            <UserFormSection title="Basic Information">
                <div className="grid gap-4 md:grid-cols-2">
                    {initialData ? (
                        <UserFormField label="Student ID *" required>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </UserFormField>
                    ) : (
                        <UserFormField label="Student ID">
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                                value="Will be generated automatically"
                                disabled
                                readOnly
                            />
                        </UserFormField>
                    )}

                    <UserFormField label="Email">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="student@school.com"
                        />
                    </UserFormField>
                    <UserFormField label="First Name *" required>
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Last Name *" required>
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* PERSONAL */}
            <UserFormSection title="Personal Details">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="Gender">
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
                    </UserFormField>
                    <UserFormField label="Date of Birth">
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Phone">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </UserFormField>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <UserFormField label="Languages">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Address">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* ENROLLMENT */}
            <UserFormSection title="Enrollment">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="Grade *" required>
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Section">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Status">
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
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* GUARDIAN */}
            <UserFormSection title="Parent / Guardian (optional)">
                <div className="grid gap-4 md:grid-cols-2">
                    <UserFormField label="Guardian Name">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Guardian Phone">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={guardianPhone}
                            onChange={(e) => setGuardianPhone(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* ACADEMICS */}
            <UserFormSection title="Academics">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="GPA">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={gpa}
                            onChange={(e) => setGpa(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Last Exam Score">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={lastExamScore}
                            onChange={(e) => setLastExamScore(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Subjects (comma separated)">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={subjects}
                            onChange={(e) => setSubjects(e.target.value)}
                        />
                    </UserFormField>
                </div>
                <div className="mt-4">
                    <UserFormField label="Teacher Remarks">
                        <textarea
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={2}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* ATTENDANCE */}
            <UserFormSection title="Attendance">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="Total Days">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={totalDays}
                            onChange={(e) => setTotalDays(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Present Days">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={presentDays}
                            onChange={(e) => setPresentDays(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Last Absent Date">
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={lastAbsentDate}
                            onChange={(e) => setLastAbsentDate(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* FINANCE */}
            <UserFormSection title="Finance">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="Fee Plan">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={feePlan}
                            onChange={(e) => setFeePlan(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Total Due">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={totalDue}
                            onChange={(e) => setTotalDue(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Total Paid">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={totalPaid}
                            onChange={(e) => setTotalPaid(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Outstanding">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={outstanding}
                            onChange={(e) => setOutstanding(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Last Payment Date">
                        <input
                            type="date"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={lastPaymentDate}
                            onChange={(e) => setLastPaymentDate(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Scholarship / Discount">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={scholarship}
                            onChange={(e) => setScholarship(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* HEALTH */}
            <UserFormSection title="Health">
                <div className="grid gap-4 md:grid-cols-2">
                    <UserFormField label="Allergies">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Medical Notes">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={medicalNotes}
                            onChange={(e) => setMedicalNotes(e.target.value)}
                        />
                    </UserFormField>
                </div>
                <div className="mt-4">
                    <UserFormField label="Emergency Instructions">
                        <textarea
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={2}
                            value={emergencyInstructions}
                            onChange={(e) => setEmergencyInstructions(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>

            {/* SYSTEM */}
            <UserFormSection title="System Access">
                <div className="grid gap-4 md:grid-cols-3">
                    <UserFormField label="Portal Username">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={portalUsername}
                            onChange={(e) => setPortalUsername(e.target.value)}
                        />
                    </UserFormField>
                    <UserFormField label="Portal Active">
                        <select
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={portalActive ? 'true' : 'false'}
                            onChange={(e) => setPortalActive(e.target.value === 'true')}
                        >
                            <option value="true">Active</option>
                            <option value="false">Disabled</option>
                        </select>
                    </UserFormField>
                    <UserFormField label="RFID / Card ID">
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={rfidCardId}
                            onChange={(e) => setRfidCardId(e.target.value)}
                        />
                    </UserFormField>
                </div>
            </UserFormSection>
        </UserForm>
    );
}
