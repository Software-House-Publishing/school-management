import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types/auth';
import {
  SystemUser,
  UserStatus,
  loadUsers,
  saveUsers,
  getUserById,
} from './userData';

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Basic info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [status, setStatus] = useState<UserStatus>('active');
  const [schoolName, setSchoolName] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Employment
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [contractType, setContractType] = useState<'full-time' | 'part-time' | 'contract'>('full-time');
  const [employeeId, setEmployeeId] = useState('');

  // Permissions
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageFinance, setCanManageFinance] = useState(false);
  const [canManageCourses, setCanManageCourses] = useState(false);
  const [canManageReports, setCanManageReports] = useState(false);
  const [canManageSettings, setCanManageSettings] = useState(false);

  // Notes
  const [notes, setNotes] = useState('');

  // Original user for reference
  const [originalUser, setOriginalUser] = useState<SystemUser | null>(null);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const user = getUserById(id);
    if (!user) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setOriginalUser(user);

    // Populate form
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setStatus(user.status);
    setSchoolName(user.schoolName || '');

    setStreet(user.address?.street || '');
    setCity(user.address?.city || '');
    setState(user.address?.state || '');
    setPostalCode(user.address?.postalCode || '');
    setCountry(user.address?.country || '');

    setDepartment(user.employment?.department || '');
    setPosition(user.employment?.position || '');
    setContractType(user.employment?.contractType || 'full-time');
    setEmployeeId(user.employment?.employeeId || '');

    setCanManageUsers(user.permissions?.canManageUsers || false);
    setCanManageFinance(user.permissions?.canManageFinance || false);
    setCanManageCourses(user.permissions?.canManageCourses || false);
    setCanManageReports(user.permissions?.canManageReports || false);
    setCanManageSettings(user.permissions?.canManageSettings || false);

    setNotes(user.notes || '');

    setLoading(false);
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!originalUser) return;

    if (!firstName || !lastName || !email) {
      alert('Please fill in first name, last name, and email.');
      return;
    }

    const now = new Date().toISOString();

    const updatedUser: SystemUser = {
      ...originalUser,
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      role,
      status,
      schoolName: schoolName || undefined,
      address: {
        street: street || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        country: country || undefined,
      },
      employment: {
        ...originalUser.employment,
        department: department || undefined,
        position: position || undefined,
        contractType,
        employeeId: employeeId || undefined,
      },
      permissions: {
        canManageUsers,
        canManageFinance,
        canManageCourses,
        canManageReports,
        canManageSettings,
      },
      notes: notes || undefined,
      updatedAt: now,
    };

    const users = loadUsers();
    const updated = users.map((u) => (u.id === originalUser.id ? updatedUser : u));
    saveUsers(updated);

    navigate(`/system-admin/users/${originalUser.id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => navigate('/system-admin/users')}>
          Back to Users
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">User not found.</p>
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
          onClick={() => navigate(`/system-admin/users/${id}`)}
        >
          Back to User Details
        </Button>
        <h1 className="text-xl font-semibold">Edit User</h1>
      </div>

      <Card padding="lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic info */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">First Name *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Last Name *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Email *</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@school.com"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Phone</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0100"
                />
              </div>
            </div>
          </section>

          {/* Role & Status */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Role & Status</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Role *</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="school_administrator">School Administrator</option>
                  <option value="system_administrator">System Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="finance_officer">Finance Officer</option>
                  <option value="help_desk">Help Desk</option>
                </select>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Status</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">School Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="St. Mary's High School"
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Street Address</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">City</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Springfield"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">State</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="IL"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Postal Code</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="62701"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Country</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA"
                />
              </div>
            </div>
          </section>

          {/* Employment */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Employment Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Department</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Mathematics"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Position</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Senior Teacher"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Employee ID</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-001"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label className="text-xs font-medium text-slate-600">Contract Type</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={contractType}
                  onChange={(e) =>
                    setContractType(e.target.value as 'full-time' | 'part-time' | 'contract')
                  }
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Permissions</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageUsers}
                  onChange={(e) => setCanManageUsers(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                Can Manage Users
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageFinance}
                  onChange={(e) => setCanManageFinance(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                Can Manage Finance
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageCourses}
                  onChange={(e) => setCanManageCourses(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                Can Manage Courses
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageReports}
                  onChange={(e) => setCanManageReports(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                Can Manage Reports
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={canManageSettings}
                  onChange={(e) => setCanManageSettings(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                Can Manage Settings
              </label>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-violet-700">Notes</h2>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this user..."
            />
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/system-admin/users/${id}`)}
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
