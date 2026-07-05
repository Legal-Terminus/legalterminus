import { useEffect, useState, type ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type ColumnSizingState,
  type SortingState,
  type Row,
} from '@tanstack/react-table';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Reusable data grid built on TanStack Table — the single source for the
 * sortable / searchable / paginated tables across the app (Users, Matters,
 * My Tasks, Reports). Encapsulates: sortable headers, global search, client-side
 * pagination, a desktop div-grid table (fixed column widths so rows stay aligned),
 * and an optional mobile-card renderer. Pass `columns` (TanStack ColumnDef[]) and
 * `data`; everything else is optional.
 */
export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  /** Stable row key. Defaults to the row index. */
  getRowId?: (row: T, index: number) => string;
  /** Show the search box. Provide `globalFilterFn` to control matching. */
  searchable?: boolean;
  searchPlaceholder?: string;
  globalFilterFn?: (row: Row<T>, columnId: string, filterValue: string) => boolean;
  /** Mobile (<md) card renderer. If omitted, the table shows on mobile too (scrolls). */
  renderMobileCard?: (row: T) => ReactNode;
  /** Rows per page. 0 disables pagination (show all). Default 25. */
  pageSize?: number;
  isLoading?: boolean;
  error?: Error | null;
  emptyLabel?: string;
  loadingLabel?: string;
  /** Extra content shown between the search box and the table (e.g. filter tabs). */
  toolbar?: ReactNode;
  /** Row click handler — makes the whole row clickable (cursor + hover). */
  onRowClick?: (row: T) => void;
  /** Stable id used to persist user-adjusted column widths to localStorage. */
  tableId?: string;
}

export default function DataGrid<T>({
  data,
  columns,
  getRowId,
  searchable = true,
  searchPlaceholder = 'Search…',
  globalFilterFn,
  renderMobileCard,
  pageSize = 25,
  isLoading,
  error,
  emptyLabel = 'No results',
  loadingLabel = 'Loading…',
  toolbar,
  onRowClick,
  tableId,
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const sizingKey = tableId ? `dataGridColSizing:${tableId}` : null;
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    if (!sizingKey) return {};
    try {
      const raw = localStorage.getItem(sizingKey);
      return raw ? (JSON.parse(raw) as ColumnSizingState) : {};
    } catch {
      return {};
    }
  });

  // Persist user-adjusted widths so they survive reloads.
  useEffect(() => {
    if (!sizingKey) return;
    try {
      localStorage.setItem(sizingKey, JSON.stringify(columnSizing));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [sizingKey, columnSizing]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: search, columnSizing },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    onColumnSizingChange: setColumnSizing,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    globalFilterFn: globalFilterFn
      ? (row, columnId, value) => globalFilterFn(row, columnId, String(value))
      : 'auto',
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pageSize > 0
      ? { getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize } } }
      : {}),
  });

  const rows = table.getRowModel().rows;
  const totalWidth = table.getTotalSize();
  const filteredCount = table.getFilteredRowModel().rows.length;
  const paginated = pageSize > 0;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      )}

      {toolbar}

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">{loadingLabel}</span>
        </div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">{error.message}</div>
      ) : rows.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-ink-faint">
          <p className="text-sm font-medium">{search ? 'No results found' : emptyLabel}</p>
        </div>
      ) : (
        <ErrorBoundary>
          {/* Desktop table */}
          <div className={`card overflow-hidden ${renderMobileCard ? 'hidden md:block' : ''}`}>
            <div className="overflow-x-auto">
              <div style={{ width: totalWidth, minWidth: '100%' }}>
                {table.getHeaderGroups().map((hg) => (
                  <div key={hg.id} className="flex border-b border-hairline-soft bg-surface-soft">
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <div
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="relative px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide shrink-0 min-w-0"
                        >
                          <span
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            className={`inline-flex items-start gap-1.5 max-w-full break-words ${
                              canSort ? 'cursor-pointer select-none hover:text-ink' : ''
                            }`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              sorted === 'asc' ? <ArrowUp className="w-3 h-3 shrink-0 mt-0.5" />
                                : sorted === 'desc' ? <ArrowDown className="w-3 h-3 shrink-0 mt-0.5" />
                                : <ArrowUpDown className="w-3 h-3 opacity-40 shrink-0 mt-0.5" />
                            )}
                          </span>
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none touch-none hover:bg-brand-400/40 ${
                                header.column.getIsResizing() ? 'bg-brand-500/60' : ''
                              }`}
                              role="separator"
                              aria-label="Resize column"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="max-h-[70vh] overflow-y-auto">
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={`flex items-start border-b border-gray-50 hover:bg-surface-soft transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="px-5 py-4 shrink-0 min-w-0 break-words [&_.truncate]:whitespace-normal [&_.truncate]:overflow-visible"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          {renderMobileCard && (
            <div className="space-y-3 md:hidden">
              {rows.map((row) => (
                <div
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {renderMobileCard(row.original)}
                </div>
              ))}
            </div>
          )}

          {/* Pagination footer */}
          {paginated && pageCount > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-ink-muted">
              <span>
                Showing {pageIndex * table.getState().pagination.pageSize + 1}–
                {Math.min((pageIndex + 1) * table.getState().pagination.pageSize, filteredCount)} of {filteredCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-lg hover:bg-surface-soft disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2">Page {pageIndex + 1} of {pageCount}</span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-lg hover:bg-surface-soft disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </ErrorBoundary>
      )}
    </div>
  );
}
