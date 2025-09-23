"use client";

import { getAppointmentAnalytics } from "@/api/analytics";
import {
  AppointmentAnalyticsResponse,
  GetAnalyticsParams,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAnalyticsAppointment({ token }: GetAnalyticsParams) {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";

  return useQuery<AppointmentAnalyticsResponse, Error>({
    queryKey: ["analytics-appointment", branch, month, year],
    queryFn: () => getAppointmentAnalytics({ branch, month, year, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
