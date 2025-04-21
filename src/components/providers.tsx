"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { APIProvider } from "@vis.gl/react-google-maps";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const enableDevTools = process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === "true";

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          {children}
        </APIProvider>
      </NuqsAdapter>
      {enableDevTools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
