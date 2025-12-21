import { useState } from 'react';
import { AnnouncementFeed, Announcement } from '@/components/shared/AnnouncementFeed';

export default function SchoolAnnouncements() {
  // Mock data for school announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Parent-Teacher Meeting',
      content: 'The annual parent-teacher meeting is scheduled for next Friday, April 20th, from 4:00 PM to 7:00 PM in the main hall.',
      date: '2025-04-12',
      author: 'Principal',
      priority: 'high',
    },
    {
      id: '2',
      title: 'School Sports Day',
      content: 'Sports day will be held on May 5th. Students are encouraged to register for events with their PE teachers.',
      date: '2025-04-10',
      author: 'Sports Dept',
      priority: 'normal',
    },
    {
      id: '3',
      title: 'Library Renovation',
      content: 'The school library will be closed for renovation from April 25th to May 1st. Please borrow books beforehand.',
      date: '2025-04-05',
      author: 'Librarian',
      priority: 'normal',
    },
  ]);

  const handleAdd = () => {
    // Placeholder for add functionality
    console.log("Add announcement clicked");
    const newAnnouncement: Announcement = {
      id: Math.random().toString(),
      title: 'New School Announcement',
      content: 'This is a new school announcement placeholder.',
      date: new Date().toISOString().split('T')[0],
      author: 'School Admin',
      priority: 'normal',
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleEdit = (id: string) => {
    console.log("Edit announcement", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete announcement", id);
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">School Announcements</h1>
        <p className="text-gray-500 mt-2">Manage announcements for students and teachers.</p>
      </div>

      <AnnouncementFeed
        title="School Bulletin Board"
        subtitle="Latest news and updates for the school community"
        announcements={announcements}
        isAdmin={true}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}