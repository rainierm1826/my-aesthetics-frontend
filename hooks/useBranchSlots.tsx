"use client";

import { getBranchAvailableSlots } from "@/api/branch";
import { AvailableSlotsResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useBranchSlots({
  branchId,
  serviceId,
  date,
  token,
}: {
  date: string;
  serviceId: string;
  branchId: string;
  token: string;
}) {
  return useQuery<AvailableSlotsResponse, Error>({
    queryKey: ["branch-slots", branchId, serviceId, date],
    queryFn: () =>
      getBranchAvailableSlots({
        branch_id: branchId,
        service_id: serviceId,
        date,
        token,
      }),
    enabled: !!branchId && !!serviceId && !!date && !!token,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for real-time booking
  });
}
