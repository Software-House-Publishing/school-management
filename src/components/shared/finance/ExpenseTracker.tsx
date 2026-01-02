import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Filter, Plus, MoreVertical } from 'lucide-react';
import { DataTable, ColumnDef, FilterDef } from '@/components/shared/DataTable';

interface Expense {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    status: 'approved' | 'pending' | 'rejected';
    submittedBy: string;
}

const mockExpenses: Expense[] = [
    { id: '1', description: 'Office Supplies', category: 'Supplies', amount: 450.00, date: '2024-12-20', status: 'approved', submittedBy: 'Admin Staff' },
    { id: '2', description: 'HVAC Maintenance', category: 'Maintenance', amount: 1200.00, date: '2024-12-18', status: 'approved', submittedBy: 'Facilities Mgr' },
    { id: '3', description: 'Science Lab Equipment', category: 'Education', amount: 3500.00, date: '2024-12-15', status: 'pending', submittedBy: 'Science Dept' },
    { id: '4', description: 'Internet Service Bill', category: 'Utilities', amount: 200.00, date: '2024-12-10', status: 'approved', submittedBy: 'IT Dept' },
    { id: '5', description: 'Staff Lunch Catering', category: 'Events', amount: 850.00, date: '2024-12-05', status: 'rejected', submittedBy: 'Event Coordinator' },
];

export function ExpenseTracker() {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const columns: ColumnDef<Expense>[] = [
        {
            header: 'Description',
            accessorKey: 'description',
            sortable: true,
            cell: (expense) => <div className="font-medium text-gray-900">{expense.description}</div>
        },
        {
            header: 'Category',
            accessorKey: 'category',
            sortable: true,
            cell: (expense) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                    {expense.category}
                </span>
            )
        },
        {
            header: 'Submitted By',
            accessorKey: 'submittedBy',
            sortable: true,
            cell: (expense) => <span className="text-gray-600">{expense.submittedBy}</span>
        },
        {
            header: 'Date',
            accessorKey: 'date',
            sortable: true,
            cell: (expense) => <span className="text-gray-500">{expense.date}</span>
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            sortable: true,
            className: 'text-right',
            cell: (expense) => <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            sortable: true,
            className: 'text-center',
            cell: (expense) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: () => (
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
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
                { label: 'Approved', value: 'approved' },
                { label: 'Pending', value: 'pending' },
                { label: 'Rejected', value: 'rejected' },
            ]
        }
    ];

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return mockExpenses;
        return mockExpenses.filter(e => e.status === statusFilter);
    }, [statusFilter]);

    return (
        <Card className="p-0 overflow-hidden border-0 shadow-none">
            <DataTable
                data={filteredData}
                columns={columns}
                filters={filters}
                searchPlaceholder="Search expenses..."
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <Button className="items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                            <Plus className="w-4 h-4" />
                            Add Expense
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
