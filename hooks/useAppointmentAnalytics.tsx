"use client";

import {  getAppointmentsSummary } from "@/api/analytics";
import {  AppointmentsAnalyticsResponse } from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAppointmentAnalytics(token:string) {
  return useQuery<AppointmentsAnalyticsResponse, Error>({
    queryKey: ["appointments-summary"],
    queryFn: () => getAppointmentsSummary(token),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
