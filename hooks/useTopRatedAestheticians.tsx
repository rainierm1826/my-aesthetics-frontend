"use client";

import { getAllAesthetician } from "@/api/aesthetician";
import { AestheticianListResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTopRatedAestheticians() {
  return useQuery<AestheticianListResponse, Error>({
    queryKey: ["top-rated-aestheticians"],
    queryFn: () =>
      getAllAesthetician({
        sort: "rate:desc",
        limit: 8,
        page: 1,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
