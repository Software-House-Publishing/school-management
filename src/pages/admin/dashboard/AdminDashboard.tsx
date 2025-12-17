import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

// Dummy data for now – replace with real API data later
const enrollmentData = [
  { month: 'Jan', students: 450 },
  { month: 'Feb', students: 520 },
  { month: 'Mar', students: 610 },
  { month: 'Apr', students: 670 },
  { month: 'May', students: 710 },
  { month: 'Jun', students: 740 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 60000 },
  { month: 'Apr', revenue: 68000 },
  { month: 'May', revenue: 72000 },
  { month: 'Jun', revenue: 76000 },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user?.firstName || 'Admin' })}
        </h1>
        <p className="text-gray-600 mt-2">
          System administration and management dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,245</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Teachers</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">85</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$125,430</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent User Activity</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">New Student Registration</h3>
              <p className="text-sm text-gray-600">John Smith enrolled in Grade 10</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">Course Created</h3>
              <p className="text-sm text-gray-600">Advanced Physics course added by Dr. Johnson</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span>Database Status</span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span>API Response Time</span>
              <span className="text-green-600 font-medium">45ms</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span>Active Sessions</span>
              <span className="text-blue-600 font-medium">342</span>
            </div>
          </div>
        </Card>
      </div>

        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Student Enrollment Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" radius={[8, 8, 0, 0]} fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
} 