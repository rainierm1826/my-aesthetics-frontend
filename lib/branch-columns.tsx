"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Branch } from "./types";
import { RatingStar } from "@/components/RatingStar";
import ActionCell from "@/components/ActionCell";
import BranchCard from "@/components/BranchCard";
import BranchForm from "@/components/BranchForm";
import { deleteBranch } from "@/api/branch";

export const branchColumns: ColumnDef<Branch>[] = [
  { accessorKey: "branch_id", header: "Branch ID" },
  { accessorKey: "branch_name", header: "Branch Name" },

  {
    accessorKey: "avarage_rate",
    header: "Avarage Rate",
    cell: ({ row }) => <RatingStar rating={row.original.avarage_rate} />,
  },

  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const { region, city } = row.original.address;
      return `${region}, ${city}`;
    },
  },

  { accessorKey: "address.region", id: "region", header: "Region" },
  { accessorKey: "address.province", id: "province", header: "Province" },
  { accessorKey: "address.city", id: "city", header: "City" },
  { accessorKey: "address.barangay", id: "barangay", header: "Barangay" },
  { accessorKey: "address.lot", id: "lot", header: "Lot" },

  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original; // Branch
      const address = branch.address;

      return (
        <ActionCell
          data={branch}
          getId={(b) => b.branch_id}
          onEdit={(b) => console.log("Edit branch", b.branch_id)}
          onDelete={(b) => console.log("Delete branch", b.branch_id)}
          onPreview={(b) => console.log("More info", b.branch_id)}
          previewDialog={<BranchCard />}
          editDialog={
            <BranchForm
              method="patch"
              deleteFn={async (id: string) =>
                await deleteBranch({ branch_id: id })
              }
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update the branch by filling in the details below."
              buttonLabel="Update"
              barangay={address.barangay}
              branchId={branch.branch_id}
              city={address.city}
              branchName={branch.branch_name}
              lot={address.lot}
              province={address.province}
              region={address.region}
              image={branch.image}
            />
          }
        />
      );
    },
  },
];
