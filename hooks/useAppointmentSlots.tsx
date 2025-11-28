"use client";

import { getAppointmentAvailableSlots } from "@/api/appointment";
import { AvailableSlotsApiResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAppointmentSlots({
  branchId,
  serviceId,
  date,
  token,
  aestheticianId,
  usePost = false,
}: {
  date: string;
  serviceId: string;
  branchId?: string;
  token: string;
  aestheticianId?: string;
  usePost?: boolean;
}) {
  const isEnabled = !!branchId && !!serviceId && !!date && !!token;
  return useQuery<AvailableSlotsApiResponse, Error>({
    queryKey: ["appointment-slots", branchId, serviceId, date, aestheticianId, usePost],
    queryFn: () =>
      getAppointmentAvailableSlots({
        branch_id: branchId!,
        service_id: serviceId,
        date,
        token,
        aesthetician_id: aestheticianId,
        usePost,
      }),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for real-time booking
  });
}
