"use client";

import { getAllAesthetician } from "@/api/aesthetician";
import { AestheticianListResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useInfiniteAestheticians(branchId?: string) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? branchId ?? "";
  const limit = Number(searchParams.get("limit") ?? 8);
  const availability = searchParams.get("availability") ?? "";
  const sex = searchParams.get("sex") ?? "";
  const experience = searchParams.get("experience") ?? "";

  return useInfiniteQuery<AestheticianListResponse, Error>({
    queryKey: [
      "aesthetician",
      { query, limit, branch, sex, experience, availability },
    ],
    queryFn: ({pageParam}) =>
      getAllAesthetician({
        query,
        limit,
        availability,
        page:pageParam as number,
        sex,
        branch,
        experience,
        sort: "name:asc",
      }),
    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.has_next ? allPages.length + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
