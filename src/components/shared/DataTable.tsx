import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/Button';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterDef {
    key: string;
    label: string; // e.g., "All Roles"
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    onSearch?: (term: string) => void;
    filters?: FilterDef[];
    actions?: React.ReactNode;
    pagination?: PaginationProps;
    keyField?: keyof T; // Unique key for rows, default 'id'
}

type SortDirection = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    searchable = true,
    searchPlaceholder = "Search...",
    // onSearch, // Internal search for now if not provided
    filters,
    actions,
    pagination,
    keyField = 'id',
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Internal Search & Sort Logic (if backend matching not required)
    const processedData = useMemo(() => {
        let result = [...data];

        // 1. Search (Simple string match across all string fields)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(lowerTerm)
                )
            );
        }

        // 2. Sort
        if (sortField) {
            result.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, sortField, sortDirection]);

    // Handle Sort
    const handleSort = (field: keyof T) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: keyof T }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 opacity-50" />;
        return sortDirection === 'asc'
            ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
            : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
    };

    return (
        <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-1">
                {/* Search */}
                {searchable && (
                    <div className="relative w-full sm:w-72 group shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        </div>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {/* Filters & Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {filters?.map((filter) => (
                        <div key={filter.key} className="relative min-w-[140px]">
                            <select
                                className="appearance-none block w-full pl-3 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                            >
                                <option value="all">{filter.label}</option>
                                {filter.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-gray-500">
                                {filter.icon || <Filter className="h-3.5 w-3.5" />}
                            </div>
                        </div>
                    ))}

                    {actions}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${col.sortable ? 'cursor-pointer hover:bg-gray-100 disabled:cursor-default' : ''} ${col.className || ''}`}
                                        onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                                    >
                                        <div className={`flex items-center gap-1 ${col.className?.includes('text-center') ? 'justify-center' : ''} ${col.className?.includes('text-right') ? 'justify-end' : ''}`}>
                                            {col.header}
                                            {col.sortable && col.accessorKey && <SortIcon field={col.accessorKey} />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Keep the loading row rendering logic as fallback or remove if overlay is enough */}
                            {processedData.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                <Search className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">No records found</p>
                                            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                processedData.map((item, rowIdx) => (
                                    <tr
                                        key={String(item[keyField]) || rowIdx}
                                        className="group hover:bg-gray-50/80 transition-colors duration-150 ease-in-out"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.className || ''}`}>
                                                {col.cell ? col.cell(item) : (col.accessorKey ? item[col.accessorKey] : '')}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-900">{Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}</span> to <span className="font-semibold text-gray-900">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="font-semibold text-gray-900">{pagination.totalItems}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.currentPage === 1}
                                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                className="h-8 w-8 p-0 bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium text-gray-500 px-2">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                className="h-8 w-8 p-0 bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
