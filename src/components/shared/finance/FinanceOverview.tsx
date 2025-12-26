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
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

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
  data: FinanceDataPoint[];
  metrics: FinanceMetrics;
  title?: string;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function FinanceOverview({
  data,
  metrics,
  title = 'Financial Overview',
}: FinanceOverviewProps) {
  const isPositiveGrowth = metrics.growth >= 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-emerald-200/50 rounded-full">
              <DollarSign className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {formatCurrency(metrics.totalExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-200/50 rounded-full">
              <Wallet className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Net Income</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(metrics.netIncome)}
              </p>
            </div>
            <div className="p-3 bg-blue-200/50 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            isPositiveGrowth
              ? 'from-green-50 to-green-100 border-green-200'
              : 'from-orange-50 to-orange-100 border-orange-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isPositiveGrowth ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                Growth
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  isPositiveGrowth ? 'text-green-900' : 'text-orange-900'
                }`}
              >
                {isPositiveGrowth ? '+' : ''}
                {metrics.growth.toFixed(1)}%
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                isPositiveGrowth ? 'bg-green-200/50' : 'bg-orange-200/50'
              }`}
            >
              {isPositiveGrowth ? (
                <TrendingUp
                  className={`w-6 h-6 ${
                    isPositiveGrowth ? 'text-green-700' : 'text-orange-700'
                  }`}
                />
              ) : (
                <TrendingDown className="w-6 h-6 text-orange-700" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expensesGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
