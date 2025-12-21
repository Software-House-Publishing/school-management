import { useState } from 'react';
import { AnnouncementFeed, Announcement } from '@/components/shared/AnnouncementFeed';

export default function SystemAnnouncements() {
    // Mock data for system announcements
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: '1',
            title: 'Scheduled Maintenance',
            content: 'The platform will undergo scheduled maintenance on Sunday at 2:00 AM EST. Expected downtime is approximately 30 minutes.',
            date: '2025-04-15',
            author: 'System Admin',
            priority: 'urgent',
        },
        {
            id: '2',
            title: 'New Feature Report',
            content: 'We have deployed the new advanced reporting module. Check out the Reports section to see the new capabilities.',
            date: '2025-04-10',
            author: 'Product Team',
            priority: 'high',
        },
        {
            id: '3',
            title: 'Welcome to Classivo 2.0',
            content: 'Welcome to the new version of the administration portal. We hope you enjoy the improved experience.',
            date: '2025-04-01',
            author: 'System Admin',
            priority: 'normal',
        },
    ]);

    const handleAdd = () => {
        // Placeholder for add functionality
        console.log("Add announcement clicked");
        const newAnnouncement: Announcement = {
            id: Math.random().toString(),
            title: 'New Announcement',
            content: 'This is a new announcement placeholder.',
            date: new Date().toISOString().split('T')[0],
            author: 'Me',
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
                <h1 className="text-3xl font-bold text-gray-900">Platform Announcements</h1>
                <p className="text-gray-500 mt-2">Manage system-wide announcements visible to all schools.</p>
            </div>

            <AnnouncementFeed
                title="System Bulletins"
                subtitle="Post updates for school administrators and staff"
                announcements={announcements}
                isAdmin={true}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
