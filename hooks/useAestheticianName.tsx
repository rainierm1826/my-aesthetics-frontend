"use client";

import { getAestheticianName } from "@/api/aesthetician";
import { AestheticianNameResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useAestheticianName({branchId, token}:{branchId:string, token:string}) {
  return useQuery<AestheticianNameResponse, Error>({
    queryKey: ["aesthetician-name", branchId],
    queryFn: () => getAestheticianName({branch:branchId, token}),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
