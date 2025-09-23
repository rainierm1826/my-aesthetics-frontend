"use client";

import { getAppointmentAnalytics } from "@/api/analytics";
import {
  AppointmentAnalyticsResponse,
  GetAnalyticsParams,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAnalyticsAppointment({
  branch,
  month,
  year,
  token
}: GetAnalyticsParams) {
  return useQuery<AppointmentAnalyticsResponse, Error>({
    queryKey: ["analytics-appointment", branch, month, year],
    queryFn: () => getAppointmentAnalytics({ branch, month, year, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
