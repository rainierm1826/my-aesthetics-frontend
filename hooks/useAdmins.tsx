"use client"

import { getAllAdmin } from "@/api/admin";
import { AdminListResposne } from "@/lib/admin-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useAdmins() {
  const searchParams = useSearchParams(); 
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<AdminListResposne, Error>({
    queryKey: ["account", "admin", {query, limit, page}],
    queryFn: () => getAllAdmin({ query, page, limit }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}