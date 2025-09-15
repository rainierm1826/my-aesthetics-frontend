"use client";

import { getAllService } from "@/api/service";
import { ServiceListResponse } from "@/lib/types/service-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useInfiniteServices() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? "all";
  const category = searchParams.get("category") ?? "all";
  const limit = Number(searchParams.get("limit") ?? 3);

  return useInfiniteQuery<ServiceListResponse, Error>({
    queryKey: ["service", { query, limit, branch, category }],

    queryFn: ({ pageParam }) =>
      getAllService({
        query,
        limit,
        page: pageParam as number,
        branch,
        category,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / limit);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
