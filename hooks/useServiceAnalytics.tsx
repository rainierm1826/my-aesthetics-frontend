"use client";

import { getServiceSummary } from "@/api/analytics";
import { ServiceAnalyticsResponse } from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useServiceSummary(token:string) {
  return useQuery<ServiceAnalyticsResponse, Error>({
    queryKey: ["service-summary"],
    queryFn: () => getServiceSummary(token),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
