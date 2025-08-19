import { getAllBranches } from "@/api/branch";
import { BranchListResponse } from "@/lib/branch-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useBranches() {
  const searchParams = useSearchParams(); 
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  return useQuery<BranchListResponse, Error>({
    queryKey: ["branch", {query, limit, page}],
    queryFn: () => getAllBranches({ query, page, limit }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}