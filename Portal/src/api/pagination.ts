/**
 * Follow a cursor-paginated list endpoint to its end (#275, #277).
 *
 * The Matters and Clients pages filter, search and sort in the browser, over
 * whatever rows they hold. They used to hold only the FIRST page (25 matters,
 * 100 clients) and never asked for the next, so anything past it — older
 * completed matters, clients late in the alphabet — was simply not on the page,
 * and a filter could only ever find what that one page contained.
 *
 * Rows are de-duplicated by id: a row edited while we page can move and be
 * served twice. `maxPages` is a backstop against a cursor that never ends; it is
 * far beyond any real firm's size (100 pages × the page size).
 */
export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
}

export async function fetchAllPages<T>(
  fetchPage: (cursor: string | undefined) => Promise<CursorPage<T>>,
  idOf: (row: T) => string,
  maxPages = 100,
): Promise<T[]> {
  const rows: T[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  for (let i = 0; i < maxPages; i += 1) {
    const page = await fetchPage(cursor);
    for (const row of page.data ?? []) {
      const id = idOf(row);
      if (seen.has(id)) continue;
      seen.add(id);
      rows.push(row);
    }
    if (!page.nextCursor || page.nextCursor === cursor) break;
    cursor = page.nextCursor;
  }
  return rows;
}
