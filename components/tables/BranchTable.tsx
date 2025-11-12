"use client";

import { DataTable } from "@/components/DataTable";
import { branchColumns } from "@/components/columns/branch-columns";
import { Branch } from "@/lib/types/branch-types";
import SearchInput from "@/components/SearchInput";
import BranchForm from "../forms/BranchForm";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useBranches } from "@/hooks/useBranches";
import { useBranchSummary } from "@/hooks/useBranchAnalytics";
import { BranchAnalyticsResponse } from "@/lib/types/analytics-type";
import DashboardCard from "../cards/DashboardCard";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useAuthStore } from "@/provider/store/authStore";

export default function BranchTable() {
  const {access_token} = useAuthStore()

  const { data, isFetching, isError } = useBranches();
  const { data: branchSummary, isFetching: isFetchingBranchSummary } =
    useBranchSummary(access_token||"");

  const summary: BranchAnalyticsResponse = branchSummary || {
    average_branch_rating: 0,
    branch_completion_rate: {},
  };
  const branches: Branch[] = data?.branch ?? [];

  return (
    <>
      {isFetchingBranchSummary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          <DashboardCard
            title="Avarage Rating"
            content={summary.average_branch_rating.toFixed(2)}
            info="Branch avarage rating."
          />

          {summary.branch_completion_rate &&
            Object.entries(summary.branch_completion_rate).map(
              ([branch, rate]) => (
                <DashboardCard
                  key={branch}
                  title={branch}
                  content={`${rate.toFixed(2)}%`}
                  info={`${branch} completion rate.`}
                />
              )
            )}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2">
            <SearchInput placeholder="Search by name..." size="w-full" />
          </div>
        </div>

        <div className="w-full sm:w-auto flex-shrink-0">
          <BranchForm
            method="post"
            dialogButtonLabel="New Branch"
            buttonLabel="Add Branch"
            formDescription="Create a new branch by filling in the details below."
            formTitle="Add New Branch"
          />
        </div>
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
