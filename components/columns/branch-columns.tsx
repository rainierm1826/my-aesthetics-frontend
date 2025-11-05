"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Branch } from "../../lib/types/branch-types";
import { RatingStar } from "@/components/RatingStar";
import ActionCell from "@/components/ActionCell";
import BranchCard from "@/components/cards/BranchCard";
import BranchForm from "@/components/forms/BranchForm";
import { deleteData } from "@/lib/function";

export const branchColumns: ColumnDef<Branch>[] = [
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
  { accessorKey: "slot_capacity", id: "slot_capacity", header: "Slot Capacity" },
  { accessorKey: "address.region", id: "region", header: "Region" },
  { accessorKey: "address.province", id: "province", header: "Province" },
  { accessorKey: "address.city", id: "city", header: "City" },
  { accessorKey: "address.barangay", id: "barangay", header: "Barangay" },
  { accessorKey: "address.lot", id: "lot", header: "Lot" },

  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      const address = branch.address;

      return (
        <ActionCell
          queryKey="branch"
          id={branch.branch_id}
          previewDialog={
            <BranchCard
              branch_id={branch.branch_id}
              rating={branch.avarage_rate}
              status={branch.status}
              barangay={address.barangay}
              city={address.city}
              branchName={branch.branch_name}
              lot={address.lot}
              province={address.province}
              image={branch.image}
              opening_time={branch.opening_time}
              closing_time={branch.closing_time}
            />
          }
          deleteFn={(id: string) => deleteData({ id: id, url: "branch" })}
          deleteMessage="Branch has been deleted."
          editDialog={
            <BranchForm
              addressId={address.address_id}
              method="patch"
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
              opening_time={branch.opening_time}
              closing_time={branch.closing_time}
              slot_capacity={branch.slot_capacity}
            />
          }
        />
      );
    },
  },
];
