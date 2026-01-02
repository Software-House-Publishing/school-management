import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DollarSign, Users, Briefcase, CheckCircle } from 'lucide-react';
import { DataTable, ColumnDef, FilterDef } from '@/components/shared/DataTable';

interface PayrollRecord {
    id: string;
    employeeName: string;
    role: string;
    baseSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    status: 'paid' | 'processing' | 'pending';
    paymentDate: string;
}

const mockPayroll: PayrollRecord[] = [
    { id: '1', employeeName: 'Dr. Sarah Smith', role: 'Principal', baseSalary: 8500, bonus: 500, deductions: 1200, netSalary: 7800, status: 'paid', paymentDate: '2024-11-30' },
    { id: '2', employeeName: 'James Wilson', role: 'Senior Teacher', baseSalary: 5500, bonus: 200, deductions: 800, netSalary: 4900, status: 'paid', paymentDate: '2024-11-30' },
    { id: '3', employeeName: 'Maria Garcia', role: 'Teacher', baseSalary: 4200, bonus: 0, deductions: 600, netSalary: 3600, status: 'paid', paymentDate: '2024-11-30' },
    { id: '4', employeeName: 'Robert Johnson', role: 'Janitor', baseSalary: 2800, bonus: 100, deductions: 300, netSalary: 2600, status: 'paid', paymentDate: '2024-11-30' },
    { id: '5', employeeName: 'New Hire', role: 'Intern', baseSalary: 2000, bonus: 0, deductions: 100, netSalary: 1900, status: 'pending', paymentDate: '2024-12-30' },
];

export function PayrollOverview() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

    const columns: ColumnDef<PayrollRecord>[] = [
        {
            header: 'Employee',
            accessorKey: 'employeeName',
            sortable: true,
            cell: (record) => <div className="font-medium text-gray-900">{record.employeeName}</div>
        },
        {
            header: 'Role',
            accessorKey: 'role',
            sortable: true,
            cell: (record) => <span className="text-gray-600">{record.role}</span>
        },
        {
            header: 'Base Salary',
            accessorKey: 'baseSalary',
            sortable: true,
            className: 'text-right',
            cell: (record) => <span className="text-gray-600">{formatCurrency(record.baseSalary)}</span>
        },
        {
            header: 'Bonus',
            accessorKey: 'bonus',
            sortable: true,
            className: 'text-right',
            cell: (record) => <span className="text-green-600">+{formatCurrency(record.bonus)}</span>
        },
        {
            header: 'Deductions',
            accessorKey: 'deductions',
            sortable: true,
            className: 'text-right',
            cell: (record) => <span className="text-red-600">-{formatCurrency(record.deductions)}</span>
        },
        {
            header: 'Net Pay',
            accessorKey: 'netSalary',
            sortable: true,
            className: 'text-right',
            cell: (record) => <span className="font-bold text-gray-900">{formatCurrency(record.netSalary)}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            sortable: true,
            className: 'text-center',
            cell: (record) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'paid' ? 'bg-green-100 text-green-700' :
                        record.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                    }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: () => (
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">Slip</Button>
            )
        }
    ];

    const filters: FilterDef[] = [
        {
            key: 'status',
            label: 'All Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'Paid', value: 'paid' },
                { label: 'Processing', value: 'processing' },
                { label: 'Pending', value: 'pending' },
            ]
        }
    ];

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return mockPayroll;
        return mockPayroll.filter(p => p.status === statusFilter);
    }, [statusFilter]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center gap-4 p-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Staff</p>
                        <p className="text-xl font-bold text-gray-900">48</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Payroll</p>
                        <p className="text-xl font-bold text-gray-900">$185,400</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-gray-900">2</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Paid</p>
                        <p className="text-xl font-bold text-gray-900">Nov 30</p>
                    </div>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden border-0 shadow-none">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="font-semibold text-gray-900">Payroll Records</h3>
                    <div className="flex gap-2">
                        <Button className="items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                            <DollarSign className="w-4 h-4" />
                            Run Payroll
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search employees..."
                    pagination={{
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: filteredData.length,
                        itemsPerPage: 10,
                        onPageChange: () => { }
                    }}
                />
            </Card>
        </div>
    );
}
