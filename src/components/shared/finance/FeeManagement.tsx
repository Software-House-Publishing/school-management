import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Download, Calendar } from 'lucide-react';
import { DataTable, ColumnDef, FilterDef } from '@/components/shared/DataTable';

interface StudentFee {
    id: string;
    studentName: string;
    studentId: string;
    class: string;
    totalFee: number;
    paid: number;
    balance: number;
    status: 'paid' | 'partial' | 'unpaid';
    dueDate: string;
}

const mockFees: StudentFee[] = [
    { id: '1', studentName: 'John Smith', studentId: 'ST-2024-001', class: 'Grade 10-A', totalFee: 5000, paid: 5000, balance: 0, status: 'paid', dueDate: '2024-12-01' },
    { id: '2', studentName: 'Sarah Johnson', studentId: 'ST-2024-002', class: 'Grade 10-A', totalFee: 5000, paid: 2500, balance: 2500, status: 'partial', dueDate: '2024-12-01' },
    { id: '3', studentName: 'Michael Brown', studentId: 'ST-2024-003', class: 'Grade 11-B', totalFee: 5500, paid: 0, balance: 5500, status: 'unpaid', dueDate: '2024-12-01' },
    { id: '4', studentName: 'Emily Davis', studentId: 'ST-2024-004', class: 'Grade 9-C', totalFee: 4800, paid: 4800, balance: 0, status: 'paid', dueDate: '2024-12-01' },
    { id: '5', studentName: 'David Wilson', studentId: 'ST-2024-005', class: 'Grade 12-A', totalFee: 6000, paid: 1000, balance: 5000, status: 'partial', dueDate: '2024-12-01' },
];

export function FeeManagement() {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'partial': return 'bg-orange-100 text-orange-700';
            case 'unpaid': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const columns: ColumnDef<StudentFee>[] = [
        {
            header: 'Student',
            accessorKey: 'studentName',
            sortable: true,
            cell: (fee) => (
                <div>
                    <div className="font-medium text-gray-900">{fee.studentName}</div>
                    <div className="text-xs text-gray-500">{fee.studentId}</div>
                </div>
            )
        },
        {
            header: 'Class',
            accessorKey: 'class',
            sortable: true,
            cell: (fee) => <span className="text-gray-600">{fee.class}</span>
        },
        {
            header: 'Total Fee',
            accessorKey: 'totalFee',
            sortable: true,
            className: 'text-right',
            cell: (fee) => <span className="font-medium text-gray-900">${fee.totalFee.toLocaleString()}</span>
        },
        {
            header: 'Paid',
            accessorKey: 'paid',
            sortable: true,
            className: 'text-right',
            cell: (fee) => <span className="text-green-600">${fee.paid.toLocaleString()}</span>
        },
        {
            header: 'Balance',
            accessorKey: 'balance',
            sortable: true,
            className: 'text-right',
            cell: (fee) => <span className="text-red-600">${fee.balance.toLocaleString()}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            sortable: true,
            className: 'text-center',
            cell: (fee) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Due Date',
            accessorKey: 'dueDate',
            sortable: true,
            cell: (fee) => (
                <div className="flex items-center text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {fee.dueDate}
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: () => (
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View
                </Button>
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
                { label: 'Partial', value: 'partial' },
                { label: 'Unpaid', value: 'unpaid' },
            ]
        }
    ];

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return mockFees;
        return mockFees.filter(fee => fee.status === statusFilter);
    }, [statusFilter]);

    return (
        <Card className="p-0 overflow-hidden border-0 shadow-none">
            <DataTable
                data={filteredData}
                columns={columns}
                filters={filters}
                searchPlaceholder="Search by name or ID..."
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="items-center gap-2 hidden sm:flex">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button className="items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Mail className="w-4 h-4" />
                            Send Reminders
                        </Button>
                    </div>
                }
                pagination={{
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: filteredData.length,
                    itemsPerPage: 10,
                    onPageChange: () => { }
                }}
            />
        </Card>
    );
}
