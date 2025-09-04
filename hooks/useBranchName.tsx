"use client";

import { getBranchName } from "@/api/branch";
import { BranchNameResponse } from "@/lib/types/branch-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useBrancheName() {
  return useQuery<BranchNameResponse, Error>({
    queryKey: ["branch", "branch-name"],
    queryFn: () => getBranchName(),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
