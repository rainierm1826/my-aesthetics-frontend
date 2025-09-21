"use client";

import { getAllAdmin } from "@/api/admin";
import { AdminListResposne } from "@/lib/types/admin-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAdmins(token:string) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const query = searchParams.get("query") ?? "";
  const branch = searchParams.get("branch") ?? "";

  return useQuery<AdminListResposne, Error>({
    queryKey: ["account", "admin", { query, limit, page, branch }],
    queryFn: () => getAllAdmin({ query, page, limit, branch, token }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}
