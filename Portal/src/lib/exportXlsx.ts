/**
 * #84 — shared spreadsheet export. Turns an array of row objects into a real
 * .xlsx download. `columns` controls the header labels + order + value mapping so
 * the export matches the on-screen table (not the raw API shape).
 *
 * SheetJS is dynamically imported so its ~300kB only loads when a user actually
 * exports — it stays out of the initial bundle.
 */
import { shareBlobNative } from './native';

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

/**
 * LT #369: the same rows and columns as a .csv file (UTF-8 with a BOM, so Excel
 * reads ₹ and names correctly).
 */
export async function exportToCsv<T>(rows: T[], columns: ExportColumn<T>[], fileName: string): Promise<void> {
  // A text cell starting with = + - @ (or a tab / return) would run as a formula
  // in Excel (CSV injection): it is written with a leading apostrophe. Numbers stay numbers.
  const cell = (v: string | number | null | undefined) => {
    let t = String(v ?? '');
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(t)) t = `'${t}`;
    return `"${t.replace(/"/g, '""')}"`;
  };
  const lines = [
    columns.map((c) => cell(c.header)).join(','),
    ...rows.map((r) => columns.map((c) => cell(c.value(r))).join(',')),
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const file = `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`;
  if (await shareBlobNative(blob, file)) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
  const file = `${fileName}-${stamp}.xlsx`;
  // An Android WebView drops the anchor download XLSX.writeFile relies on, so inside
  // the app the file goes to the share sheet instead. In a browser nothing changes.
  const bytes = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  if (await shareBlobNative(blob, file)) return;
  XLSX.writeFile(wb, file);
}
