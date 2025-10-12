"use client";

import { getAestheticianSlot } from "@/api/aesthetician";
import { AvailableSlotsResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAestheticianSlot({
  aestheticianId,
  serviceId,
  date,
  token,
}: {
  date: string;
  serviceId: string;
  aestheticianId: string;
  token: string;
}) {
  return useQuery<AvailableSlotsResponse, Error>({
    queryKey: ["aesthetician-name", aestheticianId, serviceId, date],
    queryFn: () =>
      getAestheticianSlot({
        aesthetician_id: aestheticianId,
        service_id: serviceId,
        date,
        token,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
