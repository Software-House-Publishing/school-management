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
} from 'recharts';
import { FinanceOverview, FinanceDataPoint, FinanceMetrics } from '@/components/shared/finance/FinanceOverview';

// Dummy data for School
const enrollmentData = [
    { month: 'Jan', students: 450 },
    { month: 'Feb', students: 520 },
    { month: 'Mar', students: 610 },
    { month: 'Apr', students: 670 },
    { month: 'May', students: 710 },
    { month: 'Jun', students: 740 },
];

const financeData: FinanceDataPoint[] = [
    { name: 'Jan', revenue: 45000, expenses: 32000 },
    { name: 'Feb', revenue: 52000, expenses: 34000 },
    { name: 'Mar', revenue: 60000, expenses: 38000 },
    { name: 'Apr', revenue: 68000, expenses: 42000 },
    { name: 'May', revenue: 72000, expenses: 45000 },
    { name: 'Jun', revenue: 76000, expenses: 48000 },
];

const financeMetrics: FinanceMetrics = {
    totalRevenue: 373000,
    totalExpenses: 239000,
    netIncome: 134000,
    growth: 12.5,
};

export default function SchoolDashboard() {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {t('dashboard.welcome', { name: user?.firstName || 'School Admin' })}
                </h1>
                <p className="text-gray-600 mt-2">
                    School management overview.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-2xl font-bold text-gray-900 mt-1">$76,000</p>
                </Card>
            </div>

            {/* Finance Section */}
            <FinanceOverview
                data={financeData}
                metrics={financeMetrics}
                title="Financial Performance"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
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
                    <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Attendance Rate</span>
                            <span className="text-green-600 font-medium">95%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                            <span>Upcoming Exams</span>
                            <span className="text-blue-600 font-medium">12</span>
                        </div>
                    </div>
                </Card>
            </div>


            <div className="grid grid-cols-1 gap-8">
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
            </div>

        </div>
    );
} 
