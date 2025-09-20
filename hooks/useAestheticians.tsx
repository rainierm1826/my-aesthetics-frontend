"use client";

import { getAllAesthetician } from "@/api/aesthetician";
import { AestheticianListResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAestheticians(branchId?:string) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? branchId ??"";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const availability = searchParams.get("availability") ?? "";
  const sex = searchParams.get("sex") ?? "";
  const experience = searchParams.get("experience") ?? "";

  return useQuery<AestheticianListResponse, Error>({
    queryKey: [
      "aesthetician",
      { query, limit, page, branch, sex, experience, availability },
    ],
    queryFn: () =>
      getAllAesthetician({
        query,
        page,
        limit,
        availability,
        sex,
        branch,
        experience,
        sort:"name:asc"
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
