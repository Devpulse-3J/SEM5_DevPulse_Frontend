"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import "@/styles/globals.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default Providers;
