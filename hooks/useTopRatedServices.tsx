"use client";

import { getAllService } from "@/api/service";
import { ServiceListResponse } from "@/lib/types/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTopRatedServices() {

  return useQuery<ServiceListResponse, Error>({
    queryKey: ["top-rated-services"],
    queryFn: () => getAllService({sort:"rate:asc", limit:6, page:1}),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
