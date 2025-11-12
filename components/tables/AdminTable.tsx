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
import { useAuthStore } from "@/provider/store/authStore";

export default function AdminTable() {

  const {access_token} = useAuthStore()


  const { data, isFetching, isError } = useAdmins(access_token||"");

  const admins: Admin[] = data?.admin ?? [];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2">
            <SearchInput placeholder="Search by name..." size="w-full" />
          </div>
          <div className="w-full sm:w-auto">
            <DropDownBranch useUrlParams={true} includeAllOption={true} />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <AdminForm
            method="post"
            dialogButtonLabel="New Admin"
            buttonLabel="Add Admin"
            formDescription="Create a new admin by filling in the details below."
            formTitle="Add New Admin"
          />
        </div>
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
