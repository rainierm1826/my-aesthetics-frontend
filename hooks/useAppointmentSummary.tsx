"use client";

import { getAppointmentSummary } from "@/api/analytics";
import {
  AppointmentSummaryResponse,
  GetAnalyticsParams,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAppointmentSummary({
  branch,
  group_by,
  month,
  year,
}: GetAnalyticsParams) {
  return useQuery<AppointmentSummaryResponse, Error>({
    queryKey: ["appointment-summary", branch, group_by, month, year],
    queryFn: () => getAppointmentSummary({ branch, group_by, month, year }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
