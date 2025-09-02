"use client";

import { DataTable } from "@/components/DataTable";
import { branchColumns } from "@/components/columns/branch-columns";
import { Branch } from "@/lib/branch-types";
import SearchInput from "@/components/SearchInput";
import BranchForm from "../forms/BranchForm";
import SkeletonTable from "../SkeletonTable";
import { toast } from "sonner";
import { useBranches } from "@/hooks/useBranches";

export default function BranchTable() {
  const { data, isFetching, isError } = useBranches();

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
