"use client";

import { getRevenueOvertime } from "@/api/analytics";
import {
  GetAnalyticsParams,
  RevenueOvertimeResponse,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useRevenueOvertime({ token }: GetAnalyticsParams) {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";
  const group_by = searchParams.get("group-by") ?? "";
  return useQuery<RevenueOvertimeResponse, Error>({
    queryKey: ["revenue-overtime",  branch, month, year, group_by],
    queryFn: () => getRevenueOvertime({ branch, month, year, token, group_by }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
