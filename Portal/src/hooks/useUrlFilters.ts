import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Report filters that live in the URL instead of component state.
 *
 * #208: a report held its filters in `useState`, so they were gone the moment
 * you opened a matter from it — coming back showed the unfiltered report and you
 * chose them all again. In the URL they belong to the history entry: Back from
 * the matter returns to `/reports/…?status=active&…` and the report renders
 * exactly as you left it. It also makes a filtered report a link you can send.
 *
 * Changes REPLACE the current history entry rather than pushing a new one, so
 * Back leaves the report in one step instead of unwinding every filter change.
 *
 * `keys` is the allow-list of filter names: anything else in the query string is
 * ignored on read and preserved on write (other features own their own params).
 * `numeric` names the keys whose values are numbers; `defaults` applies when a
 * key is absent, and a value equal to its default is kept out of the URL.
 */
export function useUrlFilters<T extends object>(
  keys: readonly (keyof T & string)[],
  options: { numeric?: readonly (keyof T & string)[]; defaults?: Partial<T> } = {},
): [T, (next: T | ((prev: T) => T)) => void] {
  const [params, setParams] = useSearchParams();
  const { numeric, defaults } = options;
  // Stable identities for the dependency lists below: callers pass literals.
  const keyList = keys.join(',');
  const numericList = (numeric ?? []).join(',');
  const defaultsJson = JSON.stringify(defaults ?? {});

  const filters = useMemo(() => {
    const out: Record<string, unknown> = { ...JSON.parse(defaultsJson) };
    const numericKeys = new Set(numericList ? numericList.split(',') : []);
    for (const key of keyList ? keyList.split(',') : []) {
      const raw = params.get(key);
      if (raw === null || raw === '') continue;
      if (numericKeys.has(key)) {
        const n = Number(raw);
        if (Number.isFinite(n)) out[key] = n;
      } else {
        out[key] = raw;
      }
    }
    return out as T;
  }, [params, keyList, numericList, defaultsJson]);

  const setFilters = useCallback((next: T | ((prev: T) => T)) => {
    const value = typeof next === 'function' ? (next as (prev: T) => T)(filters) : next;
    const base = JSON.parse(defaultsJson) as Record<string, unknown>;
    setParams((prev) => {
      const out = new URLSearchParams(prev);
      for (const key of keyList ? keyList.split(',') : []) {
        const v = (value as Record<string, unknown>)[key];
        if (v === undefined || v === null || v === '' || v === base[key]) out.delete(key);
        else out.set(key, String(v));
      }
      return out;
    }, { replace: true });
  }, [filters, setParams, keyList, defaultsJson]);

  return [filters, setFilters];
}
