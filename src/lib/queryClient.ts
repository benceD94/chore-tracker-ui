import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
      retry: 2,
      refetchOnWindowFocus: false, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: 1,
    },
  },
});
