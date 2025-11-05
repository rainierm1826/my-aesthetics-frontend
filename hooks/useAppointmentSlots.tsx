"use client";

import { getAppointmentAvailableSlots } from "@/api/appointment";
import { AvailableSlotsResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAppointmentSlots({
  branchId,
  serviceId,
  date,
  token,
  aestheticianId,
}: {
  date: string;
  serviceId: string;
  branchId?: string;
  token: string;
  aestheticianId?: string;
}) {
  const isEnabled = !!branchId && !!serviceId && !!date && !!token;
  
  return useQuery<AvailableSlotsResponse, Error>({
    queryKey: ["appointment-slots", branchId, serviceId, date, aestheticianId],
    queryFn: () =>
      getAppointmentAvailableSlots({
        branch_id: branchId!,
        service_id: serviceId,
        date,
        token,
        aesthetician_id: aestheticianId,
      }),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for real-time booking
  });
}
