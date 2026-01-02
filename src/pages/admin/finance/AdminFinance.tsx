import { useState } from 'react';
import { FinanceOverview, FinanceDataPoint, FinanceMetrics } from '@/components/shared/finance/FinanceOverview';
import { FeeManagement } from '@/components/shared/finance/FeeManagement';
import { ExpenseTracker } from '@/components/shared/finance/ExpenseTracker';
import { PayrollOverview } from '@/components/shared/finance/PayrollOverview';
import { LayoutDashboard, Wallet, CreditCard, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

type TabType = 'dashboard' | 'fees' | 'expenses' | 'payroll';

export default function AdminFinance() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <FinanceOverview
            title="Overview"
            data={financeData}
            metrics={financeMetrics}
          />
        );
      case 'fees':
        return <FeeManagement />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'payroll':
        return <PayrollOverview />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Manage school finances, fees, expenses, and payroll.</p>
        </div>
        <Button variant="outline" className="gap-2 hidden sm:flex">
          <Download className="w-4 h-4" />
          Export Reports
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'fees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Wallet className="w-4 h-4" />
            Fee Management
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'expenses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <CreditCard className="w-4 h-4" />
            Expense Tracking
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'payroll'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Users className="w-4 h-4" />
            Payroll
          </button>
        </nav>
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
}
