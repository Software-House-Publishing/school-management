import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  X,
  School,
  GraduationCap,
  UserCheck,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Calendar,
  Paperclip,
  Image,
  FileText,
  Link2,
  Mail,
  MessageSquare,
  Pin,
  Repeat,
  BellRing,
  Globe,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { notifyAnnouncement } from '@/stores/notificationStore';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Types
interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'image' | 'link';
  url: string;
  size?: string;
}

interface AdminAnnouncement {
  id: string;
  title: string;
  body: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: ('students' | 'teachers' | 'parents' | 'staff')[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  author: string;
  readCount: number;
  totalRecipients: number;
  // New fields
  isPinned?: boolean;
  sendEmail?: boolean;
  sendPush?: boolean;
  category?: 'general' | 'academic' | 'event' | 'emergency' | 'administrative';
  attachments?: Attachment[];
  allowComments?: boolean;
  recurringSchedule?: 'none' | 'daily' | 'weekly' | 'monthly';
}

// Format helpers
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateTimeStr: string): string {
  return new Date(dateTimeStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Category configuration
const categoryConfig = {
  general: { label: 'General', color: 'bg-gray-50 text-gray-700', icon: Globe },
  academic: { label: 'Academic', color: 'bg-blue-50 text-blue-700', icon: GraduationCap },
  event: { label: 'Event', color: 'bg-purple-50 text-purple-700', icon: Calendar },
  emergency: { label: 'Emergency', color: 'bg-red-50 text-red-700', icon: AlertCircle },
  administrative: { label: 'Administrative', color: 'bg-amber-50 text-amber-700', icon: FileText },
};

// Mock data for admin announcements
const adminAnnouncements: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'School Closed for Winter Break',
    body: 'Dear students and parents, the school will be closed from December 23rd to January 3rd for the winter break. Classes will resume on January 4th. We wish everyone a safe and happy holiday season! Please ensure all assignments are submitted before the break begins.',
    priority: 'important',
    targetAudience: ['students', 'teachers', 'parents'],
    status: 'published',
    publishedAt: '2024-12-15T09:00:00',
    createdAt: '2024-12-15T08:30:00',
    author: 'Principal Robert Brown',
    readCount: 892,
    totalRecipients: 1250,
    category: 'administrative',
    isPinned: true,
    sendEmail: true,
    sendPush: true,
  },
  {
    id: 'ann-2',
    title: 'Emergency Drill Scheduled',
    body: 'An emergency fire drill will be conducted on December 18th at 10:00 AM. All students and staff must participate. Please familiarize yourself with the evacuation procedures posted in each classroom. Teachers, please ensure your class roster is ready for headcount.',
    priority: 'urgent',
    targetAudience: ['students', 'teachers', 'staff'],
    status: 'published',
    publishedAt: '2024-12-16T14:00:00',
    createdAt: '2024-12-16T13:45:00',
    author: 'Admin Office',
    readCount: 756,
    totalRecipients: 980,
    category: 'emergency',
    sendPush: true,
  },
  {
    id: 'ann-3',
    title: 'Parent-Teacher Conference Registration Open',
    body: 'Parent-teacher conferences will be held on January 15-16. Parents can now register for time slots through the parent portal. Each session will be 15 minutes. Please contact the office if you need special accommodations.',
    priority: 'normal',
    targetAudience: ['parents', 'teachers'],
    status: 'published',
    publishedAt: '2024-12-14T10:00:00',
    createdAt: '2024-12-14T09:30:00',
    author: 'Admin Office',
    readCount: 423,
    totalRecipients: 850,
    category: 'event',
    sendEmail: true,
    attachments: [
      { id: 'att-1', name: 'Conference Schedule.pdf', type: 'file', url: '#', size: '245 KB' },
    ],
  },
  {
    id: 'ann-4',
    title: 'New Library Hours',
    body: 'Starting next semester, the school library will have extended hours. Monday-Thursday: 7:30 AM - 6:00 PM, Friday: 7:30 AM - 4:00 PM. Students are encouraged to utilize these extended hours for studying and research.',
    priority: 'normal',
    targetAudience: ['students', 'teachers'],
    status: 'published',
    publishedAt: '2024-12-10T11:00:00',
    createdAt: '2024-12-10T10:45:00',
    author: 'Library Services',
    readCount: 567,
    totalRecipients: 1100,
    category: 'general',
    allowComments: true,
  },
  {
    id: 'ann-5',
    title: 'Spring Sports Registration',
    body: 'Registration for spring sports teams (Baseball, Softball, Track & Field, Tennis) will open on January 8th. Students must have a current physical on file and maintain a minimum GPA of 2.0 to participate.',
    priority: 'normal',
    targetAudience: ['students', 'parents'],
    status: 'scheduled',
    scheduledAt: '2025-01-05T08:00:00',
    createdAt: '2024-12-20T15:00:00',
    author: 'Athletics Department',
    readCount: 0,
    totalRecipients: 900,
    category: 'event',
    sendEmail: true,
    attachments: [
      { id: 'att-2', name: 'Sports Registration Form.pdf', type: 'file', url: '#', size: '180 KB' },
      { id: 'att-3', name: 'Physical Requirements', type: 'link', url: '#' },
    ],
  },
  {
    id: 'ann-6',
    title: 'Staff Professional Development Day',
    body: 'Reminder: January 10th is a professional development day for all staff. Students will not have classes. Please check your email for the detailed schedule and workshop assignments.',
    priority: 'important',
    targetAudience: ['teachers', 'staff'],
    status: 'draft',
    createdAt: '2024-12-21T09:00:00',
    author: 'HR Department',
    readCount: 0,
    totalRecipients: 120,
    category: 'academic',
    recurringSchedule: 'monthly',
  },
];

const priorityColors = {
  urgent: 'bg-red-50 text-red-700 border-red-100',
  important: 'bg-amber-50 text-amber-700 border-amber-100',
  normal: 'bg-gray-50 text-gray-600 border-gray-100',
};

const statusColors = {
  published: 'bg-emerald-50 text-emerald-700',
  scheduled: 'bg-blue-50 text-blue-700',
  draft: 'bg-gray-50 text-gray-600',
};

const statusIcons = {
  published: CheckCircle2,
  scheduled: Clock,
  draft: Edit2,
};

const audienceIcons = {
  students: GraduationCap,
  teachers: UserCheck,
  parents: Users,
  staff: School,
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE/EDIT ANNOUNCEMENT MODAL - Enhanced
───────────────────────────────────────────────────────────────────────────── */
function CreateAnnouncementModal({
  onClose,
  announcement,
  onSave,
}: {
  onClose: () => void;
  announcement?: AdminAnnouncement | null;
  onSave: (data: Partial<AdminAnnouncement>, publish: boolean) => void;
}) {
  const isEditing = !!announcement;

  // Basic fields
  const [title, setTitle] = useState(announcement?.title || '');
  const [body, setBody] = useState(announcement?.body || '');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>(
    announcement?.priority || 'normal'
  );
  const [targetAudience, setTargetAudience] = useState<
    ('students' | 'teachers' | 'parents' | 'staff')[]
  >(announcement?.targetAudience || ['students']);
  const [category, setCategory] = useState<'general' | 'academic' | 'event' | 'emergency' | 'administrative'>(
    announcement?.category || 'general'
  );

  // Scheduling
  const [scheduleForLater, setScheduleForLater] = useState(
    announcement?.status === 'scheduled'
  );
  const [scheduledDate, setScheduledDate] = useState(
    announcement?.scheduledAt?.split('T')[0] || ''
  );
  const [scheduledTime, setScheduledTime] = useState(
    announcement?.scheduledAt?.split('T')[1]?.slice(0, 5) || ''
  );
  const [hasExpiry, setHasExpiry] = useState(!!announcement?.expiresAt);
  const [expiryDate, setExpiryDate] = useState(
    announcement?.expiresAt?.split('T')[0] || ''
  );
  const [recurringSchedule, setRecurringSchedule] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(
    announcement?.recurringSchedule || 'none'
  );

  // Delivery options
  const [sendEmail, setSendEmail] = useState(announcement?.sendEmail || false);
  const [sendPush, setSendPush] = useState(announcement?.sendPush || false);
  const [isPinned, setIsPinned] = useState(announcement?.isPinned || false);
  const [allowComments, setAllowComments] = useState(announcement?.allowComments || false);

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>(announcement?.attachments || []);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');

  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleAudience = (audience: 'students' | 'teachers' | 'parents' | 'staff') => {
    setTargetAudience((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

  const selectAllAudience = () => {
    setTargetAudience(['students', 'teachers', 'parents', 'staff']);
  };

  const handleAddLink = () => {
    if (linkUrl && linkName) {
      setAttachments((prev) => [
        ...prev,
        { id: `link-${Date.now()}`, name: linkName, type: 'link', url: linkUrl },
      ]);
      setLinkUrl('');
      setLinkName('');
      setShowLinkInput(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(0)} KB`,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = (publish: boolean) => {
    if (!title.trim() || !body.trim() || targetAudience.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const data: Partial<AdminAnnouncement> = {
      title,
      body,
      priority,
      targetAudience,
      category,
      scheduledAt:
        scheduleForLater && scheduledDate && scheduledTime
          ? `${scheduledDate}T${scheduledTime}:00`
          : undefined,
      expiresAt: hasExpiry && expiryDate ? `${expiryDate}T23:59:59` : undefined,
      recurringSchedule: recurringSchedule !== 'none' ? recurringSchedule : undefined,
      sendEmail,
      sendPush,
      isPinned,
      allowComments,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    onSave(data, publish);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Announcement' : 'Create Announcement'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing
                ? 'Update the announcement details'
                : 'Create a new school-wide announcement'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-2">
                {(['normal', 'important', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors capitalize',
                      priority === p
                        ? priorityColors[p]
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={selectAllAudience}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Select All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['students', 'teachers', 'parents', 'staff'] as const).map((audience) => {
                const Icon = audienceIcons[audience];
                const isSelected = targetAudience.includes(audience);
                return (
                  <button
                    key={audience}
                    type="button"
                    onClick={() => toggleAudience(audience)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors capitalize',
                      isSelected
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {audience}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your announcement message..."
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{body.length} characters</span>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      {att.type === 'file' && <FileText className="h-4 w-4 text-blue-600" />}
                      {att.type === 'image' && <Image className="h-4 w-4 text-green-600" />}
                      {att.type === 'link' && <Link2 className="h-4 w-4 text-purple-600" />}
                      <span className="text-sm text-gray-700">{att.name}</span>
                      {att.size && <span className="text-xs text-gray-400">({att.size})</span>}
                    </div>
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Link Input */}
            {showLinkInput && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="Link name"
                  className="flex-1 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleAddLink}
                  className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowLinkInput(false)}
                  className="px-3 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Attachment Buttons */}
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                <Paperclip className="h-4 w-4" />
                Attach File
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowLinkInput(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Link2 className="h-4 w-4" />
                Add Link
              </button>
            </div>
          </div>

          {/* Scheduling Section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              Scheduling Options
            </div>

            {/* Schedule for Later */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleForLater}
                  onChange={(e) => setScheduleForLater(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Schedule for later</span>
              </label>

              {scheduleForLater && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => setHasExpiry(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Set expiry date</span>
              </label>

              {hasExpiry && (
                <div className="pl-6">
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Announcement will be automatically hidden after this date
                  </p>
                </div>
              )}
            </div>

            {/* Recurring Schedule */}
            {scheduleForLater && (
              <div className="pl-6">
                <label className="block text-sm text-gray-700 mb-1">Repeat</label>
                <select
                  value={recurringSchedule}
                  onChange={(e) => setRecurringSchedule(e.target.value as typeof recurringSchedule)}
                  className="w-full max-w-xs rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-4">
                {/* Delivery Options */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <BellRing className="h-4 w-4" />
                    Delivery Options
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Send Email</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={sendPush}
                        onChange={(e) => setSendPush(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Push Notification</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Info className="h-4 w-4" />
                    Display Options
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Pin to Top</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Allow Comments</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-6 border-t shrink-0 bg-gray-50">
          <div className="text-xs text-gray-500">
            {scheduleForLater && scheduledDate && scheduledTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Will be published on {formatDate(scheduledDate)} at {scheduledTime}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-white rounded-lg transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              {scheduleForLater ? 'Schedule' : 'Publish Now'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANNOUNCEMENT DETAIL MODAL
───────────────────────────────────────────────────────────────────────────── */
function AnnouncementDetailModal({
  announcement,
  onClose,
  onEdit,
  onDelete,
}: {
  announcement: AdminAnnouncement;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const StatusIcon = statusIcons[announcement.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50 text-green-700">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{announcement.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full border font-medium',
                    priorityColors[announcement.priority]
                  )}
                >
                  {announcement.priority}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                    statusColors[announcement.status]
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {announcement.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Target Audience */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Sent to:</span>
            <div className="flex gap-2">
              {announcement.targetAudience.map((audience) => {
                const Icon = audienceIcons[audience];
                return (
                  <span
                    key={audience}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize"
                  >
                    <Icon className="h-3 w-3" />
                    {audience}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {announcement.body}
          </p>

          {/* Meta Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Posted by{' '}
                <span className="font-medium text-gray-700">{announcement.author}</span>
              </div>
              <div>
                {announcement.status === 'published' && announcement.publishedAt
                  ? `Published ${formatDateTime(announcement.publishedAt)}`
                  : announcement.status === 'scheduled' && announcement.scheduledAt
                  ? `Scheduled for ${formatDateTime(announcement.scheduledAt)}`
                  : `Created ${formatDateTime(announcement.createdAt)}`}
              </div>
            </div>

            {/* Read Stats */}
            {announcement.status === 'published' && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{announcement.readCount} read</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{announcement.totalRecipients} recipients</span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${
                        (announcement.readCount / announcement.totalRecipients) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (announcement.readCount / announcement.totalRecipients) * 100
                  )}
                  %
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminAnnouncement() {
  const [announcements, setAnnouncements] =
    useState<AdminAnnouncement[]>(adminAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AdminAnnouncement | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AdminAnnouncement | null>(null);

  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.body.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [announcements, searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: announcements.length,
      published: announcements.filter((a) => a.status === 'published').length,
      scheduled: announcements.filter((a) => a.status === 'scheduled').length,
      draft: announcements.filter((a) => a.status === 'draft').length,
    };
  }, [announcements]);

  const handleSaveAnnouncement = (
    data: Partial<AdminAnnouncement>,
    publish: boolean
  ) => {
    const now = new Date().toISOString();

    if (editingAnnouncement) {
      // Update existing
      setAnnouncements((prev) =>
        prev.map((a) => {
          if (a.id === editingAnnouncement.id) {
            const status = publish
              ? data.scheduledAt
                ? 'scheduled'
                : 'published'
              : 'draft';
            return {
              ...a,
              ...data,
              status,
              publishedAt: status === 'published' ? now : undefined,
            } as AdminAnnouncement;
          }
          return a;
        })
      );
      setEditingAnnouncement(null);
    } else {
      // Create new
      const status = publish
        ? data.scheduledAt
          ? 'scheduled'
          : 'published'
        : 'draft';

      const newAnnouncement: AdminAnnouncement = {
        id: `ann-${Date.now()}`,
        title: data.title!,
        body: data.body!,
        priority: data.priority || 'normal',
        targetAudience: data.targetAudience || ['students'],
        status,
        scheduledAt: data.scheduledAt,
        publishedAt: status === 'published' ? now : undefined,
        createdAt: now,
        author: 'Admin', // Would come from auth context
        readCount: 0,
        totalRecipients: 1000, // Would be calculated based on target audience
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      // Send notification if published
      if (status === 'published') {
        const roleMapping: Record<string, string> = {
          students: 'student',
          teachers: 'teacher',
          parents: 'parent',
          staff: 'staff',
        };
        const targetRoles = data.targetAudience?.map((a) => roleMapping[a]) || [];
        notifyAnnouncement(
          data.title!,
          data.body!.slice(0, 100) + '...',
          targetRoles,
          newAnnouncement.id
        );
      }

      setShowCreateModal(false);
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnnouncement(null);
  };

  // Search filter for DataTable
  const searchFilter = (announcement: AdminAnnouncement, term: string): boolean => {
    return (
      announcement.title.toLowerCase().includes(term) ||
      announcement.body.toLowerCase().includes(term) ||
      announcement.author.toLowerCase().includes(term)
    );
  };

  // Table columns
  const columns: Column<AdminAnnouncement>[] = [
    {
      key: 'announcement',
      header: 'Announcement',
      width: '40%',
      render: (a) => {
        const StatusIcon = statusIcons[a.status];
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 truncate">{a.title}</span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full border font-medium capitalize',
                  priorityColors[a.priority]
                )}
              >
                {a.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{a.body}</p>
          </div>
        );
      },
    },
    {
      key: 'audience',
      header: 'Audience',
      width: '20%',
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.targetAudience.slice(0, 2).map((audience) => {
            const Icon = audienceIcons[audience];
            return (
              <span
                key={audience}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize"
              >
                <Icon className="h-3 w-3" />
                {audience}
              </span>
            );
          })}
          {a.targetAudience.length > 2 && (
            <span className="text-xs text-gray-500">
              +{a.targetAudience.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      align: 'center',
      render: (a) => {
        const StatusIcon = statusIcons[a.status];
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize',
              statusColors[a.status]
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {a.status}
          </span>
        );
      },
    },
    {
      key: 'engagement',
      header: 'Engagement',
      width: '15%',
      render: (a) => {
        if (a.status !== 'published') {
          return <span className="text-xs text-gray-400">-</span>;
        }
        const percentage = Math.round((a.readCount / a.totalRecipients) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{percentage}%</span>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      width: '13%',
      render: (a) => (
        <span className="text-xs text-gray-500">
          {a.status === 'published' && a.publishedAt
            ? formatDate(a.publishedAt)
            : a.status === 'scheduled' && a.scheduledAt
            ? formatDate(a.scheduledAt)
            : formatDate(a.createdAt)}
        </span>
      ),
    },
  ];

  // Filters
  const filters = [
    {
      key: 'status',
      label: 'All Status',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'draft', label: 'Draft' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage school-wide announcements
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Megaphone className="h-4 w-4" />
            <span className="text-xs">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Published</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.published}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Scheduled</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Edit2 className="h-4 w-4" />
            <span className="text-xs">Drafts</span>
          </div>
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredAnnouncements}
        columns={columns}
        keyExtractor={(a) => a.id}
        searchPlaceholder="Search announcements..."
        searchFilter={searchFilter}
        filters={filters}
        entityName="announcements"
        onView={(a) => setSelectedAnnouncement(a)}
        onEdit={(a) => {
          setEditingAnnouncement(a);
          setShowCreateModal(true);
        }}
        onDelete={(a) => handleDeleteAnnouncement(a.id)}
        onRowClick={(a) => setSelectedAnnouncement(a)}
        emptyIcon={<Megaphone className="w-10 h-10 text-gray-300 mb-3" />}
        emptyTitle="No announcements found"
        emptyDescription="Create your first announcement to get started"
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateAnnouncementModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingAnnouncement(null);
          }}
          announcement={editingAnnouncement}
          onSave={handleSaveAnnouncement}
        />
      )}

      {selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          onEdit={() => {
            setEditingAnnouncement(selectedAnnouncement);
            setSelectedAnnouncement(null);
            setShowCreateModal(true);
          }}
          onDelete={() => handleDeleteAnnouncement(selectedAnnouncement.id)}
        />
      )}
    </div>
  );
}
