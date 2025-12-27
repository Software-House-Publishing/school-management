import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Eye,
  Users,
  X,
  BookOpen,
  Building,
  School,
} from 'lucide-react';
import {
  teacherAnnouncements,
  teacherCourses,
  Announcement,
  formatDate,
  formatDateTime,
} from '../data/teacherPortalData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const priorityColors = {
  urgent: 'bg-red-50 text-red-700 border-red-100',
  important: 'bg-amber-50 text-amber-700 border-amber-100',
  normal: 'bg-gray-50 text-gray-600 border-gray-100',
};

const scopeColors = {
  course: 'bg-blue-50 text-blue-700',
  department: 'bg-purple-50 text-purple-700',
  school: 'bg-green-50 text-green-700',
};

const scopeIcons = {
  course: BookOpen,
  department: Building,
  school: School,
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE ANNOUNCEMENT MODAL
───────────────────────────────────────────────────────────────────────────── */
function CreateAnnouncementModal({ onClose }: { onClose: () => void }) {
  const [scope, setScope] = useState<'course' | 'all_courses'>('course');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Announcement</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <div className="flex gap-3">
              <button
                onClick={() => setScope('course')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors',
                  scope === 'course'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                Specific Course
              </button>
              <button
                onClick={() => setScope('all_courses')}
                className={cn(
                  'flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors',
                  scope === 'all_courses'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                All My Courses
              </button>
            </div>
          </div>

          {scope === 'course' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
              <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none">
                {teacherCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - Section {course.section} ({course.students.filter(s => s.status === 'active').length} students)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter announcement title"
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none">
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={5}
              placeholder="Write your announcement..."
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Schedule for later</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              alert('Announcement posted! (Demo)');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Announcement
          </button>
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
}: {
  announcement: Announcement;
  onClose: () => void;
}) {
  const ScopeIcon = scopeIcons[announcement.scope];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className={cn('p-2.5 rounded-lg', scopeColors[announcement.scope])}>
              <ScopeIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{announcement.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priorityColors[announcement.priority])}>
                  {announcement.priority}
                </span>
                {announcement.courseCode && (
                  <span className="text-sm text-gray-500">
                    {announcement.courseCode} - Section {announcement.section}
                  </span>
                )}
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
          <p className="text-gray-700 whitespace-pre-wrap">{announcement.body}</p>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Posted by <span className="font-medium text-gray-700">{announcement.author}</span>
              </div>
              <div>{formatDateTime(announcement.createdAt)}</div>
            </div>

            {announcement.isOwn && announcement.readCount !== undefined && (
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
                    style={{ width: `${(announcement.readCount / (announcement.totalRecipients || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round((announcement.readCount / (announcement.totalRecipients || 1)) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          {announcement.isOwn && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            </>
          )}
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
export default function TeacherAnnouncements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = useMemo(() => {
    let announcements = teacherAnnouncements;

    if (scopeFilter === 'own') {
      announcements = announcements.filter((a) => a.isOwn);
    } else if (scopeFilter === 'school') {
      announcements = announcements.filter((a) => !a.isOwn);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      announcements = announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.body.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term)
      );
    }

    return announcements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [searchTerm, scopeFilter]);

  // Stats
  const stats = useMemo(() => {
    const ownAnnouncements = teacherAnnouncements.filter((a) => a.isOwn);
    return {
      total: teacherAnnouncements.length,
      own: ownAnnouncements.length,
      school: teacherAnnouncements.filter((a) => !a.isOwn).length,
      urgent: teacherAnnouncements.filter((a) => a.priority === 'urgent').length,
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Announcements</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage announcements for your courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Bell className="h-4 w-4" />
            <span className="text-xs">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">My Announcements</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.own}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <School className="h-4 w-4" />
            <span className="text-xs">From School</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.school}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Bell className="h-4 w-4" />
            <span className="text-xs">Urgent</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
        </Card>
      </div>

      {/* Filters & Create */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Tab-style filter buttons */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setScopeFilter('all')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                  scopeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Bell className="h-4 w-4" />
                All
              </button>
              <button
                onClick={() => setScopeFilter('own')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                  scopeFilter === 'own'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <BookOpen className="h-4 w-4" />
                My Announcements
              </button>
              <button
                onClick={() => setScopeFilter('school')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                  scopeFilter === 'school'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <School className="h-4 w-4" />
                School/Department
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        </div>

        {/* Announcement List */}
        <div className="divide-y">
          {filteredAnnouncements.map((announcement) => {
            const ScopeIcon = scopeIcons[announcement.scope];
            return (
              <div
                key={announcement.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className={cn('p-2.5 rounded-lg shrink-0', scopeColors[announcement.scope])}>
                  <ScopeIcon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">{announcement.title}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priorityColors[announcement.priority])}>
                      {announcement.priority}
                    </span>
                    {announcement.courseCode && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {announcement.courseCode}
                      </span>
                    )}
                    {announcement.isOwn && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.body}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>By {announcement.author}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                    {announcement.isOwn && announcement.readCount !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {announcement.readCount}/{announcement.totalRecipients}
                      </span>
                    )}
                  </div>
                </div>

                {announcement.isOwn && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Edit announcement (Demo)');
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Delete announcement (Demo)');
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No announcements found</p>
          </div>
        )}
      </Card>

      {/* Modals */}
      {showCreateModal && <CreateAnnouncementModal onClose={() => setShowCreateModal(false)} />}
      {selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
}
