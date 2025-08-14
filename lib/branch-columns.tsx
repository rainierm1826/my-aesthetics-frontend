"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Branch } from "./types";
import { RatingStar } from "@/components/RatingStar";
import ActionCell from "@/components/ActionCell";
import BranchCard from "@/components/BranchCard";
import BranchForm from "@/components/BranchForm";

export const branchColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },

  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.avarageRate} />;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const { region, city } = row.original;
      return `${region}, ${city}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          data={row.original}
          getId={(u) => u.branchName}
          onEdit={(u) => console.log("Edit user", u)}
          onDelete={(u) => console.log("Delete user", u.branchName)}
          onPreview={(a) => console.log("More info", a)}
          previewDialog={<BranchCard />}
          editDialog={
            <BranchForm
              renderDialog={false}
              formTitle="Edit Admin"
              formDescription="Update a existing admin by filling in the details below."
              buttonLabel="Update"
              barangay={row.original.barangay}
              city={row.original.city}
              branchName={row.original.branchName}
              lot={row.original.blk}
              province={row.original.city}
              region={row.original.region}
            />
          }
        />
      );
    },
  },
];
