"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "../../lib/types/admin-type";
import ActionCell from "@/components/ActionCell";
import AdminForm from "@/components/forms/AdminForm";
import { deleteAdmin } from "@/api/admin";

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
      return (
        <ActionCell
          id={row.original.auth.account_id}
          deleteFn={() => deleteAdmin({ account_id: row.original.auth.account_id })}
          deleteMessage="Admin has been deleted."
          queryKey="account"
          editDialog={
            <AdminForm
              method="patch"
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update a existing branch by filling in the details below."
              buttonLabel="Update"
              firstName={row.original.first_name}
              lastName={row.original.last_name}
              middleInitial={row.original.middle_initial || ""}
              branchId={row.original.branch.branch_id}
              email={row.original.auth.email}
            />
          }
        />
      );
    },
  },
];
