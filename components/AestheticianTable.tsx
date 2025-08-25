"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import { useSearchParams } from "next/navigation";
import SkeletonTable from "./SkeletonTable";
import { toast } from "sonner";
import AestheticianForm from "./AestheticianForm";
import DropDownAvailability from "./DropDownAvailability";
import DropDownSex from "./DropDownSex";
import DropDownExperience from "./DropDownExperience";
import DropDownBranch from "./DropDownBranch";
import {
  Aesthetician,
  AestheticianListResponse,
} from "@/lib/aesthetician-types";
import { getAllAesthetician } from "@/api/aesthetician";
import { aestheticianColumn } from "@/lib/aesthetician-column";

const AestheticianTable = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const availability = searchParams.get("availability") ?? "";
  const sex = searchParams.get("sex") ?? "";
  const branch = searchParams.get("branch") ?? "";
  const experience = searchParams.get("experience") ?? "";

  const { data, isFetching, isError } = useQuery<
    AestheticianListResponse,
    Error
  >({
    queryKey: ["aesthetician", { query, limit, page, branch, sex, experience, availability }],
    queryFn: () =>
      getAllAesthetician({
        query,
        page,
        limit,
        availability,
        sex,
        branch,
        experience,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  const aesthetician: Aesthetician[] = data?.aesthetician ?? [];

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex justify-between w-full">
          <div className="flex gap-3 w-full">
            <SearchInput placeholder="Search by name..." size="w-1/3" />
            <DropDownBranch useUrlParams={true} includeAllOption={true} />
            <DropDownExperience useUrlParams={true} includeAllOption={true} />
            <DropDownAvailability
              value=""
              onValueChange={() => console.log()}
            />
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
