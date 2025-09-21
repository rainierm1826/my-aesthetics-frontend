"use client";

import { getBranchSummary } from "@/api/analytics";
import { BranchAnalyticsResponse } from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useBranchSummary(token:string) {
  return useQuery<BranchAnalyticsResponse, Error>({
    queryKey: ["branch-summary"],
    queryFn: () => getBranchSummary(token),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
