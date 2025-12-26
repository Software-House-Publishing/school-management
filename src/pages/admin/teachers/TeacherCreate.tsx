import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Teacher,
  TeacherStatus,
  EmploymentType,
  DocumentInfo,
  loadTeachers,
  saveTeachers,
} from './teacherData';
import { Check, X } from 'lucide-react';

const DOCUMENT_TYPES = [
  'Employment Contract',
  'ID Document',
  'Degree Certificate',
  'Teaching License',
  'Background Check',
  'CPR Certification',
];

export default function TeacherCreate() {
  const navigate = useNavigate();

  // Basic info
  const [teacherId, setTeacherId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');

  // Employment
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('Teacher');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [status, setStatus] = useState<TeacherStatus>('active');
  const [office, setOffice] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [teachingLicense, setTeachingLicense] = useState('');
  const [salaryGrade, setSalaryGrade] = useState('');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');

  // System & Documents
  const [portalUsername, setPortalUsername] = useState('');
  const [portalActive, setPortalActive] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [staffQrId, setStaffQrId] = useState('');
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

    if (!teacherId || !firstName || !lastName || !department) {
      alert('Please fill Teacher ID, first name, last name, and department.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const newTeacher: Teacher = {
      id: Date.now().toString(),
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
        type: employmentType,
        role,
        joinDate: today,
        qualifications: qualifications
          ? qualifications.split(',').map((q) => q.trim()).filter(Boolean)
          : [],
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
        teachingLicense: teachingLicense || undefined,
        salaryGrade: salaryGrade || undefined,
      },
      teaching: {
        assignedCourses: [],
        totalSections: 0,
        totalStudents: 0,
        weeklyHours: 0,
        academicTerm: 'Fall 2024',
      },
      operations: {
        attendanceSubmissionRate: 0,
        gradingProgress: { midterm: 0, final: 0 },
        pendingTasks: 0,
        lateSubmissions: 0,
      },
      leave: {
        sickLeaveBalance: 10,
        casualLeaveBalance: 7,
        requests: [],
      },
      system: {
        portalUsername: portalUsername || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        portalActive,
        twoFactorEnabled,
        staffQrId: staffQrId || undefined,
      },
      documents: documents.filter((d) => d.uploaded || DOCUMENT_TYPES.includes(d.type)),
    };

    const current = loadTeachers();
    saveTeachers([...current, newTeacher]);
    navigate('/school-admin/teachers');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/teachers')}
        >
          ← Back to Teachers
        </Button>
        <h1 className="text-xl font-semibold">Add New Teacher</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Teacher ID *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="TCH-2024-000009"
                />
              </Field>
              <Field label="Email">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@scitech.edu"
                  type="email"
                />
              </Field>
              <Field label="First Name *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </Field>
              <Field label="Last Name *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </Field>
              <Field label="Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0000"
                />
              </Field>
              <Field label="Gender">
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
                  placeholder="123 Main St, City"
                />
              </Field>
            </div>
          </section>
        </Card>

        {/* Employment */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Employment Details</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Department *">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Mathematics"
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
                  placeholder="Building A, Room 101"
                />
              </Field>
              <Field label="Office Hours">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  placeholder="Mon/Wed 2-4 PM"
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Qualifications (comma separated)">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="Ph.D., M.Sc."
                />
              </Field>
              <Field label="Years of Experience">
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="5"
                />
              </Field>
              <Field label="Teaching License">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={teachingLicense}
                  onChange={(e) => setTeachingLicense(e.target.value)}
                  placeholder="TL-2024-XXXX"
                />
              </Field>
              <Field label="Salary Grade">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={salaryGrade}
                  onChange={(e) => setSalaryGrade(e.target.value)}
                >
                  <option value="">Select grade</option>
                  <option value="Grade A+">Grade A+</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
              </Field>
            </div>
          </section>
        </Card>

        {/* Emergency Contact */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Emergency Contact (optional)</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Contact Name">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Contact Phone">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+1 555-0001"
                />
              </Field>
              <Field label="Relationship">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
          </section>
        </Card>

        {/* System & Documents */}
        <Card padding="lg">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">System & Documents</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Portal Username">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalUsername}
                  onChange={(e) => setPortalUsername(e.target.value)}
                  placeholder="john.doe"
                />
                <p className="text-[10px] text-slate-400 mt-1">Auto-generated if left blank</p>
              </Field>
              <Field label="Portal Status">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={portalActive ? 'active' : 'inactive'}
                  onChange={(e) => setPortalActive(e.target.value === 'active')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="2FA Enabled">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={twoFactorEnabled ? 'yes' : 'no'}
                  onChange={(e) => setTwoFactorEnabled(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </Field>
              <Field label="Staff QR ID">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={staffQrId}
                  onChange={(e) => setStaffQrId(e.target.value)}
                  placeholder="STAFF-QR-009"
                />
              </Field>
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
            onClick={() => navigate('/school-admin/teachers')}
          >
            Cancel
          </Button>
          <Button type="submit">Save Teacher</Button>
        </div>
      </form>
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
