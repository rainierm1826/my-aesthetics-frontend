"use client";

import { getAestheticianSummary } from "@/api/analytics";
import { AestheticianAnalyticsResponse } from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAestheticianSummary() {
  return useQuery<AestheticianAnalyticsResponse, Error>({
    queryKey: ["aesthetician-summary"],
    queryFn: () => getAestheticianSummary(),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
