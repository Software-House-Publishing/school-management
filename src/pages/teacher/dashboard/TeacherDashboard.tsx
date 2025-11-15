import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user?.firstName || 'Teacher' })}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your courses, students, and academic activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">120</p>
        </Card>
        <Card>
        <h3 className="text-sm font-medium text-gray-500">Upcoming Exams</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Pending Grades</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">25</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Student Submissions</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">Assignment: Chapter 5 Review</h3>
              <p className="text-sm text-gray-600">15 students submitted</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">Lab Report: Chemical Reactions</h3>
              <p className="text-sm text-gray-600">22 students submitted</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Physics 101</h3>
                <p className="text-sm text-gray-600">Room 205</p>
              </div>
              <span className="text-sm text-blue-600 font-medium">9:00 AM</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Chemistry Lab</h3>
                <p className="text-sm text-gray-600">Lab 3</p>
              </div>
              <span className="text-sm text-green-600 font-medium">2:00 PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}