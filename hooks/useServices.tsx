"use client";

import { getAllService } from "@/api/service";
import { ServiceListResponse } from "@/lib/types/service-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useServices(branchId?:string) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? branchId ?? "all" ;
  const category = searchParams.get("category") ?? "all";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<ServiceListResponse, Error>({
    queryKey: ["service", { query, limit, page, branch, category }],
    queryFn: () => getAllService({ query, limit, page, branch, category }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
