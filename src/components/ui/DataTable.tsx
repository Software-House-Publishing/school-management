import { useState, useMemo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T) => ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, searchTerm: string) => boolean;
  filters?: Filter[];
  itemsPerPage?: number;
  entityName?: string;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  showActions?: boolean;
}

// ============================================================
// DATA TABLE COMPONENT
// ============================================================

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search...',
  searchFilter,
  filters = [],
  itemsPerPage = 10,
  entityName = 'items',
  onView,
  onEdit,
  onDelete,
  onRowClick,
  emptyIcon,
  emptyTitle = 'No items found',
  emptyDescription = 'Try adjusting your search or filters',
  showActions = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce((acc, f) => ({ ...acc, [f.key]: 'all' }), {})
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filtered = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (search && searchFilter && !searchFilter(item, search.toLowerCase())) {
        return false;
      }

      // Custom filters
      for (const filter of filters) {
        const filterValue = filterValues[filter.key];
        if (filterValue && filterValue !== 'all') {
          // Access nested properties using dot notation
          const keys = filter.key.split('.');
          let itemValue: unknown = item;
          for (const k of keys) {
            itemValue = (itemValue as Record<string, unknown>)?.[k];
          }
          if (itemValue !== filterValue) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, search, searchFilter, filters, filterValues]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, filterValues]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const hasActions = showActions && (onView || onEdit || onDelete);

  return (
    <Card padding="lg" className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {searchFilter && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full rounded-md border px-3 py-2 pl-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {filters.map((filter) => (
          <select
            key={filter.key}
            className="rounded-md border px-3 py-2 text-sm"
            value={filterValues[filter.key]}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          >
            <option value="all">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="w-[120px] px-3 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {col.render(item)}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-3 py-3 text-center">
                    <div
                      className="flex justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="text-violet-500 hover:text-white hover:bg-violet-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-500 hover:text-white hover:bg-blue-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-3 py-12 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon || <Search className="w-10 h-10 text-gray-300 mb-3" />}
                    <p className="font-medium">{emptyTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-medium text-gray-900">
            {filtered.length > 0 ? startIndex + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-medium text-gray-900">
            {Math.min(endIndex, filtered.length)}
          </span>{' '}
          of <span className="font-medium text-gray-900">{filtered.length}</span>{' '}
          {entityName}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
