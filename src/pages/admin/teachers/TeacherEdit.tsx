import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TeacherStatus } from './teacherData';

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

export default function TeacherEdit() {
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
    const fetchTeacher = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/school-admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error(`Failed to load teachers (${resp.status})`);
        const data = await resp.json();
        const found = (Array.isArray(data) ? data : data?.items || []).find((t: any) => {
          const tid = t.id || t._id || t.userID || t.userId || t.teacherId;
          return tid === id;
        });
        if (!found) {
          setError('Teacher not found.');
          setLoading(false);
          return;
        }
        const details = found.teacherDetails || found.details || {};
        const normalized = {
          id: found.id || found._id || found.userID || found.userId || found.teacherId,
          firstName: found.firstName || '',
          lastName: found.lastName || '',
          email: found.email || details.email || '',
          phone: details.phone || '',
          gender: details.gender || '',
          dateOfBirth: details.dateOfBirth || '',
          address: details.address || '',
          department: details.department || '',
          status: found.status || details.status || 'active',
          system: details.system || {},
          employment: details.employment || {},
          teacherId: found.teacherId || found.userID || found.userId || found.id || '',
        } as any;
        setExisting(normalized);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load teacher');
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  // ---------- form state ----------
  const [teacherId, setTeacherId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<TeacherStatus>('active');

  // System
  const [portalUsername, setPortalUsername] = useState('');
  const [portalActive, setPortalActive] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [staffQrId, setStaffQrId] = useState('');

  useEffect(() => {
    if (!existing) return;
    setTeacherId(existing.teacherId || existing.id || '');
    setFirstName(existing.firstName || '');
    setLastName(existing.lastName || '');
    setEmail(existing.email ?? '');
    setPhone(existing.phone ?? '');
    setGender(existing.gender ?? '');
    setDateOfBirth(existing.dateOfBirth ?? '');
    setAddress(existing.address ?? '');
    setDepartment(existing.department ?? '');
    setStatus((existing.status as TeacherStatus) ?? 'active');
    setPortalUsername(existing.system?.portalUsername ?? '');
    setPortalActive(
      existing.system?.portalActive == null ? true : Boolean(existing.system.portalActive)
    );
    setTwoFactorEnabled(Boolean(existing.system?.twoFactorEnabled));
    setStaffQrId(existing.system?.staffQrId ?? '');
  }, [existing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert('Please fill first name and last name.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert('Authentication required.');
      return;
    }
    if (!existing?.id) {
      alert('Teacher data not loaded yet. Please wait and try again.');
      return;
    }

    const teacherDetails: any = {
      phone: phone || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      address: address || undefined,
      department: department || undefined,
      system: {
        portalUsername: portalUsername || undefined,
        portalActive,
        twoFactorEnabled,
        staffQrId: staffQrId || undefined,
      },
    };

    try {
      const payload: any = { status, teacherDetails };
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
      navigate(`/school-admin/teachers/${existing.id}`);
    } catch (err: any) {
      alert(err?.message || 'Failed to update teacher');
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/teachers')}>
          ← Back to Teachers
        </Button>
        <Card padding="lg">
          <p className="text-sm">Loading teacher…</p>
        </Card>
      </div>
    );
  }
  if (error || !existing) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/school-admin/teachers')}>
          ← Back to Teachers
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">{error || 'Teacher not found.'}</p>
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
              <Field label="Teacher ID">
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
              <Field label="Department">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
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
