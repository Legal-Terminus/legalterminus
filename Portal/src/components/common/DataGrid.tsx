import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  flexRender,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  type SortingState,
  type Row,
  type Table,
} from '@tanstack/react-table';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ListFilter, X } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

/**
 * #91 (app-wide): an Excel-style per-column filter. A funnel icon in each
 * filterable column header opens a popover listing that column's DISTINCT values
 * as checkboxes (with a type-to-narrow box + Select all / Clear). Multiple columns
 * filter with AND; each column keeps the set of values you ticked. Composes with
 * the global search box and any structured toolbar filters. Purely client-side.
 */
function columnValuesFilter<T>(row: Row<T>, columnId: string, filterValue: unknown): boolean {
  // Numeric RANGE filter: { min?, max? } — used when a column's values are all
  // numbers (amounts, counts). Blank/non-numeric cells are excluded by a range.
  if (filterValue && typeof filterValue === 'object' && !Array.isArray(filterValue)) {
    const { min, max } = filterValue as { min?: number; max?: number };
    const raw = row.getValue(columnId);
    const n = typeof raw === 'number' ? raw : parseFloat(String(raw));
    if (Number.isNaN(n)) return false;
    if (min != null && n < min) return false;
    if (max != null && n > max) return false;
    return true;
  }
  // Distinct-value (checkbox set) filter.
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const v = row.getValue(columnId);
  return filterValue.includes(v == null || v === '' ? '(Blank)' : String(v));
}

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
  /**
   * #91: show the Excel-style per-column filter funnel in each header. Default on.
   * A column opts out via `columnDef.meta.disableColumnFilter = true` (e.g. a
   * free-form or action column where a value picker makes no sense).
   */
  columnFilters?: boolean;
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
  columnFilters: enableColumnFilters = true,
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [colFilters, setColFilters] = useState<ColumnFiltersState>([]);
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
    state: { sorting, globalFilter: search, columnSizing, columnFilters: colFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    onColumnSizingChange: setColumnSizing,
    onColumnFiltersChange: setColFilters,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    globalFilterFn: globalFilterFn
      ? (row, columnId, value) => globalFilterFn(row, columnId, String(value))
      : 'auto',
    // #91: every column filters by the "set of ticked distinct values" model
    // (Excel-style). Columns can still opt out of the UI via meta.
    defaultColumn: { filterFn: columnValuesFilter },
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
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
      ) : rows.length === 0 && colFilters.length === 0 ? (
        // True empty state (no data / no search hits). When COLUMN filters are
        // active we keep the table + headers rendered instead, so the funnel
        // buttons stay reachable and the user can clear their filter (#91).
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
                          {/* #91: Excel-style per-column value filter. */}
                          {enableColumnFilters
                            && !(header.column.columnDef.meta as { disableColumnFilter?: boolean } | undefined)?.disableColumnFilter
                            && header.column.getCanFilter() && (
                            <ColumnFilterMenu column={header.column} table={table} />
                          )}
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
                  {rows.length === 0 && (
                    <div className="px-5 py-8 text-sm text-ink-muted flex items-center gap-2">
                      No rows match the current column filters.
                      <button
                        onClick={() => table.resetColumnFilters()}
                        className="text-brand-700 text-xs font-medium hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
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

/**
 * #91 — Excel-style column filter popover. A funnel button in the header opens a
 * panel listing the column's DISTINCT values (from the faceted row model, i.e.
 * respecting the other columns' filters — exactly how Excel behaves) as
 * checkboxes, with a type-to-narrow box and Select all / Clear. The ticked set
 * becomes the column's filter value (see `columnValuesFilter`).
 */
function ColumnFilterMenu<T>({ column, table }: { column: Column<T, unknown>; table: Table<T> }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Distinct values for this column, computed over rows that pass every OTHER
  // filter (faceting) — mirrors Excel. "(Blank)" stands in for null/empty.
  // A column whose (non-blank) values are ALL numeric gets a RANGE (Min–Max)
  // filter instead of a value picker — checkboxes over amounts are useless.
  const { uniqueValues, isNumeric } = useMemo(() => {
    if (!open) return { uniqueValues: [] as string[], isNumeric: false };
    const map = column.getFacetedUniqueValues();
    const vals = new Set<string>();
    let numeric = map.size > 0;
    for (const key of map.keys()) {
      if (key == null || key === '') { vals.add('(Blank)'); continue; }
      if (typeof key !== 'number' && Number.isNaN(parseFloat(String(key)))) numeric = false;
      vals.add(String(key));
    }
    return {
      uniqueValues: [...vals].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      isNumeric: numeric,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, column, table.getState().columnFilters, table.getState().globalFilter, table.options.data]);

  const filterValue = column.getFilterValue();
  const selected = Array.isArray(filterValue) ? (filterValue as string[]) : [];
  const range = (filterValue && typeof filterValue === 'object' && !Array.isArray(filterValue)
    ? filterValue : {}) as { min?: number; max?: number };
  const isActive = selected.length > 0 || range.min != null || range.max != null;
  const shown = query
    ? uniqueValues.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
    : uniqueValues;

  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
    column.setFilterValue(next.length ? next : undefined);
  };

  const setRange = (patch: { min?: number; max?: number }) => {
    const next = { ...range, ...patch };
    if (next.min == null && next.max == null) column.setFilterValue(undefined);
    else column.setFilterValue(next);
  };

  return (
    <div ref={ref} className="relative inline-block align-middle ml-1">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className={`p-0.5 rounded align-middle ${isActive ? 'text-brand-600 bg-brand-50' : 'text-ink-faint hover:text-ink'}`}
        title="Filter column"
        aria-label={`Filter ${String(column.id)}`}
      >
        <ListFilter className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-50 w-56 bg-white border border-hairline rounded-lg shadow-card p-2 normal-case font-normal tracking-normal"
          onClick={(e) => e.stopPropagation()}
        >
          {isNumeric ? (
            /* Numeric column → RANGE filter (Min–Max), not a value picker. */
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  type="number"
                  value={range.min ?? ''}
                  onChange={(e) => setRange({ min: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="Min"
                  aria-label="Minimum"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <span className="text-ink-faint text-xs">–</span>
                <input
                  type="number"
                  value={range.max ?? ''}
                  onChange={(e) => setRange({ max: e.target.value === '' ? undefined : Number(e.target.value) })}
                  placeholder="Max"
                  aria-label="Maximum"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>
              <div className="flex justify-end px-1 text-[11px]">
                <button
                  onClick={() => column.setFilterValue(undefined)}
                  className={`inline-flex items-center gap-0.5 hover:underline ${isActive ? 'text-red-600' : 'text-ink-faint'}`}
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search values…"
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs mb-1.5 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
              <div className="flex items-center justify-between px-1 pb-1.5 text-[11px]">
                <button onClick={() => column.setFilterValue(shown.length ? [...shown] : undefined)} className="text-brand-700 hover:underline">Select all</button>
                <button
                  onClick={() => { column.setFilterValue(undefined); setQuery(''); }}
                  className={`inline-flex items-center gap-0.5 hover:underline ${isActive ? 'text-red-600' : 'text-ink-faint'}`}
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {shown.length === 0 && <p className="px-1 py-2 text-xs text-ink-faint">No values</p>}
                {shown.map((v) => (
                  <label key={v} className="flex items-center gap-2 px-1 py-1 rounded hover:bg-surface-soft cursor-pointer text-xs text-ink">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5"
                      checked={selected.includes(v)}
                      onChange={() => toggle(v)}
                    />
                    <span className="truncate">{v}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
