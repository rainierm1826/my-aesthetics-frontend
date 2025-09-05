"use client";

import { getAllAppointments } from "@/api/appointment";
import { AppointmentListResponse } from "@/lib/types/appointment-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAppointments() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const today = new Date().toISOString().split("T")[0];
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
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
