"use client";

import { getSalesAnalytics } from "@/api/analytics";
import {
  GetAnalyticsParams,
  SalesAnalyticsResponse,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAnalyticsSales({ token }: GetAnalyticsParams) {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";
  return useQuery<SalesAnalyticsResponse, Error>({
    queryKey: ["analytics-sales", branch, month, year],
    queryFn: () => getSalesAnalytics({ branch, month, year, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
