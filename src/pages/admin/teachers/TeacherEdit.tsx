import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Teacher,
  TeacherStatus,
  EmploymentType,
  loadTeachers,
  saveTeachers,
} from './teacherData';

export default function TeacherEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const existing = loadTeachers().find((t) => t.id === id);

  if (!existing) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/teachers')}
        >
          ← Back to Teachers
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">Teacher not found.</p>
        </Card>
      </div>
    );
  }

  // Basic info
  const [teacherId, setTeacherId] = useState(existing.teacherId);
  const [firstName, setFirstName] = useState(existing.firstName);
  const [lastName, setLastName] = useState(existing.lastName);
  const [email, setEmail] = useState(existing.email ?? '');
  const [phone, setPhone] = useState(existing.phone ?? '');
  const [gender, setGender] = useState(existing.gender ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(existing.dateOfBirth ?? '');
  const [address, setAddress] = useState(existing.address ?? '');

  // Employment
  const [department, setDepartment] = useState(existing.department);
  const [role, setRole] = useState(existing.employment.role);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(existing.employment.type);
  const [status, setStatus] = useState<TeacherStatus>(existing.status);
  const [office, setOffice] = useState(existing.office ?? '');
  const [officeHours, setOfficeHours] = useState(existing.officeHours ?? '');
  const [qualifications, setQualifications] = useState(
    existing.employment.qualifications.join(', ')
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    String(existing.employment.yearsOfExperience)
  );
  const [teachingLicense, setTeachingLicense] = useState(
    existing.employment.teachingLicense ?? ''
  );
  const [joinDate, setJoinDate] = useState(existing.employment.joinDate);
  const [contractStart, setContractStart] = useState(existing.employment.contractStart ?? '');
  const [contractEnd, setContractEnd] = useState(existing.employment.contractEnd ?? '');
  const [salaryGrade, setSalaryGrade] = useState(existing.employment.salaryGrade ?? '');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState(existing.emergencyContact?.name ?? '');
  const [emergencyPhone, setEmergencyPhone] = useState(existing.emergencyContact?.phone ?? '');
  const [emergencyRelationship, setEmergencyRelationship] = useState(
    existing.emergencyContact?.relationship ?? ''
  );

  // Leave
  const [sickLeaveBalance, setSickLeaveBalance] = useState(
    String(existing.leave.sickLeaveBalance)
  );
  const [casualLeaveBalance, setCasualLeaveBalance] = useState(
    String(existing.leave.casualLeaveBalance)
  );

  // System
  const [portalUsername, setPortalUsername] = useState(existing.system?.portalUsername ?? '');
  const [portalActive, setPortalActive] = useState(existing.system?.portalActive ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    existing.system?.twoFactorEnabled ?? false
  );
  const [staffQrId, setStaffQrId] = useState(existing.system?.staffQrId ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!teacherId || !firstName || !lastName || !department) {
      alert('Please fill Teacher ID, first name, last name, and department.');
      return;
    }

    const updatedTeacher: Teacher = {
      ...existing,
      teacherId,
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      address: address || undefined,
      department,
      status,
      office: office || undefined,
      officeHours: officeHours || undefined,
      emergencyContact: emergencyName
        ? {
            name: emergencyName,
            phone: emergencyPhone || '-',
            relationship: emergencyRelationship || 'Contact',
          }
        : undefined,
      employment: {
        ...existing.employment,
        type: employmentType,
        role,
        joinDate,
        contractStart: contractStart || undefined,
        contractEnd: contractEnd || undefined,
        qualifications: qualifications
          ? qualifications.split(',').map((q) => q.trim()).filter(Boolean)
          : [],
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
        teachingLicense: teachingLicense || undefined,
        salaryGrade: salaryGrade || undefined,
      },
      leave: {
        ...existing.leave,
        sickLeaveBalance: sickLeaveBalance ? Number(sickLeaveBalance) : 0,
        casualLeaveBalance: casualLeaveBalance ? Number(casualLeaveBalance) : 0,
      },
      system: {
        ...existing.system,
        portalUsername: portalUsername || undefined,
        portalActive,
        twoFactorEnabled,
        staffQrId: staffQrId || undefined,
      },
    };

    const current = loadTeachers();
    const updatedList = current.map((t) =>
      t.id === existing.id ? updatedTeacher : t
    );
    saveTeachers(updatedList);
    navigate(`/school-admin/teachers/${existing.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/school-admin/teachers/${existing.id}`)}
        >
          ← Back to Teacher Detail
        </Button>
        <h1 className="text-xl font-semibold">
          Edit Teacher – {existing.firstName} {existing.lastName}
        </h1>
      </div>

      <Card padding="lg">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Teacher ID *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
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
              <Field label="Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
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
              <Field label="Address">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Employment */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Employment Details</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Department *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </Field>
              <Field label="Role">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Head of Department">Head of Department</option>
                  <option value="Visiting Instructor">Visiting Instructor</option>
                </select>
              </Field>
              <Field label="Employment Type">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="visiting">Visiting</option>
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TeacherStatus)}
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="resigned">Resigned</option>
                </select>
              </Field>
              <Field label="Office">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                />
              </Field>
              <Field label="Office Hours">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                />
              </Field>
              <Field label="Join Date">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                />
              </Field>
              <Field label="Contract Start">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={contractStart}
                  onChange={(e) => setContractStart(e.target.value)}
                />
              </Field>
              <Field label="Contract End">
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={contractEnd}
                  onChange={(e) => setContractEnd(e.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Qualifications (comma separated)">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </Field>
              <Field label="Years of Experience">
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                />
              </Field>
              <Field label="Teaching License">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={teachingLicense}
                  onChange={(e) => setTeachingLicense(e.target.value)}
                />
              </Field>
              <Field label="Salary Grade">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={salaryGrade}
                  onChange={(e) => setSalaryGrade(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Emergency Contact</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Contact Name">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
              </Field>
              <Field label="Contact Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </Field>
              <Field label="Relationship">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Leave */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Leave Balance</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sick Leave Balance (days)">
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={sickLeaveBalance}
                  onChange={(e) => setSickLeaveBalance(e.target.value)}
                />
              </Field>
              <Field label="Casual Leave Balance (days)">
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={casualLeaveBalance}
                  onChange={(e) => setCasualLeaveBalance(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* System */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">System Access</h2>
            <div className="grid gap-4 md:grid-cols-4">
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
              <Field label="2FA Enabled">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={twoFactorEnabled ? 'true' : 'false'}
                  onChange={(e) => setTwoFactorEnabled(e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
              <Field label="Staff QR ID">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={staffQrId}
                  onChange={(e) => setStaffQrId(e.target.value)}
                />
              </Field>
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/school-admin/teachers/${existing.id}`)}
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
