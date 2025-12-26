import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types/auth';
import {
  SystemUser,
  UserStatus,
  loadUsers,
  saveUsers,
  generateUserId,
  generateOdooId,
} from './userData';

export default function UserCreate() {
  const navigate = useNavigate();

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

  // Permissions
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageFinance, setCanManageFinance] = useState(false);
  const [canManageCourses, setCanManageCourses] = useState(false);
  const [canManageReports, setCanManageReports] = useState(false);
  const [canManageSettings, setCanManageSettings] = useState(false);

  // Notes
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      alert('Please fill in first name, last name, and email.');
      return;
    }

    const now = new Date().toISOString();

    const newUser: SystemUser = {
      id: generateUserId(),
      odooId: generateOdooId(),
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
        department: department || undefined,
        position: position || undefined,
        startDate: now.slice(0, 10),
        contractType,
      },
      permissions: {
        canManageUsers,
        canManageFinance,
        canManageCourses,
        canManageReports,
        canManageSettings,
      },
      activity: {
        createdBy: 'Current User',
      },
      notes: notes || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const current = loadUsers();
    saveUsers([...current, newUser]);

    navigate('/system-admin/users');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/system-admin/users')}
        >
          Back to Users
        </Button>
        <h1 className="text-xl font-semibold">Add New User</h1>
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
            <div className="grid gap-4 md:grid-cols-3">
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
              onClick={() => navigate('/system-admin/users')}
            >
              Cancel
            </Button>
            <Button type="submit">Save User</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
