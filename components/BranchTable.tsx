"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable";
import { branchColumns } from "@/lib/branch-columns";
import { Branch, BranchListResponse } from "@/lib/branch-types";
import SearchInput from "@/components/SearchInput";
import { getAllBranches } from "@/api/branch";
import BranchForm from "./BranchForm";

export default function BranchTable() {
  const { data, isLoading, error } = useQuery<BranchListResponse, Error>({
    queryKey: ["branch"],
    queryFn: () => getAllBranches(),
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

      {isLoading ? (
        <div>Loading branches…</div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <DataTable columns={branchColumns} data={branches} />
      )}
    </>
  );
}
