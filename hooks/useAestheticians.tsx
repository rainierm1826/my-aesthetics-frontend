"use client";

import { getAllAesthetician } from "@/api/aesthetician";
import { AestheticianListResponse } from "@/lib/types/aesthetician-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAestheticians({ branchId, isPro }: { branchId?: string; isPro?: boolean } = {}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? branchId ??"";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const availability = searchParams.get("availability") ?? "";
  const sex = searchParams.get("sex") ?? "";
  const experienceParam = searchParams.get("experience");
  // Experience precedence:
  // 1. Explicit URL param value
  // 2. Explicit isPro boolean override
  // 3. Empty string (no filtering)
  const experience = experienceParam !== null && experienceParam !== ""
    ? experienceParam
    : (typeof isPro === "boolean" ? (isPro ? "pro" : "regular") : "");

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
