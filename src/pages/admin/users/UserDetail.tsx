import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { loadUsers, saveUsers, SystemUser, UserStatus } from './userData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Calendar,
  Clock,
  Key,
  UserCheck,
  UserX,
  AlertTriangle,
  Briefcase,
  Hash,
  FileText,
  Activity,
} from 'lucide-react';

function statusClasses(status: UserStatus) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'inactive':
      return 'bg-slate-100 text-slate-700';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

function statusIcon(status: UserStatus) {
  switch (status) {
    case 'active':
      return <UserCheck className="w-3 h-3" />;
    case 'inactive':
      return <UserX className="w-3 h-3" />;
    case 'suspended':
      return <AlertTriangle className="w-3 h-3" />;
    case 'pending':
      return <Clock className="w-3 h-3" />;
    default:
      return null;
  }
}

function formatRole(role: string) {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(dateString?: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement | null>(null);

  const user = loadUsers().find((u) => u.id === id);

  if (!user) {
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

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    const fileName = `${user.firstName}-${user.lastName}-Profile.pdf`.replace(/\s+/g, '-');
    pdf.save(fileName);
  };

  const handleDelete = () => {
    const ok = window.confirm('Are you sure you want to delete this user?');
    if (!ok) return;
    const current = loadUsers();
    const updated = current.filter((u) => u.id !== user.id);
    saveUsers(updated);
    navigate('/system-admin/users');
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button type="button" variant="outline" onClick={() => navigate('/system-admin/users')}>
          Back to Users
        </Button>
        <div className="flex gap-3 flex-wrap">
          <Button
            type="button"
            className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={() => navigate(`/system-admin/users/${user.id}/edit`)}
          >
            Edit
          </Button>

          <Button
            type="button"
            className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Button
            type="button"
            className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 text-sm font-medium"
            onClick={handleDownloadReport}
          >
            Download Profile
          </Button>
        </div>
      </div>

      {/* PDF capture area */}
      <div ref={reportRef}>
        <Card padding="none" className="overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold uppercase overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold leading-tight">{fullName}</h1>
                  <p className="text-sm text-violet-100 flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4" />
                    {formatRole(user.role)}
                  </p>
                  <p className="text-xs text-violet-200 mt-1">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                    user.status
                  )} bg-opacity-90`}
                >
                  {statusIcon(user.status)}
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
                  ID: {user.odooId}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid gap-3 border-b bg-slate-50 px-4 py-3 text-sm md:grid-cols-4">
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  School
                </p>
                <p className="text-sm font-semibold truncate">{user.schoolName || '—'}</p>
              </div>
              <Building2 className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Department
                </p>
                <p className="text-sm font-semibold truncate">
                  {user.employment?.department || '—'}
                </p>
              </div>
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Login Count
                </p>
                <p className="text-sm font-semibold">{user.activity?.loginCount ?? 0}</p>
              </div>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Last Login
                </p>
                <p className="text-xs font-semibold">
                  {user.activity?.lastLogin
                    ? formatDateTime(user.activity.lastLogin)
                    : 'Never'}
                </p>
              </div>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          {/* Body sections */}
          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Contact Information */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Contact Information
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Email" value={user.email} icon={<Mail className="w-3 h-3" />} />
                    <InfoItem
                      label="Phone"
                      value={user.phone}
                      icon={<Phone className="w-3 h-3" />}
                    />
                  </div>
                </section>

                {/* Address */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Address
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Street" value={user.address?.street} />
                    <InfoItem label="City" value={user.address?.city} />
                    <InfoItem label="State" value={user.address?.state} />
                    <InfoItem label="Postal Code" value={user.address?.postalCode} />
                    <InfoItem label="Country" value={user.address?.country} className="md:col-span-2" />
                  </div>
                </section>

                {/* Employment */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Employment Details
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Department" value={user.employment?.department} />
                    <InfoItem label="Position" value={user.employment?.position} />
                    <InfoItem label="Employee ID" value={user.employment?.employeeId} />
                    <InfoItem
                      label="Contract Type"
                      value={user.employment?.contractType?.replace('-', ' ')}
                    />
                    <InfoItem label="Start Date" value={formatDate(user.employment?.startDate)} />
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Permissions */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-400" />
                    Permissions
                  </h2>
                  <div className="mt-3 space-y-2">
                    <PermissionItem
                      label="Manage Users"
                      allowed={user.permissions?.canManageUsers}
                    />
                    <PermissionItem
                      label="Manage Finance"
                      allowed={user.permissions?.canManageFinance}
                    />
                    <PermissionItem
                      label="Manage Courses"
                      allowed={user.permissions?.canManageCourses}
                    />
                    <PermissionItem
                      label="Manage Reports"
                      allowed={user.permissions?.canManageReports}
                    />
                    <PermissionItem
                      label="Manage Settings"
                      allowed={user.permissions?.canManageSettings}
                    />
                  </div>
                </section>

                {/* Activity */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    Account Activity
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="Last Login" value={formatDateTime(user.activity?.lastLogin)} />
                    <InfoItem label="Login Count" value={String(user.activity?.loginCount ?? 0)} />
                    <InfoItem
                      label="Last Password Change"
                      value={formatDateTime(user.activity?.lastPasswordChange)}
                    />
                    <InfoItem label="Created By" value={user.activity?.createdBy} />
                  </div>
                </section>

                {/* System Info */}
                <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" />
                    System Information
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <InfoItem label="User ID" value={user.odooId} />
                    <InfoItem label="School ID" value={user.schoolId} />
                    <InfoItem label="Created At" value={formatDateTime(user.createdAt)} />
                    <InfoItem label="Last Updated" value={formatDateTime(user.updatedAt)} />
                  </div>
                </section>

                {/* Notes */}
                {user.notes && (
                  <section className="rounded-lg border bg-slate-50/60 px-4 py-3">
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Notes
                    </h2>
                    <p className="mt-2 text-sm text-slate-700">{user.notes}</p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value?: string | null;
  className?: string;
  icon?: React.ReactNode;
}

function InfoItem({ label, value, className, icon }: InfoItemProps) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-900">{value && value !== '' ? value : '—'}</p>
    </div>
  );
}

interface PermissionItemProps {
  label: string;
  allowed?: boolean;
}

function PermissionItem({ label, allowed }: PermissionItemProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-xs">
      <span>{label}</span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
          allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {allowed ? (
          <>
            <UserCheck className="w-3 h-3" /> Allowed
          </>
        ) : (
          <>
            <UserX className="w-3 h-3" /> Denied
          </>
        )}
      </span>
    </div>
  );
}
