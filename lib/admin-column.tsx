"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "./types";
import ActionCell from "@/components/ActionCell";
import AdminForm from "@/components/AdminForm";
export const adminColumn: ColumnDef<Admin>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { firstName, middleInitial, lastName } = row.original;
      return `${firstName} ${middleInitial}. ${lastName}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          data={row.original}
          getId={(u) => u.firstName}
          onEdit={(u) => console.log("Edit user", u)}
          onDelete={(u) => console.log("Delete user", u.firstName)}
          editDialog={
            <AdminForm
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update a existing branch by filling in the details below."
              buttonLabel="Update"
              firstName={row.original.firstName}
              lastName={row.original.lastName}
              middleInitial={row.original.middleInitial}
              email={row.original.email}
              branchName={row.original.branchName}
            />
          }
        />
      );
    },
  },
];
