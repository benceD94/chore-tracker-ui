import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

export function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

export function renderWithQueryClient(
  ui: ReactElement,
  queryClient = createTestQueryClient(),
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    ...render(ui, { wrapper: createWrapper(queryClient), ...options }),
    queryClient,
  };
}
