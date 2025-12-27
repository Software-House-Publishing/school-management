import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Shield,
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Key,
  Smartphone,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';
import {
  currentTeacher,
  leaveBalance,
  leaveRequests,
  teacherDocuments,
  formatDate,
} from '../data/teacherPortalData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type ProfileTab = 'professional' | 'personal' | 'leave' | 'documents' | 'security';

/* ─────────────────────────────────────────────────────────────────────────────
   PROFESSIONAL TAB
───────────────────────────────────────────────────────────────────────────── */
function ProfessionalTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.department}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.role}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Employment Type</label>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
              {currentTeacher.employmentType.replace('_', ' ')}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{formatDate(currentTeacher.joinDate)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Years of Experience</label>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.yearsOfExperience} years</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Teaching License</label>
            <span className="text-gray-900">{currentTeacher.teachingLicense || 'N/A'}</span>
          </div>
        </div>
      </Card>

      {/* Qualifications */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
        <div className="flex flex-wrap gap-2">
          {currentTeacher.qualifications.map((qual, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700"
            >
              <GraduationCap className="h-4 w-4" />
              {qual}
            </span>
          ))}
        </div>
      </Card>

      {/* Office Hours */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Edit
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Schedule</label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.officeHours}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.office}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PERSONAL TAB
───────────────────────────────────────────────────────────────────────────── */
function PersonalTab() {
  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Edit
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.email}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{currentTeacher.phone}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Details */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Staff ID</label>
            <span className="text-gray-900">{currentTeacher.teacherId}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 capitalize">
              {currentTeacher.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Edit
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
            <span className="text-gray-900">Jane Smith</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Relationship</label>
            <span className="text-gray-900">Spouse</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">+1 555-1002</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEAVE TAB
───────────────────────────────────────────────────────────────────────────── */
function LeaveTab() {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-red-50 text-red-700 border-red-100',
  };

  const statusIcons = {
    pending: AlertCircle,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  return (
    <div className="space-y-6">
      {/* Leave Balance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Sick Leave</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{leaveBalance.sick.remaining}</span>
            <span className="text-sm text-gray-500">/ {leaveBalance.sick.total} days</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(leaveBalance.sick.remaining / leaveBalance.sick.total) * 100}%` }}
            />
          </div>
        </Card>
        <Card className="rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Casual Leave</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{leaveBalance.casual.remaining}</span>
            <span className="text-sm text-gray-500">/ {leaveBalance.casual.total} days</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(leaveBalance.casual.remaining / leaveBalance.casual.total) * 100}%` }}
            />
          </div>
        </Card>
        <Card className="rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Personal Leave</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{leaveBalance.personal.remaining}</span>
            <span className="text-sm text-gray-500">/ {leaveBalance.personal.total} days</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(leaveBalance.personal.remaining / leaveBalance.personal.total) * 100}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Leave Requests */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Leave Requests</h3>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Request Leave
          </button>
        </div>

        <div className="divide-y">
          {leaveRequests.map((request) => {
            const StatusIcon = statusIcons[request.status];
            return (
              <div key={request.id} className="flex items-center gap-4 p-4">
                <div className={cn('p-2 rounded-lg', statusColors[request.status].split(' ')[0])}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 capitalize">{request.type} Leave</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', statusColors[request.status])}>
                      {request.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{request.reason}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} days)
                  </div>
                </div>
                {request.reviewerComments && (
                  <div className="text-sm text-gray-500 max-w-xs">
                    <span className="font-medium">Note:</span> {request.reviewerComments}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Request Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Leave</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="sick">Sick Leave ({leaveBalance.sick.remaining} days available)</option>
                  <option value="casual">Casual Leave ({leaveBalance.casual.remaining} days available)</option>
                  <option value="personal">Personal Leave ({leaveBalance.personal.remaining} days available)</option>
                  <option value="conference">Conference/Training</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  placeholder="Explain your reason for leave..."
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  alert('Leave request submitted! (Demo)');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DOCUMENTS TAB
───────────────────────────────────────────────────────────────────────────── */
function DocumentsTab() {
  const statusColors = {
    uploaded: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    expired: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">My Documents</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>

        <div className="divide-y">
          {teacherDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4">
              <div className="p-2.5 rounded-lg bg-gray-100">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{doc.name}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', statusColors[doc.status])}>
                    {doc.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {doc.uploadedAt && `Uploaded ${formatDate(doc.uploadedAt)}`}
                  {doc.expiresAt && ` • Expires ${formatDate(doc.expiresAt)}`}
                  {doc.fileSize && ` • ${doc.fileSize}`}
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECURITY TAB
───────────────────────────────────────────────────────────────────────────── */
function SecurityTab() {
  return (
    <div className="space-y-6">
      {/* Password */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-blue-50">
            <Key className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Password</h3>
            <p className="text-sm text-gray-500">Manage your password</p>
          </div>
        </div>

        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Change Password
        </button>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <Smartphone className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentTeacher.twoFactorEnabled ? (
              <>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Enabled
                </span>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Disable
                </button>
              </>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Enable
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-purple-50">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Active Sessions</h3>
            <p className="text-sm text-gray-500">Manage your active login sessions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <div className="font-medium text-gray-900">Current Session</div>
              <div className="text-sm text-gray-500">Last active: {currentTeacher.lastLogin}</div>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Active
            </span>
          </div>
        </div>

        <button className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">
          Sign out of all other sessions
        </button>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function TeacherProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('professional');

  const tabs: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {currentTeacher.firstName[0]}{currentTeacher.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentTeacher.firstName} {currentTeacher.lastName}
            </h1>
            <p className="text-gray-500">
              {currentTeacher.role} • {currentTeacher.department}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-4 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'professional' && <ProfessionalTab />}
      {activeTab === 'personal' && <PersonalTab />}
      {activeTab === 'leave' && <LeaveTab />}
      {activeTab === 'documents' && <DocumentsTab />}
      {activeTab === 'security' && <SecurityTab />}
    </div>
  );
}
