"use client"

import { getAllAesthetician } from "@/api/aesthetician";
import { AestheticianListResponse } from "@/lib/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAestheticians() {
  const searchParams = useSearchParams(); 
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<AestheticianListResponse, Error>({
    queryKey: ["aesthetician", {query, limit, page}],
    queryFn: () => getAllAesthetician({ query, page, limit }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}