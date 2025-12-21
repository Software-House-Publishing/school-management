import { useState } from 'react';
import { AnnouncementFeed, Announcement } from '@/components/shared/AnnouncementFeed';

export default function TeacherAnnouncements() {
  // Mock data for teacher announcements
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Exam Schedule Update',
      content: 'The final exam schedule has been updated. Please review the new dates in the exams section.',
      date: '2025-04-18',
      author: 'Academic Dean',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Staff Meeting',
      content: 'There will be a mandatory staff meeting on Monday morning at 8:00 AM.',
      date: '2025-04-15',
      author: 'Principal',
      priority: 'normal',
    },
    {
      id: '3',
      title: 'New Grading Policy',
      content: 'Please familiarize yourself with the new grading policy effective from next semester.',
      date: '2025-04-01',
      author: 'School Admin',
      priority: 'normal',
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500 mt-2">Latest updates and news for faculty members.</p>
      </div>

      <AnnouncementFeed
        title="Faculty Bulletin"
        subtitle="Staff announcements and notices"
        announcements={announcements}
        isAdmin={false} // Teachers usually can't add announcements here, they consume them
      />
    </div>
  );
}