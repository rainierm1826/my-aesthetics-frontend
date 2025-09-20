"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import AestheticianForm from "../forms/AestheticianForm";
import DropDownAvailability from "../selects/DropDownAvailability";
import DropDownSex from "../selects/DropDownSex";
import DropDownExperience from "../selects/DropDownExperience";
import DropDownBranch from "../selects/DropDownBranch";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import { aestheticianColumn } from "@/components/columns/aesthetician-column";
import { useAestheticians } from "@/hooks/useAestheticians";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useAestheticianSummary } from "@/hooks/useAestheticianAnalytics";
import { AestheticianAnalyticsResponse } from "@/lib/types/analytics-type";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import DashboardCard from "../cards/DashboardCard";

const AestheticianTable = () => {
  const { auth, isAuthLoading } = useAuthStore();
  const { user } = useUserStore();
  const { data, isFetching, isError } = useAestheticians(
    user?.branch?.branch_id
  );
  const aesthetician: Aesthetician[] = data?.aesthetician ?? [];

  const {
    data: aestheticianSummary,
    isFetching: isFetchingAestheticianSummary,
  } = useAestheticianSummary();

  const summary: AestheticianAnalyticsResponse = aestheticianSummary || {
    aesthetician_experience: [],
    average_aesthetician_rating: 0,
    total_aestheticians: 0,
  };

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  console.log(auth?.role);

  return (
    <>
      {auth?.role === "owner" && isFetchingAestheticianSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : auth?.role === "owner" ? (
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard
            title="Average Rating"
            content={summary.average_aesthetician_rating.toFixed(2)}
            info="Overall average rating of all aestheticians across branches"
          />
          <DashboardCard
            title="Total Aestheticians"
            content={summary.total_aestheticians}
            info="Total number of active aestheticians across branches"
          />
          {summary.aesthetician_experience.map((value, index) => (
            <DashboardCard
              key={index}
              title={`${
                value.experience.charAt(0).toUpperCase() +
                value.experience.slice(1)
              } Aestheticians`}
              content={value.count}
              info={`Number of ${value.experience} level aestheticians across all branches`}
            />
          ))}
        </div>
      ) : null}

      <div className="flex justify-between mb-5">
        <div className="flex justify-between w-full">
          <div className="flex gap-3 w-full">
            <SearchInput placeholder="Search by name..." size="w-1/3" />
            {auth?.role == "owner" && (
              <DropDownBranch useUrlParams={true} includeAllOption={true} />
            )}
            <DropDownExperience useUrlParams={true} includeAllOption={true} />
            <DropDownAvailability useUrlParams={true} includeAllOption={true} />
            <DropDownSex useUrlParams={true} includeAllOption={true} />
          </div>
          <AestheticianForm
            method="post"
            formTitle="Add Aesthetician"
            formDescription="Fill in the aesthetician’s name, contact number, experience, gender, and branch. Add a profile photo to complete their profile."
            dialogButtonLabel="New Aesthetician"
            buttonLabel="Create Aesthetician"
          />
        </div>
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={aestheticianColumn}
          data={aesthetician}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
};

export default AestheticianTable;
