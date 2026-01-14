'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeClassName } from '@/lib/theme/mapTheme';

export default function Providers({
  initialTheme,
  children,
}: {
  initialTheme: ThemeClassName;
  children: React.ReactNode;
}) {
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
