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

const AestheticianTable = () => {
  const { auth, isAuthLoading } = useAuthStore();
  const {user} = useUserStore()
  const { data, isFetching, isError } = useAestheticians(user?.branch?.branch_id);

  const aesthetician: Aesthetician[] = data?.aesthetician ?? [];

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  return (
    <>
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
