/**
 * #84 — shared spreadsheet export. Turns an array of row objects into a real
 * .xlsx download. `columns` controls the header labels + order + value mapping so
 * the export matches the on-screen table (not the raw API shape).
 *
 * SheetJS is dynamically imported so its ~300kB only loads when a user actually
 * exports — it stays out of the initial bundle.
 */
export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

export async function exportToXlsx<T>(
  rows: T[],
  columns: ExportColumn<T>[],
  fileName: string,
  sheetName = 'Report',
): Promise<void> {
  const XLSX = await import('xlsx');
  const aoa: (string | number)[][] = [
    columns.map((c) => c.header),
    ...rows.map((r) => columns.map((c) => {
      const v = c.value(r);
      return v == null ? '' : v;
    })),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Reasonable column widths from header length.
  ws['!cols'] = columns.map((c) => ({ wch: Math.max(12, c.header.length + 2) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileName}-${stamp}.xlsx`);
}
