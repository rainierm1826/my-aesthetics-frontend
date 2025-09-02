"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useAdmins } from "@/hooks/useAdmins";
import { Admin } from "@/lib/types/admin-type";
import { adminColumn } from "@/components/columns/admin-column";
import AdminForm from "../forms/AdminForm";
import DropDownBranch from "../selects/DropDownBranch";

export default function AdminTable() {
  const { data, isFetching, isError } = useAdmins();

  const admins: Admin[] = data?.admin ?? [];

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-3 w-full">
          <SearchInput placeholder="Search by name..." size="w-1/2" />
          <DropDownBranch useUrlParams={true} includeAllOption={true} />
        </div>
        <AdminForm
          method="post"
          dialogButtonLabel="New Admin"
          buttonLabel="Add Admin"
          formDescription="Create a new admin by filling in the details below."
          formTitle="Add New Admin"
        />
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={adminColumn}
          data={admins}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
