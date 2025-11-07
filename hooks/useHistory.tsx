"use client";

import { getHistory } from "@/api/appointment";
import { AppointmentListResponse } from "@/lib/types/appointment-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export function useHistory(token:string) {
  return useQuery<AppointmentListResponse, Error>({
    queryKey: ["history", token],
    queryFn: () => getHistory({token}),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    enabled: !!token, // Only run query when token is available
  });
}
