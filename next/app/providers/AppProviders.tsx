"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { SubscriptionProvider } from "./SubscriptionProvider";
import { BeachProvider } from "@/app/context/BeachContext";
import { beachData } from "@/app/types/beaches";

const queryClient = new QueryClient();

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SubscriptionProvider>
          <BeachProvider initialBeaches={beachData}>
            {children}
            <Toaster position="top-right" />
            <ReactQueryDevtools initialIsOpen={false} />
          </BeachProvider>
        </SubscriptionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
