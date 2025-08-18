"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable";
import { branchColumns } from "@/lib/branch-columns";
import { Branch, BranchListResponse } from "@/lib/branch-types";
import SearchInput from "@/components/SearchInput";
import { getAllBranches } from "@/api/branch";
import BranchForm from "./BranchForm";
import { useSearchParams } from "next/navigation";
import SkeletonTable from "./SkeletonTable";
import { toast } from "sonner";

export default function BranchTable() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const { data, isFetching, isError } = useQuery<BranchListResponse, Error>({
    queryKey: ["branch", { query, page, limit }],
    queryFn: () => getAllBranches({ query, page, limit }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  const branches: Branch[] = data?.branch ?? [];

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-3 w-full">
          <SearchInput placeholder="Search by name..." size="w-1/2" />
        </div>

        <BranchForm
          method="post"
          dialogButtonLabel="New Branch"
          buttonLabel="Add Branch"
          formDescription="Create a new branch by filling in the details below."
          formTitle="Add New Branch"
        />
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={branchColumns}
          data={branches}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
