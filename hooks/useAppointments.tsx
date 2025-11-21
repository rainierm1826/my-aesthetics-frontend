"use client";

import { getAllAppointments } from "@/api/appointment";
import { AppointmentListResponse } from "@/lib/types/appointment-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getTodayDate } from "@/lib/function";

export function useAppointments({ branchId, token, ignoredQuery=false}:{branchId?:string, token:string, ignoredQuery?: boolean}) {
  const searchParams = useSearchParams();
  const query = ignoredQuery ? "" : searchParams.get("query") ?? "";  const branch = searchParams.get("branch") ?? branchId ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const today = getTodayDate();
  const date = searchParams.get("date") ?? today;

  return useQuery<AppointmentListResponse, Error>({
    queryKey: ["appointment", { query, limit, page, branch, date, status }],
    queryFn: () =>
      getAllAppointments({
        query,
        page,
        limit,
        branch,
        date,
        status,
        token
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
