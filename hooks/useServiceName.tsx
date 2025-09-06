"use client";

import { getServiceName } from "@/api/service";
import { ServiceNameResponse } from "@/lib/types/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useServiceName(branchId?: string) {
  return useQuery<ServiceNameResponse, Error>({
    queryKey: ["service", "service-name", branchId],
    queryFn: () => getServiceName(branchId),
    placeholderData: keepPreviousData,
    enabled: !!branchId,
  });
}
