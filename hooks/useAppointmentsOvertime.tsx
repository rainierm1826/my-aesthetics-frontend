"use client";

import { getAppointmentsOvertime } from "@/api/analytics";
import {
  AppointmentsOvertimeResponse,
  GetAnalyticsParams,
} from "@/lib/types/analytics-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAppointmentsOvertime({ token }: GetAnalyticsParams) {
  const predictCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("predictiveAnalytics="))
    ?.split("=")[1];

  const searchParams = useSearchParams();
  const branch = searchParams.get("branch") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";
  const group_by = searchParams.get("group-by") ?? "";

  return useQuery<AppointmentsOvertimeResponse, Error>({
    queryKey: [
      "appointments-overtime",
      branch,
      month,
      year,
      group_by,
      predictCookie,
    ],
    queryFn: () =>
      getAppointmentsOvertime({
        branch,
        month,
        year,
        group_by,
        token,
        predict: predictCookie,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
