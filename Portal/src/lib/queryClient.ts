import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Admin dashboard: tolerate slightly stale data to avoid redundant refetches.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      // Refetching on every tab focus hammers the API for a dashboard kept open
      // all day; rely on staleTime + explicit invalidation after mutations instead.
      refetchOnWindowFocus: false,
    },
  },
});
