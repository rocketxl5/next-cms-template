'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeClassName } from '@/lib/theme/mapTheme';

/**
 * Top-level providers wrapper.
 *
 * Purpose:
 * - Centralize app-level providers
 * - Wraps React Query and ThemeProvider in a single component
 * - Keeps app pages/layouts clean
 *
 * Responsibilities:
 * - Provide a QueryClient for React Query with default options
 *   - No retry to avoid infinite loops on 401
 *   - No refetch on window focus by default
 * - Provide theme context via ThemeProvider
 *
 * Usage:
 * ```tsx
 * <Providers initialTheme={themeFromSession}>
 *   <App />
 * </Providers>
 * ```
 */
export default function Providers({
  initialTheme,
  children,
}: {
  initialTheme: ThemeClassName;
  children: React.ReactNode;
}) {
  // Create a persistent QueryClient instance per app session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false, // avoid retry loops on 401
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
