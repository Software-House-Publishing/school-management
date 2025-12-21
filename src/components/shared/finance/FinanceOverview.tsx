import React from 'react';
import { Card } from '@/components/ui/Card';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export interface FinanceDataPoint {
    name: string;
    revenue: number;
    expenses: number;
}

export interface FinanceMetrics {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    growth: number;
}

interface FinanceOverviewProps {
    title?: string;
    data: FinanceDataPoint[];
    metrics: FinanceMetrics;
    loading?: boolean;
}

export function FinanceOverview({
    title = "Financial Overview",
    data,
    metrics,
    loading = false,
}: FinanceOverviewProps) {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse h-32">
                            <div />
                        </Card>
                    ))}
                </div>
                <Card className="animate-pulse h-96">
                    <div />
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(metrics.totalRevenue)}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(metrics.totalExpenses)}
                            </h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Net Income</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(metrics.netIncome)}
                            </h3>
                            <p className={`text-sm mt-2 flex items-center ${metrics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metrics.growth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {Math.abs(metrics.growth)}% from last month
                            </p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                name="Revenue"
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#EF4444"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                name="Expenses"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
