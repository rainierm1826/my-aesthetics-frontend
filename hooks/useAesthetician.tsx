"use client";

import {  getAesthetician } from "@/api/aesthetician";
import { AestheticianResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export function useAesthetician(aesthetician_id:string) {
  return useQuery<AestheticianResponse, Error>({
    queryKey: ["aesthetician", aesthetician_id],
    queryFn: () => getAesthetician(aesthetician_id),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
