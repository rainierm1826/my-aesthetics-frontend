"use client";

import { getAllService } from "@/api/service";
import { ServiceListResponse } from "@/lib/types/service-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useInfiniteServices() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? "all";
  const category = searchParams.get("category") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 6);

  return useInfiniteQuery<ServiceListResponse, Error>({
    queryKey: ["service", { query, limit, branch, category }],

    queryFn: ({ pageParam }) =>
      getAllService({
        query,
        limit,
        page: pageParam as number,
        branch,
        category,
        sort: "service:asc",
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.has_next ? allPages.length + 1 : undefined;
    },

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
