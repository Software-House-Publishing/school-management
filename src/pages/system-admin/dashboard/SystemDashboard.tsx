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
import { FinanceOverview, FinanceDataPoint, FinanceMetrics } from '@/components/shared/finance/FinanceOverview';

// Dummy data for System
const platformGrowthData = [
    { month: 'Jan', schools: 10 },
    { month: 'Feb', schools: 12 },
    { month: 'Mar', schools: 15 },
    { month: 'Apr', schools: 18 },
    { month: 'May', schools: 22 },
    { month: 'Jun', schools: 25 },
];

const globalRevenueData = [
    { month: 'Jan', revenue: 100000 },
    { month: 'Feb', revenue: 120000 },
    { month: 'Mar', revenue: 150000 },
    { month: 'Apr', revenue: 180000 },
    { month: 'May', revenue: 220000 },
    { month: 'Jun', revenue: 250000 },
];

const financeData: FinanceDataPoint[] = [
    { name: 'Jan', revenue: 100000, expenses: 60000 },
    { name: 'Feb', revenue: 120000, expenses: 70000 },
    { name: 'Mar', revenue: 150000, expenses: 80000 },
    { name: 'Apr', revenue: 180000, expenses: 90000 },
    { name: 'May', revenue: 220000, expenses: 100000 },
    { name: 'Jun', revenue: 250000, expenses: 110000 },
];

const financeMetrics: FinanceMetrics = {
    totalRevenue: 1020000,
    totalExpenses: 510000,
    netIncome: 510000,
    growth: 15.2,
};

export default function SystemDashboard() {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {t('dashboard.welcome', { name: user?.firstName || 'System Admin' })}
                </h1>
                <p className="text-gray-600 mt-2">
                    System-wide administration and monitoring.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-sm font-medium text-gray-500">Total Schools</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">128</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">45,230</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">3,421</p>
                </Card>
                <Card>
                    <h3 className="text-sm font-medium text-gray-500">Platform Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">$1.2M</p>
                </Card>
            </div>

            {/* Finance Section */}
            <FinanceOverview
                data={financeData}
                metrics={financeMetrics}
                title="Global Financial Performance"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            <span>Server Load</span>
                            <span className="text-blue-600 font-medium">24%</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-lg font-semibold mb-4">School Growth Trend</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platformGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="schools" radius={[8, 8, 0, 0]} fill="#4338ca" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">Global Revenue Trend</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={globalRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    strokeWidth={2}
                                    stroke="#4338ca"
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
