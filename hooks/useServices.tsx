"use client"

import { getAllService } from "@/api/service";
import { ServiceListResponse } from "@/lib/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useServices() {
  const searchParams = useSearchParams(); 
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<ServiceListResponse, Error>({
    queryKey: ["service", {query, limit, page}],
    queryFn: () => getAllService({query, limit, page}),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}