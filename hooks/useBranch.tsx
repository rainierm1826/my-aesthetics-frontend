"use client";

import { getBranch } from "@/api/branch";
import {  BranchResponse } from "@/lib/types/branch-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export function useBranch(branch_id:string) {
  return useQuery<BranchResponse, Error>({
    queryKey: ["branch", branch_id],
    queryFn: () => getBranch(branch_id),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
