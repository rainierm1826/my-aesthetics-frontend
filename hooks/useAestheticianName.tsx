"use client";

import { getAestheticianName } from "@/api/aesthetician";
import { AestheticianNameResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAestheticianName(branchId?: string) {
  return useQuery<AestheticianNameResponse, Error>({
    queryKey: ["aesthetician", "aesthetician-name", branchId],
    queryFn: () => getAestheticianName(branchId),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
