import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default: tolerate slightly stale data to avoid redundant refetches.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      // Refetch when the user returns to the tab. React Query's cache is per browser
      // context, so when two roles are open in separate windows (admin + client), an
      // action by one can't invalidate the other's cache. Refetching on focus means
      // switching back to a window pulls the latest state without a manual refresh.
      // Live-updating views (task list/detail) additionally poll — see those queries.
      refetchOnWindowFocus: true,
    },
  },
});
