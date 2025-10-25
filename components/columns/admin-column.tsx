"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "../../lib/types/admin-type";
import ActionCell from "@/components/ActionCell";
import AdminForm from "@/components/forms/AdminForm";
import { deleteData } from "@/lib/function";
import { useAuthStore } from "@/provider/store/authStore";

export const adminColumn: ColumnDef<Admin>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { first_name, middle_initial, last_name } = row.original;
      return `${first_name} ${middle_initial}. ${last_name}`;
    },
  },
  {
    accessorKey: "auth.email",
    header: "Email",
  },
  {
    accessorKey: "branch.branch_name",
    header: "Branch Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { access_token } = useAuthStore();
      return (
        <ActionCell
          id={row.original.user_id}
          deleteFn={() =>
            deleteData({ id: row.original.user_id, url: "/admin", token: access_token || "" })
          }
          deleteMessage="Admin has been deleted."
          queryKey={["account", "admin"]}
          editDialog={
            <AdminForm
              adminId={row.original.user_id}
              method="patch"
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update a existing branch by filling in the details below."
              buttonLabel="Update"
              firstName={row.original.first_name}
              lastName={row.original.last_name}
              middleInitial={row.original.middle_initial || ""}
              branchId={row.original.branch.branch_id}
              email={row.original.auth?.email}
            />
          }
        />
      );
    },
  },
];
