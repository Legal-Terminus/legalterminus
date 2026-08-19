import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { APP_ROUTES } from '../routes/appRoutes';
import { useAuthStore } from '../store/authStore';

const SUFFIX = 'Legal Terminus';

/**
 * #177 — set the browser tab title from the current route.
 *
 * Every page used to share one static title, so several open matters were
 * indistinguishable in the tab bar and in browser history, and a screen reader
 * announced nothing useful on navigation.
 *
 * Titles are DERIVED from the route registry's `nav.label` rather than a second
 * hand-maintained list — a new route with a nav entry gets a title for free, and
 * the two can never drift. Routes without a nav label (detail pages, forms) fall
 * back to the plain product name unless the page sets its own via
 * `usePageTitle`, which the matter screen does.
 */
export function useDocumentTitle() {
  const { pathname } = useLocation();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    const match = APP_ROUTES.find((r) => matchPath({ path: r.path, end: true }, pathname));
    // Client-facing vocabulary differs ("Matters" vs "My Services"), and the nav
    // already encodes that per role — reuse it rather than restating it here.
    const label = match?.nav
      ? (role === 'client' && match.path === '/tasks' ? 'My Services' : match.nav.label)
      : null;
    document.title = label ? `${label} · ${SUFFIX}` : SUFFIX;
  }, [pathname, role]);
}

/**
 * Set a specific title for a page whose name depends on loaded data (e.g. a
 * matter). Pass `null` while loading to leave the route-derived title in place
 * rather than flashing a placeholder.
 */
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} · ${SUFFIX}`;
    // Restore on unmount so navigating away cannot leave a stale matter name in
    // the tab while the next page loads.
    return () => { document.title = previous; };
  }, [title]);
}
