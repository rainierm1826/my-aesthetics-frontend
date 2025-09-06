"use client";

import { getService } from "@/api/service";
import { ServiceResponse } from "@/lib/types/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export function useService(service_id:string) {
  return useQuery<ServiceResponse, Error>({
    queryKey: ["branch", service_id],
    queryFn: () => getService(service_id),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
