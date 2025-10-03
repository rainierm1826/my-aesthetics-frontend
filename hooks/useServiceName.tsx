"use client";

import { getServiceName } from "@/api/service";
import { ServiceNameResponse } from "@/lib/types/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useServiceName({branchId, token}:{branchId?:string, token:string}) {
  return useQuery<ServiceNameResponse, Error>({
    queryKey: ["service", "service-name", branchId],
    queryFn: () => getServiceName({branch:branchId, token}),
    placeholderData: keepPreviousData,
    enabled: !!branchId,
  });
}
