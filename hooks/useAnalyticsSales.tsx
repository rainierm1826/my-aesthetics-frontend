"use client";

import { getSalesAnalytics } from "@/api/analytics";
import {
  GetAnalyticsParams,
  SalesAnalyticsResponse,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAnalyticsSales({
  branch,
  month,
  year,
  token
}: GetAnalyticsParams) {
  return useQuery<SalesAnalyticsResponse, Error>({
    queryKey: ["analytics-sales", branch, month, year],
    queryFn: () => getSalesAnalytics({ branch, month, year, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
