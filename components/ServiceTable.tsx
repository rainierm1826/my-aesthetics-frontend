"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "./SkeletonTable";
import { toast } from "sonner";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/lib/service-types";
import { serviceColumn } from "@/lib/service-column";
import ServiceForm from "./ServiceForm";
import DropDownServiceCategory from "./DropDownServiceCategory";
import DropDownBranch from "./DropDownBranch";

export default function ServiceTable() {
  const { data, isFetching, isError } = useServices();

  const services: Service[] = data?.service ?? [];
  console.log(services);

  return (
    <>
      <div className="">
        <div className="flex justify-between mb-5">
          <div className="flex gap-3 w-full">
            <SearchInput placeholder="Search by name..." size="w-1/2" />
            <DropDownBranch />
            <DropDownServiceCategory />
          </div>
          <ServiceForm
            method="post"
            formTitle="Add New Service"
            formDescription="Fill in the details below to add a new service to help customers recognize it instantly."
            renderDialog={true}
            dialogButtonLabel="New Service"
            buttonLabel="Create Service"
          />
        </div>
        {isFetching ? (
          <SkeletonTable />
        ) : isError ? (
          toast("Internal Error")
        ) : (
          <DataTable
            columns={serviceColumn}
            data={services}
            pageCount={data?.pages}
            windowsSize={5}
          />
        )}
      </div>
    </>
  );
}
