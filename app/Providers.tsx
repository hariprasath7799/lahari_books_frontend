'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/src/lib/store';
import { useState, ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    // Initialize inside state so it doesn't get recreated on every render
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // Cache server data for 1 minute
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ReduxProvider>
    );
}