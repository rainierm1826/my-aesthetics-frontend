"use client";

import { getSalesSummary } from "@/api/analytics";
import {
  GetAnalyticsParams,
  SalesSummaryResponse,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSalesSummary({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams) {
  return useQuery<SalesSummaryResponse, Error>({
    queryKey: ["sales-summary", branch, group_by, month, year],
    queryFn: () => getSalesSummary({ branch, group_by, month, year }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
