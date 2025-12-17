import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user?.firstName || 'Student' })}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your academic overview and upcoming activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">6</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Upcoming Exams</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Average Grade</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">B+</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Outstanding Fees</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$0</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Mid-term Exam Schedule</h3>
              <p className="text-sm text-blue-700 mt-1">Mid-term exams will start from next Monday.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">New Course Available</h3>
              <p className="text-sm text-green-700 mt-1">Advanced Mathematics course is now open for enrollment.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Physics Exam</h3>
                <p className="text-sm text-gray-600">March 15, 2024</p>
              </div>
              <span className="text-sm text-blue-600 font-medium">9:00 AM</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Chemistry Lab</h3>
                <p className="text-sm text-gray-600">March 16, 2024</p>
              </div>
              <span className="text-sm text-green-600 font-medium">2:00 PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}