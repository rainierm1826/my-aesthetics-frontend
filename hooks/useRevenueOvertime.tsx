"use client";

import {   getRevenueOvertime } from "@/api/analytics";
import {   GetAnalyticsParams, RevenueOvertimeResponse } from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useRevenueOvertime({
  branch,
  month,
  year,
  group_by,
  token
}: GetAnalyticsParams) {
  return useQuery<RevenueOvertimeResponse, Error>({
    queryKey: ["revenue-overtime"],
    queryFn: () => getRevenueOvertime({branch, month, year, token, group_by}),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
