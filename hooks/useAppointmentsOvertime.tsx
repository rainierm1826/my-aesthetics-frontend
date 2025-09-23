"use client";

import { getAppointmentsOvertime } from "@/api/analytics";
import {
  AppointmentsOvertimeResponse,
  GetAnalyticsParams,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAppointmentsOvertime({
  branch,
  month,
  year,
  group_by,
  token,
}: GetAnalyticsParams) {
  return useQuery<AppointmentsOvertimeResponse, Error>({
    queryKey: ["appointments-overtime", branch, month, year],
    queryFn: () =>
      getAppointmentsOvertime({ branch, month, year, group_by, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
